"use client";

import Image from "next/image";
import { useLanguage } from "@/lib/language-context";

export function Lightbox({
  src,
  alt,
  onClose,
}: {
  src: string;
  alt: string;
  onClose: () => void;
}) {
  const { t } = useLanguage();

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-5 bg-black/90 p-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-6 top-6 text-3xl leading-none text-ivory-dim transition-colors hover:text-gold"
      >
        ×
      </button>

      <div
        className="flex max-h-[85vh] flex-col items-center gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={src}
          alt={alt}
          width={800}
          height={1200}
          className="max-h-[75vh] w-auto object-contain"
        />
        <a
          href={src}
          download
          className="btn-gold-fill inline-flex items-center gap-3 px-8 py-3 text-sm font-medium uppercase tracking-[0.15em]"
        >
          {t("downloadButton")}
        </a>
      </div>
    </div>
  );
}
