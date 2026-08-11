import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { fal } from "@/lib/fal";
import { supabase } from "@/lib/supabase";
import { uploadFromUrl } from "@/lib/storage";
import { EMOTIONS, emotionTag } from "@/lib/voices";

export async function POST(request: Request) {
  const body = await request.json();
  const { character_id, text, emotion, language } = body as {
    character_id?: string;
    text?: string;
    emotion?: string;
    language?: "en" | "tr";
  };

  if (!character_id || !text?.trim()) {
    return NextResponse.json(
      { error: "character_id and text are required" },
      { status: 400 }
    );
  }
  if (!emotion || !EMOTIONS.some((e) => e.label === emotion)) {
    return NextResponse.json({ error: "invalid emotion" }, { status: 400 });
  }
  const languageCode = language === "tr" ? "tr" : "en";

  try {
    const { data: character, error: charError } = await supabase
      .from("cvs_characters")
      .select("*")
      .eq("id", character_id)
      .single();
    if (charError || !character) {
      return NextResponse.json({ error: "Character not found" }, { status: 404 });
    }

    const tag = emotionTag(emotion);
    const ttsText = tag ? `${tag} ${text}` : text;

    const result = await fal.subscribe("fal-ai/elevenlabs/tts/eleven-v3", {
      input: { text: ttsText, voice: character.voice, language_code: languageCode },
    });

    const audio = result.data.audio;
    if (!audio?.url) {
      return NextResponse.json({ error: "Speech generation failed" }, { status: 502 });
    }

    const audioUrl = await uploadFromUrl(
      `recordings/${randomUUID()}.mp3`,
      audio.url,
      audio.content_type ?? "audio/mpeg"
    );

    const { data: recording, error: insertError } = await supabase
      .from("cvs_voice_recordings")
      .insert({ character_id, text, emotion, audio_url: audioUrl })
      .select()
      .single();
    if (insertError) throw insertError;

    return NextResponse.json({ recording, character });
  } catch (err) {
    console.error("generate-speech failed:", err);
    return NextResponse.json({ error: "Speech generation failed" }, { status: 500 });
  }
}
