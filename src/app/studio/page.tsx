"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CharacterForm } from "@/components/CharacterForm";
import { CharacterCard } from "@/components/CharacterCard";
import { VoiceStudio } from "@/components/VoiceStudio";
import { VoiceHistory } from "@/components/VoiceHistory";
import { LanguageToggle } from "@/components/LanguageToggle";
import { FloatingOrbs } from "@/components/FloatingOrbs";
import { Grain } from "@/components/Grain";
import { useLanguage } from "@/lib/language-context";
import type { Character } from "@/lib/types";

const STORAGE_KEY = "cvs_character_id";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

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
    <div className="relative min-h-screen flex-1 bg-[#0b0713] text-white">
      <Grain />
      <FloatingOrbs />

      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 z-40 border-b border-white/10 bg-[#0b0713]/70 backdrop-blur-md"
      >
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4 px-4 py-4 sm:px-8">
          <Link href="/" className="group">
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-300 to-fuchsia-300 bg-clip-text text-transparent group-hover:opacity-80">
              {t("appTitle")}
            </h1>
            <p className="text-xs text-purple-100/60">{t("appSubtitle")}</p>
          </Link>
          <LanguageToggle />
        </div>
      </motion.header>

      <main className="relative mx-auto w-full max-w-3xl flex-1 flex flex-col gap-6 p-4 sm:p-8">
        {restoring ? (
          <p className="text-sm text-purple-100/60">{t("loading")}</p>
        ) : (
          <>
            <motion.div
              initial="hidden"
              animate="show"
              variants={fadeUp}
              transition={{ duration: 0.5 }}
            >
              <CharacterForm onCreated={handleCharacterCreated} />
            </motion.div>

            {character && (
              <>
                <motion.div
                  initial="hidden"
                  animate="show"
                  variants={fadeUp}
                  transition={{ duration: 0.5 }}
                >
                  <CharacterCard character={character} onUpdated={setCharacter} />
                </motion.div>
                <motion.div
                  initial="hidden"
                  animate="show"
                  variants={fadeUp}
                  transition={{ duration: 0.5, delay: 0.05 }}
                >
                  <VoiceStudio
                    character={character}
                    onGenerated={() => setHistoryKey((k) => k + 1)}
                  />
                </motion.div>
              </>
            )}

            <motion.div
              initial="hidden"
              animate="show"
              variants={fadeUp}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <VoiceHistory refreshKey={historyKey} />
            </motion.div>
          </>
        )}
      </main>
    </div>
  );
}
