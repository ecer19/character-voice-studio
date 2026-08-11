export const VOICES = ["Rachel", "Aria", "Sarah", "Charlotte"] as const;
export type Voice = (typeof VOICES)[number];

export const EMOTIONS = [
  { label: "Neutral", tag: "" },
  { label: "Excited", tag: "[excited]" },
  { label: "Happy", tag: "[happy]" },
  { label: "Sad", tag: "[sad]" },
  { label: "Angry", tag: "[angry]" },
  { label: "Whispering", tag: "[whispering]" },
] as const;
export type Emotion = (typeof EMOTIONS)[number]["label"];

export function emotionTag(emotion: string): string {
  return EMOTIONS.find((e) => e.label === emotion)?.tag ?? "";
}
