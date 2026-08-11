"use client";

import { useLanguage } from "@/lib/language-context";

export function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="inline-flex rounded-full border border-black/15 dark:border-white/20 p-0.5 text-xs">
      <button
        type="button"
        onClick={() => setLang("tr")}
        className={`px-2.5 py-1 rounded-full ${
          lang === "tr" ? "bg-blue-600 text-white" : "opacity-70"
        }`}
      >
        TR
      </button>
      <button
        type="button"
        onClick={() => setLang("en")}
        className={`px-2.5 py-1 rounded-full ${
          lang === "en" ? "bg-blue-600 text-white" : "opacity-70"
        }`}
      >
        EN
      </button>
    </div>
  );
}
