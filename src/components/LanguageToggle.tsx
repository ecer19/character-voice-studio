"use client";

import { useLanguage } from "@/lib/language-context";

export function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="inline-flex items-center gap-2 text-xs tracking-wide">
      <button
        type="button"
        onClick={() => setLang("tr")}
        className={`transition-colors ${
          lang === "tr" ? "text-gold" : "text-ivory-dim hover:text-gold"
        }`}
      >
        TR
      </button>
      <span className="text-ivory-dim">/</span>
      <button
        type="button"
        onClick={() => setLang("en")}
        className={`transition-colors ${
          lang === "en" ? "text-gold" : "text-ivory-dim hover:text-gold"
        }`}
      >
        EN
      </button>
    </div>
  );
}
