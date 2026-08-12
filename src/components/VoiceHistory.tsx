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
    <div className="flex flex-col gap-4 border border-white/[0.08] bg-white/[0.02] p-6">
      <h2 className="font-serif text-xl">{t("voiceHistoryHeading")}</h2>

      {loading && <p className="text-sm text-ivory-dim">{t("loading")}</p>}
      {error && <p className="text-sm text-red-400">{error}</p>}
      {!loading && recordings.length === 0 && (
        <p className="text-sm text-ivory-dim">{t("noRecordingsYet")}</p>
      )}

      <div className="flex flex-col">
        {recordings.map((r) => (
          <div
            key={r.id}
            className="flex flex-col gap-2 border-t border-white/[0.08] py-4 first:border-t-0"
          >
            <div className="flex items-center gap-2">
              {r.character?.image_url && (
                <Image
                  src={r.character.image_url}
                  alt={r.character.name}
                  width={32}
                  height={32}
                  className="object-cover"
                />
              )}
              <span className="text-sm font-serif">{r.character?.name}</span>
              <span className="text-xs text-ivory-dim">· {r.emotion}</span>
              <span className="text-xs text-ivory-dim ml-auto">
                {new Date(r.created_at).toLocaleString()}
              </span>
            </div>
            <p className="text-sm text-ivory-dim">{r.text}</p>
            {r.audio_url && (
              <div className="flex items-center gap-3">
                <audio controls src={r.audio_url} className="w-full" />
                <a
                  href={r.audio_url}
                  download
                  className="text-xs uppercase tracking-[0.1em] text-ivory-dim hover:text-gold whitespace-nowrap"
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
