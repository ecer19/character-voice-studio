import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { fal } from "@/lib/fal";
import { supabase } from "@/lib/supabase";
import { uploadFromUrl } from "@/lib/storage";
import { VOICES } from "@/lib/voices";

export async function POST(request: Request) {
  const body = await request.json();
  const { name, personality, appearance, voice } = body as {
    name?: string;
    personality?: string;
    appearance?: string;
    voice?: string;
  };

  if (!name?.trim() || !personality?.trim() || !appearance?.trim()) {
    return NextResponse.json(
      { error: "name, personality and appearance are required" },
      { status: 400 }
    );
  }
  if (!voice || !VOICES.includes(voice as (typeof VOICES)[number])) {
    return NextResponse.json({ error: "invalid voice" }, { status: 400 });
  }

  try {
    const prompt = `Create a polished character portrait.
Character name: ${name}
Personality: ${personality}
Appearance: ${appearance}
Centered composition, expressive face, clean background, high-quality digital character illustration.`;

    const result = await fal.subscribe("fal-ai/flux/schnell", {
      input: {
        prompt,
        image_size: "portrait_4_3",
      },
    });

    const image = result.data.images?.[0];
    if (!image?.url) {
      return NextResponse.json(
        { error: "Image generation failed" },
        { status: 502 }
      );
    }

    const imageUrl = await uploadFromUrl(
      `characters/${randomUUID()}.${image.content_type === "image/png" ? "png" : "jpeg"}`,
      image.url,
      image.content_type ?? "image/jpeg"
    );

    const { data: character, error } = await supabase
      .from("cvs_characters")
      .insert({ name, personality, appearance, voice, image_url: imageUrl })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ character });
  } catch (err) {
    console.error("generate-character failed:", err);
    return NextResponse.json(
      { error: "Character generation failed" },
      { status: 500 }
    );
  }
}
