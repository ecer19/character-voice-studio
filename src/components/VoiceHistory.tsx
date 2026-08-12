"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/lib/language-context";
import type { VoiceRecording } from "@/lib/types";

export function VoiceHistory({ refreshKey }: { refreshKey: number }) {
  const { t } = useLanguage();
  const [recordings, setRecordings] = useState<VoiceRecording[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch("/api/voice-history")
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (data.error) throw new Error(data.error);
        setRecordings(data.recordings ?? []);
      })
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-white/10 p-5">
      <h2 className="text-lg font-semibold">{t("voiceHistoryHeading")}</h2>

      {loading && <p className="text-sm opacity-70">{t("loading")}</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
      {!loading && recordings.length === 0 && (
        <p className="text-sm opacity-70">{t("noRecordingsYet")}</p>
      )}

      <div className="flex flex-col gap-3">
        {recordings.map((r) => (
          <div
            key={r.id}
            className="flex flex-col gap-2 rounded-md border border-white/10 p-3"
          >
            <div className="flex items-center gap-2">
              {r.character?.image_url && (
                <Image
                  src={r.character.image_url}
                  alt={r.character.name}
                  width={32}
                  height={32}
                  className="rounded-full object-cover"
                />
              )}
              <span className="text-sm font-medium">{r.character?.name}</span>
              <span className="text-xs opacity-60">· {r.emotion}</span>
              <span className="text-xs opacity-50 ml-auto">
                {new Date(r.created_at).toLocaleString()}
              </span>
            </div>
            <p className="text-sm opacity-80">{r.text}</p>
            {r.audio_url && (
              <div className="flex items-center gap-2">
                <audio controls src={r.audio_url} className="w-full" />
                <a
                  href={r.audio_url}
                  download
                  className="text-xs px-3 py-1.5 rounded bg-white/10 whitespace-nowrap"
                >
                  {t("downloadButton")}
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
