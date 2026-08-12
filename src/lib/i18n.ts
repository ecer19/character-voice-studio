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

  view3dButton: { en: "View in 3D", tr: "3D Görüntüle" },
  generate3dButton: { en: "Generate 3D Model", tr: "3D Model Oluştur" },
  generating3dButton: {
    en: "Generating 3D model… this can take a few minutes",
    tr: "3D model oluşturuluyor… bu birkaç dakika sürebilir",
  },
  errorModel3d: {
    en: "3D model generation failed",
    tr: "3D model oluşturma başarısız oldu",
  },

  backgroundLabel: { en: "3D Background", tr: "3D Arka Plan" },
  bgWhite: { en: "White", tr: "Beyaz" },
  bgPurple: { en: "Purple", tr: "Mor" },
  bgDark: { en: "Dark", tr: "Koyu" },
  bgGrid: { en: "Studio", tr: "Stüdyo" },
  bgTransparent: { en: "Transparent", tr: "Şeffaf" },

  editAppearanceHeading: { en: "Edit Appearance", tr: "Görünüşü Düzenle" },
  editAppearancePlaceholder: {
    en: "e.g. give her red hair and a leather jacket",
    tr: "örn. saçlarını kırmızı yap ve deri ceket giydir",
  },
  editAppearanceSend: { en: "Apply", tr: "Uygula" },
  editAppearanceApplying: { en: "Applying…", tr: "Uygulanıyor…" },
  editAppearanceUpdated: {
    en: "Done — here's the updated look.",
    tr: "Tamamdır — güncellenmiş görünüş bu.",
  },
  editAppearanceHint: {
    en: "3D model will need to be regenerated after an appearance change.",
    tr: "Görünüş değiştiğinde 3D modelin yeniden oluşturulması gerekir.",
  },
  errorEditAppearance: {
    en: "Appearance update failed",
    tr: "Görünüş güncelleme başarısız oldu",
  },

  landingHeadline: { en: "Give your characters a voice.", tr: "Karakterlerine bir ses ver." },
  landingSubheadline: {
    en: "Design a character, see it in 3D, and hear it speak — powered by AI.",
    tr: "Bir karakter tasarla, onu 3D olarak gör ve konuşturmasını dinle — yapay zekâ ile.",
  },
  landingStartButton: { en: "Get Started", tr: "Başla" },
} as const;

export type TranslationKey = keyof typeof dict;

export function t(key: TranslationKey, lang: Lang): string {
  return dict[key][lang];
}
