"use client";

import { useState } from "react";
import { PLEDGES, POSTS, type Reaction } from "@/lib/content";
import { LensProvider } from "@/components/lens/lens-provider";
import { Lens } from "@/components/lens/lens";
import { ProgressBar } from "@/components/shared/progress-bar";
import { HeroSection } from "@/components/sections/hero-section";
import { QuoteScene } from "@/components/sections/quote-scene";
import { UnderstandSection } from "@/components/sections/understand-section";
import { FeedSection } from "@/components/sections/feed-section";
import { SortSection } from "@/components/sections/sort-section";
import { VietnamSection } from "@/components/sections/vietnam-section";
import { PledgeSection } from "@/components/sections/pledge-section";

/** Giữ trạng thái xuyên suốt hành trình: điểm lướt thử (dùng cho chứng nhận) và mức ồn. */
export function Experience() {
  const [answers, setAnswers] = useState<(Reaction | null)[]>(() => POSTS.map(() => null));
  const [offs, setOffs] = useState<boolean[]>(() => PLEDGES.map(() => false));

  const score = answers.reduce((s, a, i) => s + (a === POSTS[i].answer ? 10 : 0), 0);
  const played = answers.some(Boolean);
  const noise = offs.filter((o) => !o).length / PLEDGES.length;

  const pick = (i: number, r: Reaction) =>
    setAnswers((prev) => (prev[i] ? prev : prev.map((a, j) => (j === i ? r : a))));

  const reset = () => {
    setAnswers(POSTS.map(() => null));
    document.getElementById("luot-thu")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <LensProvider>
      <a
        href="#hieu-dung"
        className="sr-only z-[60] rounded-full bg-ink px-4 py-2 font-mono text-sm text-lime focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Bỏ qua phần mở đầu
      </a>
      <ProgressBar noise={noise} />
      <main>
        <HeroSection />
        <QuoteScene />
        <UnderstandSection />
        <FeedSection answers={answers} score={score} onPick={pick} onReset={reset} />
        <SortSection />
        <VietnamSection />
        <PledgeSection
          offs={offs}
          onToggle={(i) => setOffs((prev) => prev.map((o, j) => (j === i ? !o : o)))}
          score={score}
          played={played}
        />
      </main>
      <Lens />
    </LensProvider>
  );
}
