"use client";

import { useState } from "react";
import type { ComponentType } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { FaAndroid, FaApple, FaWindows, FaLinux, FaMobileAlt } from "react-icons/fa";

type Platform = "android" | "ios" | "macos" | "windows" | "linux";

const platforms: {
  id: Platform;
  label: string;
  icon: ComponentType<{ className?: string }>;
}[] = [
  { id: "android", label: "Android", icon: FaAndroid },
  { id: "ios", label: "iOS", icon: FaMobileAlt },
  { id: "macos", label: "macOS", icon: FaApple },
  { id: "windows", label: "Windows", icon: FaWindows },
  { id: "linux", label: "Linux", icon: FaLinux },
];

const app = {
  name: "LM18 Authority",
  tag: "For managers & administrators",
  version: "v1.0.0",
  desc: "Admin dashboard, metrics, time correction, branch schedules, overtime, payroll reports and audit console.",
  downloads: {
    android: [
      {
        label: "Download APK (Android)",
        href: "https://www.mediafire.com/file/cn0xynsnvq3bcbm/LM18-Authority-Android.apk/file",
        primary: true,
        download: false,
      },
      { label: "Google Play", href: "#", primary: false, download: false },
    ],
    ios: [{ label: "App Store", href: "#", primary: true, download: false }],
    macos: [
      { label: "Download for Apple Silicon", href: "#", primary: true, download: false },
      { label: "Download for Intel", href: "#", primary: false, download: false },
    ],
    windows: [
      { label: "Download for x64", href: "#", primary: true, download: false },
      { label: "Download for ARM64", href: "#", primary: false, download: false },
    ],
    linux: [
      { label: "Download for x64", href: "#", primary: true, download: false },
      { label: "Download for ARM64", href: "#", primary: false, download: false },
    ],
  },
  requirements: {
    android: "Android 8.0 (Oreo) or later",
    ios: "iOS 14.0 or later",
    macos: "macOS 12 (Monterey) or later (Apple Silicon or Intel)",
    windows: "Windows 10 (64-bit) or later",
    linux: "glibc >= 2.28 (Ubuntu 20+, Debian 10+, Fedora 36+, RHEL 8+)",
  },
} as const;

export default function AuthorityDownloadPage() {
  const [platform, setPlatform] = useState<Platform>("android");

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Image src="/lm18_icon.png" alt="LM18" width={32} height={32} className="rounded-lg" />
            <span className="text-base font-semibold tracking-tight">LM18 Construction</span>
          </div>
          <Link href="/download" className="text-sm font-medium text-zinc-500 transition hover:text-zinc-900">
            Employee App
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(0,162,232,0.12),_transparent_60%)]" />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative mx-auto max-w-6xl px-6 py-20 text-center md:py-28"
        >
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#00A2E8]">Download</p>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
            Download LM18 Authority
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-zinc-500">
            Choose your platform and manage employees, attendance, schedules and payroll from anywhere.
          </p>

          <div className="relative mt-10 inline-flex flex-wrap justify-center gap-1 rounded-full border border-zinc-200 bg-zinc-50 p-1">
            {platforms.map((p) => {
              const Icon = p.icon;
              return (
                <button
                  key={p.id}
                  onClick={() => setPlatform(p.id)}
                  className={`relative rounded-full px-5 py-2 text-sm font-semibold transition-colors duration-200 ${
                    platform === p.id ? "text-white" : "text-zinc-500 hover:text-zinc-900"
                  }`}
                >
                  {platform === p.id && (
                    <motion.span
                      layoutId="authority-platform-pill"
                      className="absolute inset-0 rounded-full bg-[#00A2E8]"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {p.label}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* Product */}
      <section className="mx-auto max-w-3xl px-6 pb-20">
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <Image src="/lm18_icon.png" alt={app.name} width={56} height={56} className="rounded-xl" />
              <div>
                <h3 className="text-xl font-bold">{app.name}</h3>
                <p className="text-sm text-zinc-500">{app.tag}</p>
              </div>
            </div>
            <span className="rounded-full border border-zinc-200 px-3 py-1 text-xs font-medium text-zinc-600">
              {app.version}
            </span>
          </div>

          <p className="mt-5 text-sm text-zinc-500">{app.desc}</p>

          <AnimatePresence mode="wait">
            <motion.div
              key={platform}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="mt-6 flex flex-col gap-3"
            >
              {app.downloads[platform].map((d) => (
                <a
                  key={d.label}
                  href={d.href}
                  download={d.download ? true : undefined}
                  target={d.href.startsWith("http") ? "_blank" : undefined}
                  rel={d.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className={`inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-semibold transition ${
                    d.primary
                      ? "bg-[#00A2E8] text-white hover:bg-[#0089c7]"
                      : "border border-zinc-300 text-zinc-700 hover:border-[#00A2E8] hover:text-[#00A2E8]"
                  }`}
                >
                  {d.label}
                </a>
              ))}
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 border-t border-zinc-200 pt-4 text-xs text-zinc-500">
            <span className="font-medium text-zinc-600">Minimum requirements: </span>
            {app.requirements[platform]}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-6 sm:flex-row"
        >
          <div>
            <h4 className="text-sm font-semibold">Looking for the Employee App?</h4>
            <p className="mt-1 text-sm text-zinc-500">Available for Android and iOS.</p>
          </div>
          <Link
            href="/download"
            className="inline-flex h-10 shrink-0 items-center justify-center rounded-full border border-zinc-300 px-5 text-sm font-semibold text-zinc-700 transition hover:border-[#00A2E8] hover:text-[#00A2E8]"
          >
            View downloads
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-xs text-zinc-500 sm:flex-row">
          <span>© 2026 LM18 Construction. All rights reserved.</span>
          <div className="flex gap-6">
            <Link href="/terms" className="transition hover:text-zinc-900">Terms of Service</Link>
            <Link href="/privacy" className="transition hover:text-zinc-900">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
