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
    <div className="flex flex-col gap-5 border border-white/[0.08] bg-white/[0.02] p-6">
      <h2 className="font-serif text-xl">{t("voiceStudioHeading")}</h2>

      <div className="flex items-center gap-3">
        {character.image_url && (
          <Image
            src={character.image_url}
            alt={character.name}
            width={48}
            height={48}
            className="object-cover"
          />
        )}
        <div>
          <p className="font-serif">{character.name}</p>
          <p className="text-xs text-ivory-dim">
            {t("voiceLabel")}: {character.voice}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.12em] text-ivory-dim">
          <span>{t("speechTextLabel")}</span>
          <div className="inline-flex items-center gap-3 normal-case tracking-normal text-xs">
            <button
              type="button"
              onClick={() => setTextLang("en")}
              className={textLang === "en" ? "text-gold" : "text-ivory-dim hover:text-gold"}
            >
              {t("textLanguageEnglish")}
            </button>
            <span className="text-ivory-dim">/</span>
            <button
              type="button"
              onClick={() => setTextLang("tr")}
              className={textLang === "tr" ? "text-gold" : "text-ivory-dim hover:text-gold"}
            >
              {t("textLanguageTurkish")}
            </button>
          </div>
        </div>
        <textarea
          className="border border-white/15 bg-transparent px-3 py-2 text-sm text-ivory focus:border-gold focus:outline-none"
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

      <div className="flex flex-col gap-2 text-xs uppercase tracking-[0.12em] text-ivory-dim">
        {t("emotionLabel")}
        <div className="flex flex-wrap gap-2">
          {EMOTIONS.map((e) => (
            <button
              key={e.label}
              type="button"
              onClick={() => setEmotion(e.label)}
              className={`text-xs normal-case tracking-normal px-3 py-1.5 border transition-colors ${
                emotion === e.label
                  ? "border-gold text-gold bg-[rgba(203,167,105,0.08)]"
                  : "border-white/15 text-ivory hover:border-white/30"
              }`}
            >
              {e.label}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="button"
        onClick={generate}
        disabled={generating || !text.trim()}
        className="btn-gold-fill px-6 py-3 text-sm font-medium uppercase tracking-[0.15em] disabled:opacity-50"
      >
        {generating ? t("generatingButton") : t("generateSpeechButton")}
      </button>

      {result && (
        <div className="flex flex-col gap-3 border border-white/[0.08] p-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-serif">{character.name}</span>
            <span className="text-ivory-dim">· {result.emotion}</span>
          </div>
          <p className="text-sm text-ivory-dim">{result.text}</p>
          {result.audio_url && (
            <audio controls src={result.audio_url} className="w-full" />
          )}
          <div className="flex gap-4 text-xs uppercase tracking-[0.1em]">
            {result.audio_url && (
              <a
                href={result.audio_url}
                download
                className="text-ivory-dim hover:text-gold"
              >
                {t("downloadButton")}
              </a>
            )}
            <button
              type="button"
              onClick={generate}
              disabled={generating}
              className="text-ivory-dim hover:text-gold disabled:opacity-50"
            >
              {t("generateAgainButton")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
