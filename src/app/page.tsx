"use client";

import { useEffect, useState } from "react";
import { CharacterForm } from "@/components/CharacterForm";
import { VoiceStudio } from "@/components/VoiceStudio";
import { VoiceHistory } from "@/components/VoiceHistory";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useLanguage } from "@/lib/language-context";
import type { Character } from "@/lib/types";

const STORAGE_KEY = "cvs_character_id";

export default function Home() {
  const { t } = useLanguage();
  const [character, setCharacter] = useState<Character | null>(null);
  const [historyKey, setHistoryKey] = useState(0);
  const [restoring, setRestoring] = useState(true);

  useEffect(() => {
    const id = localStorage.getItem(STORAGE_KEY);
    if (!id) {
      setRestoring(false);
      return;
    }
    fetch(`/api/characters/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.character) setCharacter(data.character);
        else localStorage.removeItem(STORAGE_KEY);
      })
      .finally(() => setRestoring(false));
  }, []);

  function handleCharacterCreated(c: Character) {
    setCharacter(c);
    localStorage.setItem(STORAGE_KEY, c.id);
  }

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 flex flex-col gap-6 p-4 sm:p-8">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{t("appTitle")}</h1>
          <p className="text-sm opacity-70">{t("appSubtitle")}</p>
        </div>
        <LanguageToggle />
      </header>

      {restoring ? (
        <p className="text-sm opacity-70">{t("loading")}</p>
      ) : (
        <>
          <CharacterForm onCreated={handleCharacterCreated} />

          {character && (
            <VoiceStudio
              character={character}
              onGenerated={() => setHistoryKey((k) => k + 1)}
            />
          )}

          <VoiceHistory refreshKey={historyKey} />
        </>
      )}
    </main>
  );
}
