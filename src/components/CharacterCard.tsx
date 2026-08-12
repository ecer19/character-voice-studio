"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/lib/language-context";
import { AppearanceChat } from "@/components/AppearanceChat";
import type { Character } from "@/lib/types";

const BACKGROUNDS = [
  { key: "white", labelKey: "bgWhite", css: "#ffffff" },
  { key: "purple", labelKey: "bgPurple", css: "linear-gradient(135deg, #a855f7, #4c1d95)" },
  { key: "dark", labelKey: "bgDark", css: "#0b0713" },
  {
    key: "grid",
    labelKey: "bgGrid",
    css: "radial-gradient(circle at 50% 30%, #e9d5ff, #f5f3ff)",
  },
  { key: "transparent", labelKey: "bgTransparent", css: "transparent" },
] as const;

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
  const [background, setBackground] = useState<(typeof BACKGROUNDS)[number]>(
    BACKGROUNDS[3]
  );

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
    <div className="flex flex-col gap-4 rounded-xl border border-purple-200/60 dark:border-purple-500/20 bg-white/70 dark:bg-white/5 backdrop-blur-sm p-5 shadow-sm shadow-purple-900/5">
      <div className="flex flex-col sm:flex-row gap-4">
        {character.image_url && (
          <Image
            src={character.image_url}
            alt={character.name}
            width={160}
            height={160}
            className="rounded-lg object-cover w-full sm:w-40 h-40 ring-1 ring-purple-200/60 dark:ring-purple-500/20"
          />
        )}
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold">{character.name}</h3>
          <p className="text-sm opacity-80">{character.personality}</p>
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleView3d}
          disabled={generating}
          className="rounded-md bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          {generating
            ? t("generating3dButton")
            : character.model_url
              ? t("view3dButton")
              : t("generate3dButton")}
        </button>

        {showModel && character.model_url && (
          <div className="flex items-center gap-1.5">
            <span className="text-xs opacity-60">{t("backgroundLabel")}:</span>
            {BACKGROUNDS.map((bg) => (
              <button
                key={bg.key}
                type="button"
                title={t(bg.labelKey)}
                onClick={() => setBackground(bg)}
                className={`h-6 w-6 rounded-full border-2 ${
                  background.key === bg.key
                    ? "border-purple-600"
                    : "border-black/10 dark:border-white/20"
                }`}
                style={{
                  background:
                    bg.key === "transparent"
                      ? "repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%) 50% / 8px 8px"
                      : bg.css,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {showModel && character.model_url && (
        <div
          className="rounded-lg overflow-hidden"
          style={{
            background:
              background.key === "transparent"
                ? "repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%) 50% / 24px 24px"
                : background.css,
          }}
        >
          <model-viewer
            src={character.model_url}
            alt={character.name}
            camera-controls
            auto-rotate
            shadow-intensity="1"
            style={{ width: "100%", height: "360px", background: "transparent" }}
          />
        </div>
      )}

      <AppearanceChat character={character} onUpdated={onUpdated} />
    </div>
  );
}
