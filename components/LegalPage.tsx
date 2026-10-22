"use client";

import { useEffect, useMemo, useState } from "react";
import type { MouseEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import GithubSlugger from "github-slugger";
import { motion } from "motion/react";

type LegalPageProps = {
  content: string;
  title: string;
  subtitle: string;
  current: "terms" | "privacy";
};

export default function LegalPage({ content, title, subtitle, current }: LegalPageProps) {
  const [activeId, setActiveId] = useState<string>("");

  const effectiveDate = content.match(/^\*\*Effective Date:\*\*\s*(.+)$/m)?.[1]?.trim();

  const body = useMemo(
    () =>
      content
        .split("\n")
        .filter((line, index) => !(index === 0 && line.startsWith("# ")))
        .filter((line) => !/^\*\*Effective Date:\*\*/.test(line.trim()))
        .join("\n")
        .trim(),
    [content]
  );

  const headings = useMemo(() => {
    const slugger = new GithubSlugger();
    return body
      .split("\n")
      .filter((line) => line.startsWith("## "))
      .map((line) => {
        const text = line.replace(/^##\s+/, "").trim();
        return { text, id: slugger.slug(text) };
      });
  }, [body]);

  useEffect(() => {
    const elements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-96px 0px -65% 0px", threshold: 0 }
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [headings]);

  const handleTocClick = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    const element = document.getElementById(id);
    if (!element) return;
    element.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveId(id);
    window.history.replaceState(null, "", `#${id}`);
  };

  const nav = [
    { href: "/terms", label: "Terms of Service", key: "terms" as const },
    { href: "/privacy", label: "Privacy Policy", key: "privacy" as const },
  ];

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <Link href="/download" className="flex items-center gap-3">
            <Image src="/lm18_icon.png" alt="LM18" width={32} height={32} className="rounded-lg" />
            <span className="text-base font-semibold tracking-tight">LM18 Construction</span>
          </Link>
          <nav className="flex items-center gap-1 rounded-full border border-zinc-200 bg-zinc-50 p-1 text-sm">
            {nav.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={`relative rounded-full px-4 py-1.5 font-medium transition-colors duration-200 ${
                  current === item.key
                    ? "text-white"
                    : "text-zinc-500 hover:text-zinc-900"
                }`}
              >
                {current === item.key && (
                  <motion.span
                    layoutId="legal-nav-pill"
                    className="absolute inset-0 rounded-full bg-[#00A2E8]"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-zinc-200">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(0,162,232,0.12),_transparent_60%)]" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative mx-auto max-w-6xl px-6 py-16 md:py-20"
        >
          <Link
            href="/download"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 transition hover:text-zinc-900"
          >
            <span aria-hidden>←</span> Back to download
          </Link>
          <p className="mt-6 text-sm font-medium uppercase tracking-[0.3em] text-[#00A2E8]">Legal</p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight md:text-5xl">{title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-zinc-500">{subtitle}</p>
          {effectiveDate && (
            <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-1.5 text-xs font-medium text-zinc-600 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-[#00A2E8]" />
              Effective {effectiveDate}
            </span>
          )}
        </motion.div>
      </section>

      {/* Content */}
      <main className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-12 lg:grid-cols-[220px_minmax(0,1fr)]">
          {/* TOC */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">On this page</p>
              <nav className="relative mt-4 border-l border-zinc-200">
                {headings.map((heading) => (
                  <a
                    key={heading.id}
                    href={`#${heading.id}`}
                    onClick={(event) => handleTocClick(event, heading.id)}
                    className={`relative block py-1.5 pl-4 text-sm transition-colors duration-200 ${
                      activeId === heading.id
                        ? "font-medium text-zinc-900"
                        : "text-zinc-500 hover:text-zinc-900"
                    }`}
                  >
                    {activeId === heading.id && (
                      <motion.span
                        layoutId="toc-indicator"
                        className="absolute -left-px top-0 h-full w-0.5 rounded-full bg-[#00A2E8]"
                        transition={{ type: "spring", stiffness: 400, damping: 35 }}
                      />
                    )}
                    {heading.text}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Article */}
          <motion.article
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05, ease: "easeOut" }}
            className="legal rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm md:p-12"
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug]}>
              {body}
            </ReactMarkdown>
          </motion.article>
        </div>
      </main>

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
