import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { fal } from "@/lib/fal";
import { supabase } from "@/lib/supabase";
import { uploadFromUrl } from "@/lib/storage";

export const maxDuration = 120;

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

    const trimmedInstruction = instruction.trim();
    const updatedAppearance = `${character.appearance}. ${trimmedInstruction}`;
    const hadFullbody = Boolean(character.fullbody_url);

    // Portraits are a tight headshot crop, so outfit/clothing changes (e.g. "put a dress on
    // her") are invisible there. When a full-body image already exists we regenerate it too
    // (in parallel) so those edits are actually visible.
    //
    // Diffusion prompts work best as a plain, literal description of the final image, not as
    // meta-instructions like "override" / "ignore the following" — the text encoder has no
    // real instruction-following ability, so that kind of talk is just noise, and negations
    // ("no armor") often backfire because the encoder still keys off the negated word. So the
    // new outfit is stated first, as a plain caption clause, before any of the older
    // appearance text that might otherwise dominate (e.g. an archetype word like "warrior").
    const outfitClause = (name: string) =>
      `${name} is standing here wearing exactly this, as her current outfit, replacing anything she wore before: ${trimmedInstruction}. Her outfit is: ${trimmedInstruction}.`;

    const portraitPrompt = `Create a polished character portrait. ${outfitClause(character.name)}
Other appearance details (hair, eyes, face — keep these, ignore any old clothing mentioned here): ${character.appearance}.
Personality: ${character.personality}.
Centered composition, expressive face, clean background, high-quality digital character illustration.`;

    const fullbodyPrompt = `Full-body character illustration, head to toe, standing in a natural relaxed pose, facing forward. ${outfitClause(character.name)}
Other appearance details (hair, eyes, face — keep these, ignore any old clothing mentioned here): ${character.appearance}.
Personality: ${character.personality}.
Sharp, highly detailed, symmetrical facial features, clear expressive eyes, well-defined nose and mouth, natural expression, studio lighting.
Centered composition, plain clean background, high-resolution digital character illustration.`;

    const [portraitResult, fullbodyResult] = await Promise.all([
      fal.subscribe("fal-ai/flux/dev", {
        input: {
          prompt: portraitPrompt,
          image_size: "portrait_4_3",
          num_inference_steps: 30,
          guidance_scale: 4.5,
        },
      }),
      hadFullbody
        ? fal.subscribe("fal-ai/flux/dev", {
            input: {
              prompt: fullbodyPrompt,
              image_size: { width: 1024, height: 1536 },
              num_inference_steps: 35,
              guidance_scale: 4.5,
            },
          })
        : Promise.resolve(null),
    ]);

    const image = portraitResult.data.images?.[0];
    if (!image?.url) {
      return NextResponse.json({ error: "Appearance update failed" }, { status: 502 });
    }

    const imageUrl = await uploadFromUrl(
      `characters/${randomUUID()}.${image.content_type === "image/png" ? "png" : "jpeg"}`,
      image.url,
      image.content_type ?? "image/jpeg"
    );

    let fullbodyUrl: string | null = null;
    const fbImage = fullbodyResult?.data.images?.[0];
    if (fbImage?.url) {
      fullbodyUrl = await uploadFromUrl(
        `fullbody/${randomUUID()}.${fbImage.content_type === "image/png" ? "png" : "jpeg"}`,
        fbImage.url,
        fbImage.content_type ?? "image/jpeg"
      );
    }

    const { data: updated, error: updateError } = await supabase
      .from("cvs_characters")
      .update({
        appearance: updatedAppearance,
        image_url: imageUrl,
        fullbody_url: fullbodyUrl,
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
