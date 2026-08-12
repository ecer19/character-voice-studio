"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/lib/language-context";
import { LanguageToggle } from "@/components/LanguageToggle";
import { FloatingOrbs } from "@/components/FloatingOrbs";

const SHOWCASE_FULLBODY_URL =
  "https://epconbbigrjdwhkcjlhn.supabase.co/storage/v1/object/public/character%20voice%20studio/fullbody/fd242ea7-4ba9-49fb-b444-a23470c71df8.jpeg";

export default function LandingPage() {
  const { t } = useLanguage();

  return (
    <div className="relative min-h-screen flex-1 overflow-hidden bg-gradient-to-br from-white via-purple-50 to-purple-200 dark:from-[#0b0713] dark:via-[#170b28] dark:to-[#2a1147]">
      <FloatingOrbs />

      <header className="relative flex items-center justify-between p-4 sm:p-8">
        <span className="text-lg font-semibold bg-gradient-to-r from-purple-700 to-fuchsia-600 dark:from-purple-300 dark:to-fuchsia-300 bg-clip-text text-transparent">
          {t("appTitle")}
        </span>
        <LanguageToggle />
      </header>

      <main className="relative mx-auto flex max-w-5xl flex-col items-center gap-8 px-4 pb-16 pt-4 text-center sm:pt-10">
        <span className="rounded-full border border-purple-300/60 bg-white/60 px-4 py-1 text-sm font-medium text-purple-700 backdrop-blur-sm dark:border-purple-400/30 dark:bg-white/5 dark:text-purple-200">
          ✦ {t("landingWelcome")}
        </span>
        <h1 className="max-w-2xl text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-700 via-fuchsia-600 to-purple-500 dark:from-purple-200 dark:via-fuchsia-200 dark:to-purple-300 sm:text-6xl">
          {t("landingHeadline")}
        </h1>
        <p className="max-w-xl text-base opacity-70 sm:text-lg">
          {t("landingSubheadline")}
        </p>

        <Link
          href="/studio"
          className="rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-500 px-8 py-3 text-base font-semibold text-white shadow-lg shadow-purple-500/30 transition-transform hover:scale-105"
        >
          {t("landingStartButton")}
        </Link>

        <div className="relative mt-6 flex w-full max-w-md justify-center overflow-hidden rounded-3xl border border-purple-200/60 bg-white/50 p-6 shadow-2xl shadow-purple-500/20 backdrop-blur-sm dark:border-purple-500/20 dark:bg-white/5">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 50% 30%, rgba(233,213,255,0.6), transparent 70%)",
            }}
          />
          <Image
            src={SHOWCASE_FULLBODY_URL}
            alt="Character Voice Studio showcase character"
            width={340}
            height={480}
            className="animate-character-breathe relative h-[420px] w-auto object-contain drop-shadow-2xl"
            priority
          />
        </div>
      </main>
    </div>
  );
}
