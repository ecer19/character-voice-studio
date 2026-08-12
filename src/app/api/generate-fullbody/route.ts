import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { fal } from "@/lib/fal";
import { supabase } from "@/lib/supabase";
import { uploadFromUrl } from "@/lib/storage";

export const maxDuration = 120;

export async function POST(request: Request) {
  const { character_id } = (await request.json()) as { character_id?: string };

  if (!character_id) {
    return NextResponse.json({ error: "character_id is required" }, { status: 400 });
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

    const prompt = `Full-body character illustration, head to toe, standing in a natural relaxed pose, facing forward.
Character name: ${character.name}
Personality: ${character.personality}
Appearance: ${character.appearance}
Sharp, highly detailed, symmetrical facial features, clear expressive eyes, well-defined nose and mouth, natural expression, studio lighting.
Centered composition, plain clean background, high-resolution digital character illustration.`;

    const result = await fal.subscribe("fal-ai/flux/dev", {
      input: {
        prompt,
        image_size: { width: 1024, height: 1536 },
        num_inference_steps: 35,
      },
    });
    const image = result.data.images?.[0];
    if (!image?.url) {
      return NextResponse.json({ error: "Full-body generation failed" }, { status: 502 });
    }

    const fullbodyUrl = await uploadFromUrl(
      `fullbody/${randomUUID()}.${image.content_type === "image/png" ? "png" : "jpeg"}`,
      image.url,
      image.content_type ?? "image/jpeg"
    );

    const { data: updated, error: updateError } = await supabase
      .from("cvs_characters")
      .update({ fullbody_url: fullbodyUrl })
      .eq("id", character_id)
      .select()
      .single();
    if (updateError) throw updateError;

    return NextResponse.json({ character: updated });
  } catch (err) {
    console.error("generate-fullbody failed:", err);
    return NextResponse.json({ error: "Full-body generation failed" }, { status: 500 });
  }
}
