"use client";

import { useState } from "react";
import Image from "next/image";
import { EMOTIONS } from "@/lib/voices";
import type { Character, VoiceRecording } from "@/lib/types";

export function VoiceStudio({
  character,
  onGenerated,
}: {
  character: Character;
  onGenerated: (recording: VoiceRecording) => void;
}) {
  const [text, setText] = useState("");
  const [emotion, setEmotion] = useState<string>(EMOTIONS[0].label);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<VoiceRecording | null>(null);

  async function generate() {
    if (!text.trim()) return;
    setError(null);
    setGenerating(true);
    try {
      const res = await fetch("/api/generate-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ character_id: character.id, text, emotion }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Speech generation failed");
      setResult(data.recording);
      onGenerated(data.recording);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Speech generation failed");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-black/10 dark:border-white/15 p-5">
      <h2 className="text-lg font-semibold">Voice Studio</h2>

      <div className="flex items-center gap-3">
        {character.image_url && (
          <Image
            src={character.image_url}
            alt={character.name}
            width={48}
            height={48}
            className="rounded-full object-cover"
          />
        )}
        <div>
          <p className="font-medium">{character.name}</p>
          <p className="text-xs opacity-70">Voice: {character.voice}</p>
        </div>
      </div>

      <label className="flex flex-col gap-1 text-sm">
        Speech Text (English only)
        <textarea
          className="rounded-md border border-black/15 dark:border-white/20 bg-transparent px-3 py-2"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Welcome aboard! We are about to explore a planet no human has ever visited."
          rows={3}
        />
      </label>

      <div className="flex flex-col gap-2 text-sm">
        Emotion
        <div className="flex flex-wrap gap-2">
          {EMOTIONS.map((e) => (
            <button
              key={e.label}
              type="button"
              onClick={() => setEmotion(e.label)}
              className={`text-xs px-3 py-1.5 rounded-full border ${
                emotion === e.label
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-black/15 dark:border-white/20"
              }`}
            >
              {e.label}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="button"
        onClick={generate}
        disabled={generating || !text.trim()}
        className="rounded-md bg-blue-600 text-white px-4 py-2 font-medium disabled:opacity-50"
      >
        {generating ? "Generating…" : "Generate Speech"}
      </button>

      {result && (
        <div className="flex flex-col gap-3 rounded-md border border-black/10 dark:border-white/15 p-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">{character.name}</span>
            <span className="opacity-70">· {result.emotion}</span>
          </div>
          <p className="text-sm opacity-80">{result.text}</p>
          {result.audio_url && (
            <audio controls src={result.audio_url} className="w-full" />
          )}
          <div className="flex gap-2">
            {result.audio_url && (
              <a
                href={result.audio_url}
                download
                className="text-xs px-3 py-1.5 rounded bg-black/5 dark:bg-white/10"
              >
                Download
              </a>
            )}
            <button
              type="button"
              onClick={generate}
              disabled={generating}
              className="text-xs px-3 py-1.5 rounded bg-black/5 dark:bg-white/10 disabled:opacity-50"
            >
              Generate Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
