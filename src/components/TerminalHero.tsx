"use client";

import { useEffect, useState, useCallback } from "react";

const lines = [
  { cmd: true, text: "whoami" },
  { cmd: false, text: "Ibrahim Abdull (Cyborg)", br: true },
  { cmd: true, text: "cat role.txt" },
  { cmd: false, text: "Founder & CTO @ UMG Africa Ltd", br: true },
  { cmd: false, text: "AI Agent & Automation Master · Embedded Engineer" },
  { cmd: true, text: "ls projects/" },
  { cmd: false, text: "Ghost/   Siafu/   JengaConnect/   AuraClock/   Msingi/", accent: true },
  { cmd: true, text: "cat manifesto.txt" },
  { cmd: false, text: "Building intelligent machines for Africa.", br: true },
  { cmd: false, text: "Training the next generation of AI builders.", br: true },
  { cmd: false, text: "19 years old · South Africa & Tanzania" },
];

export function TerminalHero() {
  const [displayed, setDisplayed] = useState<string[]>(["", ""]);
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);

  const scrollToProjects = useCallback(() => {
    const el = document.getElementById("projects-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, []);

  const scrollToShop = useCallback(() => {
    const el = document.getElementById("shop-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, []);

  const scrollToBlog = useCallback(() => {
    const el = document.getElementById("blog-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (lineIdx >= lines.length) return;
    const line = lines[lineIdx];
    const speed = line.cmd ? 65 : 22;

    if (charIdx <= line.text.length) {
      const timer = setTimeout(() => {
        const newDisplayed = [...displayed];
        const prefix = line.cmd ? "❯ " : "";
        newDisplayed[lineIdx] = prefix + line.text.slice(0, charIdx);
        setDisplayed(newDisplayed);
        setCharIdx(charIdx + 1);
      }, speed);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setLineIdx(lineIdx + 1);
        setCharIdx(0);
      }, line.cmd ? 80 : 360);
      return () => clearTimeout(timer);
    }
  }, [lineIdx, charIdx, displayed]);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-16 relative">
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 65% 55% at 25% 35%, rgba(0,217,255,0.04), transparent 70%), radial-gradient(ellipse 55% 50% at 75% 65%, rgba(255,85,0,0.04), transparent 70%)",
        }}
      />

      <div
        className="w-full max-w-[680px] rounded-xl overflow-hidden shadow-[0_0_80px_rgba(0,217,255,0.07)] border border-[rgba(0,217,255,0.04)] relative z-10"
        style={{
          background: "rgba(8,14,24,0.92)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
        }}
      >
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[rgba(255,255,255,0.07)] bg-[rgba(6,11,18,0.6)]">
          <span className="w-3 h-3 rounded-full bg-[#FF5F56]" />
          <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
          <span className="w-3 h-3 rounded-full bg-[#27C93F]" />
          <span className="font-mono text-[11px] text-muted ml-2">
            cyborg@umg-africa: ~
          </span>
        </div>

        <div className="p-6 font-mono text-xs leading-[1.9] min-h-[280px]">
          {displayed.map((line, i) => (
            <span key={i} className="block">
              {lines[i]?.cmd ? (
                <span className="text-cyan">{line}</span>
              ) : lines[i]?.accent ? (
                <span className="text-cyan">{line}</span>
              ) : (
                <span className="text-text">{line}</span>
              )}
            </span>
          ))}
          {lineIdx < lines.length && (
            <span
              className="inline-block w-[7px] h-[14px] bg-cyan align-[-2px] ml-1"
              style={{ animation: "blink 1s step-end infinite" }}
            />
          )}
        </div>
      </div>

      <div className="flex gap-2.5 mt-7 flex-wrap justify-center relative z-10">
        <button
          onClick={scrollToProjects}
          className="bg-cyan text-bg border-none rounded-lg px-6 py-2.5 font-mono text-xs font-medium hover:opacity-85 transition-opacity"
        >
          View Projects
        </button>
        <button
          onClick={scrollToShop}
          className="bg-transparent text-muted border border-[rgba(255,255,255,0.07)] rounded-lg px-5 py-2.5 font-mono text-xs hover:text-text hover:border-[rgba(255,255,255,0.13)] transition-all"
        >
          Shop Books &amp; Kits
        </button>
        <button
          onClick={scrollToBlog}
          className="bg-transparent text-muted border border-[rgba(255,255,255,0.07)] rounded-lg px-5 py-2.5 font-mono text-xs hover:text-text hover:border-[rgba(255,255,255,0.13)] transition-all"
        >
          Read Blog
        </button>
      </div>
    </section>
  );
}
