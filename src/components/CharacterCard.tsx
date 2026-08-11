"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/lib/language-context";
import type { Character } from "@/lib/types";

export function CharacterCard({
  character,
  onUpdated,
}: {
  character: Character;
  onUpdated: (character: Character) => void;
}) {
  const { t } = useLanguage();
  const [showModel, setShowModel] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (showModel) import("@google/model-viewer");
  }, [showModel]);

  async function handleView3d() {
    if (character.model_url) {
      setShowModel(true);
      return;
    }
    setError(null);
    setGenerating(true);
    try {
      const res = await fetch("/api/generate-3d-model", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ character_id: character.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? t("errorModel3d"));
      onUpdated(data.character);
      setShowModel(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errorModel3d"));
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-black/10 dark:border-white/15 p-5">
      <div className="flex flex-col sm:flex-row gap-4">
        {character.image_url && (
          <Image
            src={character.image_url}
            alt={character.name}
            width={160}
            height={160}
            className="rounded-lg object-cover w-full sm:w-40 h-40"
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
        onClick={handleView3d}
        disabled={generating}
        className="self-start rounded-md bg-black/5 dark:bg-white/10 px-4 py-2 text-sm font-medium disabled:opacity-50"
      >
        {generating
          ? t("generating3dButton")
          : character.model_url
            ? t("view3dButton")
            : t("generate3dButton")}
      </button>

      {showModel && character.model_url && (
        <model-viewer
          src={character.model_url}
          alt={character.name}
          camera-controls
          auto-rotate
          shadow-intensity="1"
          style={{ width: "100%", height: "360px", background: "transparent" }}
        />
      )}
    </div>
  );
}
