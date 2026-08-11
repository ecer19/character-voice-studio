import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { fal } from "@/lib/fal";
import { supabase } from "@/lib/supabase";
import { uploadFromUrl } from "@/lib/storage";

export const maxDuration = 300;

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

    const fullBodyPrompt = `Full-body character reference sheet, head to toe, standing in a neutral pose, facing forward.
Character name: ${character.name}
Personality: ${character.personality}
Appearance: ${character.appearance}
Centered composition, plain clean background, even lighting, high-quality digital character illustration.`;

    const imageResult = await fal.subscribe("fal-ai/flux/schnell", {
      input: { prompt: fullBodyPrompt, image_size: "portrait_16_9" },
    });
    const fullBodyImage = imageResult.data.images?.[0];
    if (!fullBodyImage?.url) {
      return NextResponse.json(
        { error: "Full-body reference generation failed" },
        { status: 502 }
      );
    }

    const meshResult = await fal.subscribe("fal-ai/hunyuan3d/v2", {
      input: {
        input_image_url: fullBodyImage.url,
        textured_mesh: true,
      },
    });
    const mesh = meshResult.data.model_mesh;
    if (!mesh?.url) {
      return NextResponse.json({ error: "3D model generation failed" }, { status: 502 });
    }

    const modelUrl = await uploadFromUrl(
      `models/${randomUUID()}.glb`,
      mesh.url,
      "model/gltf-binary"
    );

    const { data: updated, error: updateError } = await supabase
      .from("cvs_characters")
      .update({ model_url: modelUrl })
      .eq("id", character_id)
      .select()
      .single();
    if (updateError) throw updateError;

    return NextResponse.json({ character: updated });
  } catch (err) {
    console.error("generate-3d-model failed:", err);
    return NextResponse.json({ error: "3D model generation failed" }, { status: 500 });
  }
}
