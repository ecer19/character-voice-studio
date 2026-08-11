import { supabase } from "./supabase";

export const BUCKET = "character voice studio";

export async function uploadFromUrl(
  path: string,
  sourceUrl: string,
  contentType: string
): Promise<string> {
  const res = await fetch(sourceUrl);
  if (!res.ok) {
    throw new Error(`Failed to download generated file: ${res.status}`);
  }
  const bytes = await res.arrayBuffer();

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, Buffer.from(bytes), { contentType, upsert: true });
  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
