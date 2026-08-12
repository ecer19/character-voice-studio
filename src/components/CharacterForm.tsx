"use client";

import { useRef, useState } from "react";
import { VOICES } from "@/lib/voices";
import { useLanguage } from "@/lib/language-context";
import type { Character } from "@/lib/types";

export function CharacterForm({
  onCreated,
}: {
  onCreated: (character: Character) => void;
}) {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [personality, setPersonality] = useState("");
  const [appearance, setAppearance] = useState("");
  const [voice, setVoice] = useState<string>(VOICES[0]);
  const [previewingVoice, setPreviewingVoice] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  async function handlePreview(v: string) {
    setPreviewingVoice(v);
    try {
      const res = await fetch("/api/preview-voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voice: v }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? t("errorPreview"));
      if (audioRef.current) {
        audioRef.current.src = data.audioUrl;
        await audioRef.current.play();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errorPreview"));
    } finally {
      setPreviewingVoice(null);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/generate-character", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, personality, appearance, voice }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? t("errorCharacterGeneration"));
      onCreated(data.character);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t("errorCharacterGeneration")
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 border border-white/[0.08] bg-white/[0.02] p-6"
    >
      <h2 className="font-serif text-xl">{t("createCharacterHeading")}</h2>

      <label className="flex flex-col gap-1.5 text-xs uppercase tracking-[0.12em] text-ivory-dim">
        {t("characterNameLabel")}
        <input
          className="border border-white/15 bg-transparent px-3 py-2 text-sm normal-case tracking-normal text-ivory focus:border-gold focus:outline-none"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Luna"
          required
        />
      </label>

      <label className="flex flex-col gap-1.5 text-xs uppercase tracking-[0.12em] text-ivory-dim">
        {t("personalityLabel")}
        <textarea
          className="border border-white/15 bg-transparent px-3 py-2 text-sm normal-case tracking-normal text-ivory focus:border-gold focus:outline-none"
          value={personality}
          onChange={(e) => setPersonality(e.target.value)}
          placeholder="Curious, energetic, confident and slightly sarcastic."
          rows={2}
          required
        />
      </label>

      <label className="flex flex-col gap-1.5 text-xs uppercase tracking-[0.12em] text-ivory-dim">
        {t("appearanceLabel")}
        <textarea
          className="border border-white/15 bg-transparent px-3 py-2 text-sm normal-case tracking-normal text-ivory focus:border-gold focus:outline-none"
          value={appearance}
          onChange={(e) => setAppearance(e.target.value)}
          placeholder="A young space explorer with silver hair, round glasses and a futuristic blue jacket."
          rows={2}
          required
        />
      </label>

      <div className="flex flex-col gap-2 text-xs uppercase tracking-[0.12em] text-ivory-dim">
        {t("voiceSelectionLabel")}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {VOICES.map((v) => (
            <div
              key={v}
              className={`flex flex-col items-center gap-2 border p-2 transition-colors ${
                voice === v
                  ? "border-gold bg-[rgba(203,167,105,0.08)]"
                  : "border-white/15"
              }`}
            >
              <button
                type="button"
                onClick={() => setVoice(v)}
                className={`text-sm normal-case tracking-normal ${voice === v ? "text-gold" : "text-ivory"}`}
              >
                {v}
              </button>
              <button
                type="button"
                onClick={() => handlePreview(v)}
                disabled={previewingVoice === v}
                className="text-[0.65rem] normal-case tracking-normal px-2 py-1 border border-white/15 text-ivory-dim hover:border-white/30 disabled:opacity-50"
              >
                {previewingVoice === v
                  ? t("previewingButton")
                  : t("previewButton")}
              </button>
            </div>
          ))}
        </div>
      </div>
      <audio ref={audioRef} className="hidden" />

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="btn-gold-fill px-6 py-3 text-sm font-medium uppercase tracking-[0.15em] disabled:opacity-50"
      >
        {submitting ? t("generatingButton") : t("generateCharacterButton")}
      </button>
    </form>
  );
}
