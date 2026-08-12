import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { fal } from "@/lib/fal";
import { supabase } from "@/lib/supabase";
import { uploadFromUrl } from "@/lib/storage";

export async function POST(request: Request) {
  const { character_id, instruction } = (await request.json()) as {
    character_id?: string;
    instruction?: string;
  };

  if (!character_id || !instruction?.trim()) {
    return NextResponse.json(
      { error: "character_id and instruction are required" },
      { status: 400 }
    );
  }

  try {
    const { data: character, error: charError } = await supabase
      .from("cvs_characters")
      .select("*")
      .eq("id", character_id)
      .single();
    if (charError || !character) {
      return NextResponse.json({ error: "Character not found" }, { status: 404 });
    }

    const updatedAppearance = `${character.appearance} ${instruction.trim()}`;

    const prompt = `Create a polished character portrait.
Character name: ${character.name}
Personality: ${character.personality}
Appearance: ${updatedAppearance}
Centered composition, expressive face, clean background, high-quality digital character illustration.`;

    const result = await fal.subscribe("fal-ai/flux/schnell", {
      input: { prompt, image_size: "portrait_4_3" },
    });
    const image = result.data.images?.[0];
    if (!image?.url) {
      return NextResponse.json({ error: "Appearance update failed" }, { status: 502 });
    }

    const imageUrl = await uploadFromUrl(
      `characters/${randomUUID()}.${image.content_type === "image/png" ? "png" : "jpeg"}`,
      image.url,
      image.content_type ?? "image/jpeg"
    );

    const { data: updated, error: updateError } = await supabase
      .from("cvs_characters")
      .update({
        appearance: updatedAppearance,
        image_url: imageUrl,
        model_url: null,
      })
      .eq("id", character_id)
      .select()
      .single();
    if (updateError) throw updateError;

    return NextResponse.json({ character: updated });
  } catch (err) {
    console.error("edit-appearance failed:", err);
    return NextResponse.json({ error: "Appearance update failed" }, { status: 500 });
  }
}
