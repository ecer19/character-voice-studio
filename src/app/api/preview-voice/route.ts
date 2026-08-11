import { NextResponse } from "next/server";
import { fal } from "@/lib/fal";
import { VOICES } from "@/lib/voices";

const PREVIEW_TEXT = "Hello! This is a preview of my voice.";

export async function POST(request: Request) {
  const { voice } = (await request.json()) as { voice?: string };

  if (!voice || !VOICES.includes(voice as (typeof VOICES)[number])) {
    return NextResponse.json({ error: "invalid voice" }, { status: 400 });
  }

  try {
    const result = await fal.subscribe("fal-ai/elevenlabs/tts/eleven-v3", {
      input: { text: PREVIEW_TEXT, voice },
    });

    const audioUrl = result.data.audio?.url;
    if (!audioUrl) {
      return NextResponse.json(
        { error: "Voice preview failed" },
        { status: 502 }
      );
    }

    return NextResponse.json({ audioUrl });
  } catch (err) {
    console.error("preview-voice failed:", err);
    return NextResponse.json(
      { error: "Voice preview failed" },
      { status: 500 }
    );
  }
}
