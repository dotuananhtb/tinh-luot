"use client";

import { useRef, useState } from "react";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { Check, Hand } from "lucide-react";
import { FLIPS } from "@/lib/content";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/shared/section-heading";
import { PrinciplesBlock } from "@/components/sections/principles-block";

const HOLD_SECONDS = 0.9;

/** Câu trả lời bị nhòe; phải giữ ngón tay đủ lâu mới rõ: chậm lại thì mới tỉnh. */
function HoldCard({ q, a, group, onReveal }: { q: string; a: string; group: string; onReveal: () => void }) {
  const progress = useMotionValue(0);
  const blur = useTransform(progress, [0, 1], ["blur(9px)", "blur(0px)"]);
  const answerOpacity = useTransform(progress, [0, 1], [0.55, 1]);
  const [revealed, setRevealed] = useState(false);
  const anim = useRef<ReturnType<typeof animate> | null>(null);

  const reveal = () => {
    anim.current?.stop();
    progress.set(1);
    if (!revealed) {
      setRevealed(true);
      onReveal();
    }
  };

  const start = () => {
    if (revealed) return;
    anim.current?.stop();
    anim.current = animate(progress, 1, {
      duration: HOLD_SECONDS * (1 - progress.get()),
      ease: "linear",
      // stop() cũng có thể kích hoạt onComplete, nên chỉ hiện khi thanh giữ thật sự đầy.
      onComplete: () => {
        if (progress.get() >= 0.999) reveal();
      },
    });
  };

  const cancel = () => {
    if (revealed) return;
    anim.current?.stop();
    anim.current = animate(progress, 0, { duration: 0.25, ease: "easeOut" });
  };

  return (
    <button
      type="button"
      onPointerDown={start}
      onPointerUp={cancel}
      onPointerLeave={cancel}
      onPointerCancel={cancel}
      onContextMenu={(e) => e.preventDefault()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          reveal();
        }
      }}
      aria-label={`${q} Giữ để hiện câu trả lời.`}
      className={cn(
        "group relative flex min-h-48 cursor-pointer touch-manipulation flex-col justify-between overflow-hidden rounded-2xl border-2 border-ink p-4 text-left transition-colors select-none [-webkit-touch-callout:none]",
        revealed ? "bg-ink text-paper" : "bg-white",
      )}
    >
      <div>
        <p className={cn("font-mono text-[11px] font-bold tracking-wider uppercase", revealed ? "text-lime" : "text-muted-ink")}>
          {group}
        </p>
        <p className="mt-1.5 text-lg leading-snug font-semibold">{q}</p>
      </div>
      <motion.p style={{ filter: blur, opacity: answerOpacity }} className="mt-4 text-[0.95rem] leading-relaxed">
        {a}
      </motion.p>
      <div className="mt-3 flex items-center gap-1.5 font-mono text-[11px] font-bold">
        {revealed ? (
          <>
            <Check className="size-3.5 text-lime" /> <span className="text-lime">ĐÃ TỈNH</span>
          </>
        ) : (
          <>
            <Hand className="size-3.5" /> GIỮ ĐỂ TỈNH
          </>
        )}
      </div>
      {/* thanh tiến độ khi giữ */}
      <motion.span
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-1.5 origin-left bg-lime"
        style={{ scaleX: progress }}
      />
    </button>
  );
}

export function UnderstandSection() {
  const [count, setCount] = useState(0);
  const total = FLIPS.reduce((n, g) => n + g.cards.length, 0);

  return (
    <section id="hieu-dung" className="border-t-2 border-ink py-20">
      <div className="mx-auto max-w-5xl px-4">
        <SectionHeading
          index={2}
          kicker="Hiểu đúng"
          title={<>12 câu trả lời bị nhòe. <span className="bg-lime px-1">Giữ</span> để nhìn rõ.</>}
          lead="Lướt nhanh thì chỉ thấy mờ. Đặt ngón tay lên thẻ và giữ, câu trả lời theo giáo trình sẽ hiện ra."
        />
        <div className="space-y-8">
          {FLIPS.map((g) => (
            <div key={g.group}>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {g.cards.map((c) => (
                  <HoldCard key={c.q} q={c.q} a={c.a} group={g.group} onReveal={() => setCount((n) => n + 1)} />
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-8 font-mono text-sm font-bold" aria-live="polite">
          Đã tỉnh {count}/{total} thẻ
        </p>
        <PrinciplesBlock />
      </div>
    </section>
  );
}
