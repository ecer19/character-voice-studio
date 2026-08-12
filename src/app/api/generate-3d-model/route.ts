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

    const fullBodyPrompt = `Full-body character reference sheet, head to toe, standing in a symmetrical T-pose, facing directly forward, arms slightly away from body.
Character name: ${character.name}
Personality: ${character.personality}
Appearance: ${character.appearance}
Sharp, highly detailed, symmetrical facial features, clear eyes, well-defined nose and mouth, studio lighting, no harsh shadows on the face.
Centered composition, plain flat neutral grey background, high-resolution digital character illustration, 3D-render-ready concept art.`;

    const imageResult = await fal.subscribe("fal-ai/flux/dev", {
      input: {
        prompt: fullBodyPrompt,
        image_size: { width: 1024, height: 1536 },
        num_inference_steps: 35,
      },
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
        octree_resolution: 512,
        num_inference_steps: 50,
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
