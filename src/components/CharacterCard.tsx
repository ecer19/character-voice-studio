"use client";

import { useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/lib/language-context";
import { AppearanceChat } from "@/components/AppearanceChat";
import { Lightbox } from "@/components/Lightbox";
import type { Character } from "@/lib/types";

export function CharacterCard({
  character,
  onUpdated,
}: {
  character: Character;
  onUpdated: (character: Character) => void;
}) {
  const { t } = useLanguage();
  const [showFullbody, setShowFullbody] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  async function handleViewFullbody() {
    if (character.fullbody_url) {
      setShowFullbody(true);
      return;
    }
    setError(null);
    setGenerating(true);
    try {
      const res = await fetch("/api/generate-fullbody", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ character_id: character.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? t("errorFullbody"));
      onUpdated(data.character);
      setShowFullbody(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errorFullbody"));
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="flex flex-col gap-5 border border-white/[0.08] bg-white/[0.02] p-6">
      <div className="flex flex-col sm:flex-row gap-5">
        {character.image_url && (
          <button
            type="button"
            onClick={() => setLightboxUrl(character.image_url)}
            className="group relative w-full sm:w-40 h-40 shrink-0 cursor-zoom-in border border-white/[0.08]"
          >
            <Image
              src={character.image_url}
              alt={character.name}
              width={160}
              height={160}
              className="h-full w-full object-cover"
            />
            <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 text-xs uppercase tracking-[0.12em] text-transparent transition-colors group-hover:bg-black/40 group-hover:text-ivory">
              {t("viewLargeButton")}
            </span>
          </button>
        )}
        <div className="flex flex-col gap-2">
          <h3 className="font-serif text-xl">{character.name}</h3>
          <p className="text-sm text-ivory-dim">{character.personality}</p>
        </div>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="button"
        onClick={handleViewFullbody}
        disabled={generating}
        className="btn-gold-fill self-start px-6 py-3 text-sm font-medium uppercase tracking-[0.15em] disabled:opacity-50"
      >
        {generating
          ? t("generatingFullbodyButton")
          : character.fullbody_url
            ? t("viewFullbodyButton")
            : t("generateFullbodyButton")}
      </button>

      {showFullbody && character.fullbody_url && (
        <div className="relative flex justify-center border border-white/[0.08] bg-gradient-to-b from-lux-violet/20 to-transparent p-6 overflow-hidden">
          <button
            type="button"
            onClick={() => setLightboxUrl(character.fullbody_url)}
            className="cursor-zoom-in"
          >
            <Image
              src={character.fullbody_url}
              alt={character.name}
              width={320}
              height={480}
              className="animate-character-breathe h-[420px] w-auto object-contain drop-shadow-xl"
            />
          </button>
          <div className="animate-character-shadow absolute bottom-4 h-4 w-40 rounded-full bg-black/40 blur-md" />
        </div>
      )}

      <AppearanceChat character={character} onUpdated={onUpdated} />

      {lightboxUrl && (
        <Lightbox
          src={lightboxUrl}
          alt={character.name}
          onClose={() => setLightboxUrl(null)}
        />
      )}
    </div>
  );
}
