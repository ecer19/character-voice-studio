"use client";

import { useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/lib/language-context";
import type { Character } from "@/lib/types";

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
  imageUrl?: string | null;
}

export function AppearanceChat({
  character,
  onUpdated,
}: {
  character: Character;
  onUpdated: (character: Character) => void;
}) {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSend() {
    const instruction = input.trim();
    if (!instruction) return;
    setError(null);
    setMessages((m) => [...m, { role: "user", text: instruction }]);
    setInput("");
    setApplying(true);
    try {
      const res = await fetch("/api/edit-appearance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ character_id: character.id, instruction }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? t("errorEditAppearance"));
      onUpdated(data.character);
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text: t("editAppearanceUpdated"),
          imageUrl: data.character.image_url,
        },
      ]);
    } catch (err) {
      const message = err instanceof Error ? err.message : t("errorEditAppearance");
      setError(message);
      setMessages((m) => [...m, { role: "assistant", text: message }]);
    } finally {
      setApplying(false);
    }
  }

  return (
    <div className="flex flex-col gap-3 border border-white/[0.08] p-6">
      <h3 className="font-serif text-lg">{t("editAppearanceHeading")}</h3>
      <p className="text-xs text-ivory-dim">{t("editAppearanceHint")}</p>

      {messages.length > 0 && (
        <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex items-center gap-2 px-3 py-2 text-sm ${
                m.role === "user"
                  ? "self-end border border-[var(--lux-gold-soft)] text-gold"
                  : "self-start bg-white/[0.04] text-ivory-dim"
              }`}
            >
              {m.imageUrl && (
                <Image
                  src={m.imageUrl}
                  alt=""
                  width={32}
                  height={32}
                  className="object-cover"
                />
              )}
              <span>{m.text}</span>
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex gap-2">
        <input
          className="flex-1 border border-white/15 bg-transparent px-3 py-2 text-sm text-ivory focus:border-gold focus:outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !applying) handleSend();
          }}
          placeholder={t("editAppearancePlaceholder")}
          disabled={applying}
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={applying || !input.trim()}
          className="btn-gold px-5 py-2 text-xs font-medium uppercase tracking-[0.12em] disabled:opacity-50"
        >
          {applying ? t("editAppearanceApplying") : t("editAppearanceSend")}
        </button>
      </div>
    </div>
  );
}
