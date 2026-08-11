"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { type Lang, type TranslationKey, t } from "./i18n";

const LanguageContext = createContext<{
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey) => string;
}>({
  lang: "tr",
  setLang: () => {},
  t: (key) => t(key, "tr"),
});

const STORAGE_KEY = "cvs_lang";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("tr");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "tr" || saved === "en") setLangState(saved);
  }, []);

  function setLang(next: Lang) {
    setLangState(next);
    localStorage.setItem(STORAGE_KEY, next);
  }

  return (
    <LanguageContext.Provider
      value={{ lang, setLang, t: (key) => t(key, lang) }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
