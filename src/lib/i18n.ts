export type Lang = "tr" | "en";

const dict = {
  appTitle: { en: "Character Voice Studio", tr: "Character Voice Studio" },
  appSubtitle: {
    en: "Create a character and bring it to life with voice.",
    tr: "Bir karakter oluştur ve onu sesiyle hayata geçir.",
  },
  loading: { en: "Loading…", tr: "Yükleniyor…" },

  createCharacterHeading: { en: "Create Your Character", tr: "Karakterini Oluştur" },
  characterNameLabel: { en: "Character Name", tr: "Karakter Adı" },
  personalityLabel: { en: "Personality", tr: "Kişilik" },
  appearanceLabel: { en: "Appearance Description", tr: "Görünüş Açıklaması" },
  voiceSelectionLabel: { en: "Voice Selection", tr: "Ses Seçimi" },
  previewButton: { en: "Preview", tr: "Önizle" },
  previewingButton: { en: "Playing…", tr: "Çalıyor…" },
  generateCharacterButton: { en: "Generate Character", tr: "Karakteri Oluştur" },
  generatingButton: { en: "Generating…", tr: "Oluşturuluyor…" },

  voiceStudioHeading: { en: "Voice Studio", tr: "Ses Stüdyosu" },
  voiceLabel: { en: "Voice", tr: "Ses" },
  speechTextLabel: { en: "Speech Text", tr: "Konuşma Metni" },
  speechTextPlaceholderEn: {
    en: "Welcome aboard! We are about to explore a planet no human has ever visited.",
    tr: "Welcome aboard! We are about to explore a planet no human has ever visited.",
  },
  speechTextPlaceholderTr: {
    en: "Hoş geldiniz! Hiçbir insanın gitmediği bir gezegeni keşfetmek üzereyiz.",
    tr: "Hoş geldiniz! Hiçbir insanın gitmediği bir gezegeni keşfetmek üzereyiz.",
  },
  textLanguageLabel: { en: "Text language", tr: "Metin dili" },
  textLanguageEnglish: { en: "English", tr: "İngilizce" },
  textLanguageTurkish: { en: "Turkish", tr: "Türkçe" },
  emotionLabel: { en: "Emotion", tr: "Duygu" },
  generateSpeechButton: { en: "Generate Speech", tr: "Sesi Oluştur" },
  generateAgainButton: { en: "Generate Again", tr: "Tekrar Oluştur" },
  downloadButton: { en: "Download", tr: "İndir" },

  voiceHistoryHeading: { en: "Voice History", tr: "Ses Geçmişi" },
  noRecordingsYet: { en: "No recordings yet.", tr: "Henüz kayıt yok." },

  errorCharacterGeneration: {
    en: "Character generation failed",
    tr: "Karakter oluşturma başarısız oldu",
  },
  errorSpeechGeneration: {
    en: "Speech generation failed",
    tr: "Ses oluşturma başarısız oldu",
  },
  errorPreview: { en: "Preview failed", tr: "Önizleme başarısız oldu" },
} as const;

export type TranslationKey = keyof typeof dict;

export function t(key: TranslationKey, lang: Lang): string {
  return dict[key][lang];
}
