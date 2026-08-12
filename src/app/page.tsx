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

export default function LandingPage() {
  const { t } = useLanguage();

  const steps = [
    { n: "01", title: t("landingStep1Title"), desc: t("landingStep1Desc") },
    { n: "02", title: t("landingStep2Title"), desc: t("landingStep2Desc") },
    { n: "03", title: t("landingStep3Title"), desc: t("landingStep3Desc") },
  ];

  const features = [
    { n: "A", title: t("landingFeature1Title"), desc: t("landingFeature1Desc") },
    { n: "B", title: t("landingFeature2Title"), desc: t("landingFeature2Desc") },
    { n: "C", title: t("landingFeature3Title"), desc: t("landingFeature3Desc") },
  ];

  return (
    <div className="relative flex-1 overflow-hidden bg-lux-bg font-sans text-ivory">
      <Grain />

      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="sticky top-0 z-40 border-b border-white/[0.06] bg-lux-bg/80 backdrop-blur-md"
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 sm:px-10">
          <span className="font-serif text-lg tracking-wide">{t("appTitle")}</span>
          <LanguageToggle />
        </div>
      </motion.header>

      {/* Hero */}
      <section className="relative flex min-h-[100vh] flex-col items-center justify-center overflow-hidden px-6 text-center">
        <AuroraGlow />

        <motion.div
          initial="hidden"
          animate="show"
          transition={{ staggerChildren: 0.15, delayChildren: 0.15 }}
          className="relative z-10 flex max-w-3xl flex-col items-center gap-7"
        >
          <motion.span variants={fadeUp} transition={{ duration: 0.7 }} className="kicker">
            {t("landingKicker")}
          </motion.span>

          <motion.h1
            variants={fadeUp}
            transition={{ duration: 0.9 }}
            className="font-serif text-5xl font-normal leading-[1.08] tracking-tight sm:text-7xl"
          >
            {t("landingHeadline")}
          </motion.h1>

          <motion.div variants={fadeUp} transition={{ duration: 0.7 }} className="mx-auto h-px w-16">
            <div className="hairline h-px w-full" />
          </motion.div>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.7 }}
            className="max-w-md text-base font-light text-ivory-dim sm:text-lg"
          >
            {t("landingSubheadline")}
          </motion.p>

          <motion.div variants={fadeUp} transition={{ duration: 0.7 }} className="mt-4">
            <Link
              href="/studio"
              className="btn-gold-fill inline-flex items-center gap-3 rounded-none px-10 py-4 text-sm font-medium uppercase tracking-[0.15em]"
            >
              {t("landingStartButton")}
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="absolute bottom-10 flex flex-col items-center gap-3 text-[0.65rem] uppercase tracking-[0.2em] text-ivory-dim"
        >
          <span>{t("landingScrollHint")}</span>
          <span className="animate-bounce-y block h-8 w-px bg-gradient-to-b from-gold to-transparent" />
        </motion.div>
      </section>

      {/* How it works */}
      <section className="relative z-10 mx-auto max-w-4xl px-6 py-28 sm:py-36">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="mb-16 flex flex-col items-center text-center"
        >
          <span className="kicker mb-3">{t("landingHowKicker")}</span>
          <h2 className="font-serif text-3xl sm:text-4xl">{t("landingHowHeading")}</h2>
        </motion.div>

        <div>
          {steps.map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: i * 0.12 }}
              className="grid grid-cols-[3rem_1fr] items-start gap-6 border-t border-white/[0.08] py-8 sm:grid-cols-[5rem_1fr]"
            >
              <span className="font-serif text-2xl text-gold sm:text-3xl">{step.n}</span>
              <div className="text-left">
                <h3 className="mb-1.5 font-serif text-xl sm:text-2xl">{step.title}</h3>
                <p className="max-w-md text-sm font-light text-ivory-dim sm:text-base">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
          <div className="border-t border-white/[0.08]" />
        </div>
      </section>

      {/* Showcase */}
      <section className="relative z-10 mx-auto grid max-w-6xl gap-12 px-6 py-28 sm:grid-cols-2 sm:items-center sm:py-40">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="order-2 flex flex-col items-start text-left sm:order-1"
        >
          <span className="kicker mb-3">{t("landingShowcaseKicker")}</span>
          <h2 className="mb-5 font-serif text-3xl leading-tight sm:text-4xl">
            {t("landingShowcaseHeading")}
          </h2>
          <div className="hairline mb-5 h-px w-16" />
          <p className="max-w-sm text-sm font-light text-ivory-dim sm:text-base">
            {t("landingShowcaseDesc")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9 }}
          className="order-1 flex justify-center sm:order-2"
        >
          <TiltCard className="relative border border-[var(--lux-gold-soft)] p-3">
            <Image
              src={SHOWCASE_FULLBODY_URL}
              alt="AI-generated character"
              width={340}
              height={480}
              className="animate-character-breathe h-[380px] w-auto object-contain sm:h-[460px]"
              priority
              style={{ transform: "translateZ(30px)" }}
            />
          </TiltCard>
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 py-28 sm:py-36">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="mb-16 flex flex-col items-center text-center"
        >
          <span className="kicker mb-3">{t("landingFeaturesKicker")}</span>
          <h2 className="font-serif text-3xl sm:text-4xl">{t("landingFeaturesHeading")}</h2>
        </motion.div>

        <div className="grid gap-px overflow-hidden border border-white/[0.08] sm:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.n}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: i * 0.12 }}
              className="border-white/[0.08] bg-lux-bg p-8 sm:border-l first:border-l-0"
            >
              <span className="font-serif text-lg text-gold">{f.n}</span>
              <h3 className="mb-2 mt-4 font-serif text-xl">{f.title}</h3>
              <p className="text-sm font-light text-ivory-dim">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 border-t border-white/[0.08] px-6 py-28 text-center sm:py-40">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="mx-auto flex max-w-2xl flex-col items-center"
        >
          <span className="kicker mb-4">{t("landingCtaKicker")}</span>
          <h2 className="mb-4 font-serif text-3xl leading-tight sm:text-5xl">
            {t("landingCtaHeading")}
          </h2>
          <p className="mb-9 text-sm font-light text-ivory-dim sm:text-base">
            {t("landingCtaSub")}
          </p>
          <Link
            href="/studio"
            className="btn-gold-fill inline-flex items-center gap-3 rounded-none px-10 py-4 text-sm font-medium uppercase tracking-[0.15em]"
          >
            {t("landingStartButton")}
          </Link>
        </motion.div>
      </section>

      <footer className="relative z-10 border-t border-white/[0.06] px-6 py-8 text-center text-xs text-ivory-dim">
        {t("appTitle")}
      </footer>
    </div>
  );
}
