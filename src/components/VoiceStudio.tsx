"use client";

import { useState } from "react";
import Image from "next/image";
import { EMOTIONS } from "@/lib/voices";
import { useLanguage } from "@/lib/language-context";
import type { Character, VoiceRecording } from "@/lib/types";
import type { Lang } from "@/lib/i18n";

export function VoiceStudio({
  character,
  onGenerated,
}: {
  character: Character;
  onGenerated: (recording: VoiceRecording) => void;
}) {
  const { t } = useLanguage();
  const [text, setText] = useState("");
  const [textLang, setTextLang] = useState<Lang>("en");
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
        body: JSON.stringify({
          character_id: character.id,
          text,
          emotion,
          language: textLang,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? t("errorSpeechGeneration"));
      setResult(data.recording);
      onGenerated(data.recording);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t("errorSpeechGeneration")
      );
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-white/10 p-5">
      <h2 className="text-lg font-semibold">{t("voiceStudioHeading")}</h2>

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
          <p className="text-xs opacity-70">
            {t("voiceLabel")}: {character.voice}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-1 text-sm">
        <div className="flex items-center justify-between">
          <span>{t("speechTextLabel")}</span>
          <div className="inline-flex rounded-full border border-white/15 p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setTextLang("en")}
              className={`px-2.5 py-1 rounded-full ${
                textLang === "en" ? "bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white" : "opacity-70"
              }`}
            >
              {t("textLanguageEnglish")}
            </button>
            <button
              type="button"
              onClick={() => setTextLang("tr")}
              className={`px-2.5 py-1 rounded-full ${
                textLang === "tr" ? "bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white" : "opacity-70"
              }`}
            >
              {t("textLanguageTurkish")}
            </button>
          </div>
        </div>
        <textarea
          className="rounded-md border border-white/15 bg-transparent px-3 py-2"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={
            textLang === "tr"
              ? t("speechTextPlaceholderTr")
              : t("speechTextPlaceholderEn")
          }
          rows={3}
        />
      </div>

      <div className="flex flex-col gap-2 text-sm">
        {t("emotionLabel")}
        <div className="flex flex-wrap gap-2">
          {EMOTIONS.map((e) => (
            <button
              key={e.label}
              type="button"
              onClick={() => setEmotion(e.label)}
              className={`text-xs px-3 py-1.5 rounded-full border ${
                emotion === e.label
                  ? "bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white border-purple-600"
                  : "border-white/15"
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
        className="rounded-md bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white px-4 py-2 font-medium disabled:opacity-50"
      >
        {generating ? t("generatingButton") : t("generateSpeechButton")}
      </button>

      {result && (
        <div className="flex flex-col gap-3 rounded-md border border-white/10 p-4">
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
                className="text-xs px-3 py-1.5 rounded bg-white/10"
              >
                {t("downloadButton")}
              </a>
            )}
            <button
              type="button"
              onClick={generate}
              disabled={generating}
              className="text-xs px-3 py-1.5 rounded bg-white/10 disabled:opacity-50"
            >
              {t("generateAgainButton")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
