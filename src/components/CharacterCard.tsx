"use client";

import { useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/lib/language-context";
import { AppearanceChat } from "@/components/AppearanceChat";
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
    <div className="flex flex-col gap-4 rounded-xl border border-purple-500/20 bg-white/[0.03] backdrop-blur-sm p-5 shadow-sm shadow-purple-900/20">
      <div className="flex flex-col sm:flex-row gap-4">
        {character.image_url && (
          <Image
            src={character.image_url}
            alt={character.name}
            width={160}
            height={160}
            className="rounded-lg object-cover w-full sm:w-40 h-40 ring-1 ring-purple-500/20"
          />
        )}
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold">{character.name}</h3>
          <p className="text-sm opacity-80">{character.personality}</p>
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="button"
        onClick={handleViewFullbody}
        disabled={generating}
        className="self-start rounded-md bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white px-4 py-2 text-sm font-medium disabled:opacity-50"
      >
        {generating
          ? t("generatingFullbodyButton")
          : character.fullbody_url
            ? t("viewFullbodyButton")
            : t("generateFullbodyButton")}
      </button>

      {showFullbody && character.fullbody_url && (
        <div className="relative flex justify-center rounded-lg bg-gradient-to-b from-purple-950/30 to-transparent p-6 overflow-hidden">
          <Image
            src={character.fullbody_url}
            alt={character.name}
            width={320}
            height={480}
            className="animate-character-breathe h-[420px] w-auto object-contain drop-shadow-xl"
          />
          <div className="animate-character-shadow absolute bottom-4 h-4 w-40 rounded-full bg-purple-900/30 blur-md" />
        </div>
      )}

      <AppearanceChat character={character} onUpdated={onUpdated} />
    </div>
  );
}
