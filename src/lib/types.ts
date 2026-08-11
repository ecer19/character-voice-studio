export interface Character {
  id: string;
  name: string;
  personality: string;
  appearance: string;
  voice: string;
  image_url: string | null;
  created_at: string;
}

export interface VoiceRecording {
  id: string;
  character_id: string;
  text: string;
  emotion: string;
  audio_url: string | null;
  created_at: string;
  character?: Pick<Character, "id" | "name" | "image_url">;
}
