import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("cvs_voice_recordings")
    .select("*, character:cvs_characters(id, name, image_url)")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("voice-history failed:", error);
    return NextResponse.json({ error: "Failed to load history" }, { status: 500 });
  }

  return NextResponse.json({ recordings: data });
}
