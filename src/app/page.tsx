"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/language-context";
import { LanguageToggle } from "@/components/LanguageToggle";
import { AuroraGlow } from "@/components/AuroraGlow";
import { Grain } from "@/components/Grain";
import { TiltCard } from "@/components/TiltCard";

const SHOWCASE_FULLBODY_URL =
  "https://epconbbigrjdwhkcjlhn.supabase.co/storage/v1/object/public/character%20voice%20studio/fullbody/fd242ea7-4ba9-49fb-b444-a23470c71df8.jpeg";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

function StepIcon({ path }: { path: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth={1.6}>
      <path d={path} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function LandingPage() {
  const { t } = useLanguage();

  return (
    <div className="relative flex-1 overflow-hidden bg-[#0b0713] text-white">
      <Grain />

      {/* Sticky glass header */}
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 z-40 flex items-center justify-between border-b border-white/10 bg-[#0b0713]/70 px-4 py-4 backdrop-blur-md sm:px-8"
      >
        <span className="text-lg font-semibold bg-gradient-to-r from-purple-300 to-fuchsia-300 bg-clip-text text-transparent">
          {t("appTitle")}
        </span>
        <LanguageToggle />
      </motion.header>

      {/* Hero */}
      <section className="relative flex min-h-[92vh] flex-col items-center justify-center overflow-hidden px-4 text-center">
        <AuroraGlow />

        <motion.div
          initial="hidden"
          animate="show"
          transition={{ staggerChildren: 0.12, delayChildren: 0.1 }}
          className="relative z-10 flex flex-col items-center gap-6"
        >
          <motion.span
            variants={fadeUp}
            transition={{ duration: 0.6 }}
            className="rounded-full border border-purple-400/30 bg-white/5 px-4 py-1 text-sm font-medium text-purple-200 backdrop-blur-sm"
          >
            ✦ {t("landingWelcome")}
          </motion.span>

          <motion.h1
            variants={fadeUp}
            transition={{ duration: 0.7 }}
            className="max-w-3xl text-5xl font-extrabold leading-[1.05] tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-fuchsia-300 sm:text-7xl"
          >
            {t("landingHeadline")}
          </motion.h1>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.7 }}
            className="max-w-xl text-base text-purple-100/70 sm:text-lg"
          >
            {t("landingSubheadline")}
          </motion.p>

          <motion.div variants={fadeUp} transition={{ duration: 0.7 }}>
            <Link
              href="/studio"
              className="group relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-500 px-9 py-3.5 text-base font-semibold text-white shadow-[0_0_40px_-8px_rgba(217,70,239,0.7)] transition-transform hover:scale-105"
            >
              {t("landingStartButton")}
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </motion.div>

          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-4"
          >
            <TiltCard className="relative">
              <div
                className="absolute -inset-8 -z-10 animate-glow-pulse rounded-full bg-fuchsia-500/20 blur-3xl"
                aria-hidden
              />
              <div className="relative flex w-[280px] justify-center overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 shadow-2xl shadow-purple-900/40 backdrop-blur-sm sm:w-[340px]">
                <Image
                  src={SHOWCASE_FULLBODY_URL}
                  alt="Character Voice Studio showcase character"
                  width={320}
                  height={460}
                  className="animate-character-breathe relative h-[360px] w-auto object-contain drop-shadow-2xl sm:h-[420px]"
                  priority
                  style={{ transform: "translateZ(40px)" }}
                />
              </div>
            </TiltCard>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="animate-bounce-y absolute bottom-8 flex flex-col items-center gap-1 text-xs text-purple-200/50"
        >
          <span>{t("landingScrollHint")}</span>
          <span>↓</span>
        </motion.div>
      </section>

      {/* How it works */}
      <section className="relative z-10 mx-auto max-w-5xl px-4 py-24 sm:py-32">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center text-3xl font-bold sm:text-4xl"
        >
          {t("landingHowHeading")}
        </motion.h2>

        <div className="grid gap-8 sm:grid-cols-3">
          {[
            {
              n: "01",
              title: t("landingStep1Title"),
              desc: t("landingStep1Desc"),
              path: "M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z",
            },
            {
              n: "02",
              title: t("landingStep2Title"),
              desc: t("landingStep2Desc"),
              path: "M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3ZM19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8",
            },
            {
              n: "03",
              title: t("landingStep3Title"),
              desc: t("landingStep3Desc"),
              path: "M11 5 6 9H2v6h4l5 4V5ZM19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07",
            },
          ].map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm"
            >
              <span className="text-sm font-mono text-purple-400/60">{step.n}</span>
              <div className="my-4 flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-fuchsia-500 text-white">
                <StepIcon path={step.path} />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
              <p className="text-sm text-purple-100/60">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 mx-auto max-w-5xl px-4 py-24 sm:py-32">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center text-3xl font-bold sm:text-4xl"
        >
          {t("landingFeaturesHeading")}
        </motion.h2>

        <div className="grid gap-6 sm:grid-cols-3">
          {[
            {
              title: t("landingFeature1Title"),
              desc: t("landingFeature1Desc"),
              path: "M12 3v3M12 18v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M3 12h3M18 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1",
            },
            {
              title: t("landingFeature2Title"),
              desc: t("landingFeature2Desc"),
              path: "M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z",
            },
            {
              title: t("landingFeature3Title"),
              desc: t("landingFeature3Desc"),
              path: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
            },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              whileHover={{ y: -6 }}
              className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-transparent p-6"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-purple-400/30 text-purple-300">
                <StepIcon path={f.path} />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{f.title}</h3>
              <p className="text-sm text-purple-100/60">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 mx-auto max-w-3xl px-4 pb-32 pt-8 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-8 text-3xl font-bold sm:text-4xl"
        >
          {t("landingCtaHeading")}
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Link
            href="/studio"
            className="group relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-500 px-9 py-3.5 text-base font-semibold text-white shadow-[0_0_40px_-8px_rgba(217,70,239,0.7)] transition-transform hover:scale-105"
          >
            {t("landingStartButton")}
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
