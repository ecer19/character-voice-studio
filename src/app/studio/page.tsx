"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CharacterForm } from "@/components/CharacterForm";
import { CharacterCard } from "@/components/CharacterCard";
import { VoiceStudio } from "@/components/VoiceStudio";
import { VoiceHistory } from "@/components/VoiceHistory";
import { LanguageToggle } from "@/components/LanguageToggle";
import { FloatingOrbs } from "@/components/FloatingOrbs";
import { useLanguage } from "@/lib/language-context";
import type { Character } from "@/lib/types";

const STORAGE_KEY = "cvs_character_id";

export default function StudioPage() {
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
    <div className="relative min-h-screen flex-1 bg-gradient-to-br from-white via-purple-50 to-purple-100 dark:from-[#0b0713] dark:via-[#170b28] dark:to-[#0b0713]">
      <FloatingOrbs />
      <main className="relative mx-auto w-full max-w-3xl flex-1 flex flex-col gap-6 p-4 sm:p-8">
        <header className="flex items-start justify-between gap-4">
          <Link href="/" className="group">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-fuchsia-600 dark:from-purple-300 dark:to-fuchsia-300 bg-clip-text text-transparent group-hover:opacity-80">
              {t("appTitle")}
            </h1>
            <p className="text-sm opacity-70">{t("appSubtitle")}</p>
          </Link>
          <LanguageToggle />
        </header>

        {restoring ? (
          <p className="text-sm opacity-70">{t("loading")}</p>
        ) : (
          <>
            <CharacterForm onCreated={handleCharacterCreated} />

            {character && (
              <>
                <CharacterCard character={character} onUpdated={setCharacter} />
                <VoiceStudio
                  character={character}
                  onGenerated={() => setHistoryKey((k) => k + 1)}
                />
              </>
            )}

            <VoiceHistory refreshKey={historyKey} />
          </>
        )}
      </main>
    </div>
  );
}
