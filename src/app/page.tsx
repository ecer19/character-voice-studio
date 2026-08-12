"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import { LanguageToggle } from "@/components/LanguageToggle";
import { FloatingOrbs } from "@/components/FloatingOrbs";

const SHOWCASE_MODEL_URL =
  "https://epconbbigrjdwhkcjlhn.supabase.co/storage/v1/object/public/character%20voice%20studio/models/0f724313-37a7-4ac6-8d6f-d9924701bf5c.glb";

export default function LandingPage() {
  const { t } = useLanguage();

  useEffect(() => {
    import("@google/model-viewer");
  }, []);

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

        <div className="mt-6 w-full max-w-md rounded-3xl border border-purple-200/60 bg-white/50 p-2 shadow-2xl shadow-purple-500/20 backdrop-blur-sm dark:border-purple-500/20 dark:bg-white/5">
          <model-viewer
            src={SHOWCASE_MODEL_URL}
            alt="Character Voice Studio showcase character"
            camera-controls
            auto-rotate
            shadow-intensity="1"
            style={{
              width: "100%",
              height: "420px",
              background:
                "radial-gradient(circle at 50% 30%, rgba(233,213,255,0.6), transparent 70%)",
            }}
          />
        </div>
      </main>
    </div>
  );
}
