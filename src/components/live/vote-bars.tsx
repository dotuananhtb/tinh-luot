"use client";

import { motion } from "motion/react";
import { Check } from "lucide-react";
import { REACTIONS, type Reaction } from "@/lib/content";
import { cn } from "@/lib/utils";
import { REACTION_ICON } from "@/components/sections/feed-section";

/** Biểu đồ phiếu theo 5 phản ứng. Khi `answer` có giá trị (đã lật), cột đúng được tô vàng chanh. */
export function VoteBars({
  counts,
  total,
  answer,
  big = false,
}: {
  counts: Record<Reaction, number>;
  total: number;
  answer?: Reaction | null;
  big?: boolean;
}) {
  return (
    <ul className={cn("space-y-2", big && "space-y-3.5")} aria-label="Kết quả bỏ phiếu">
      {REACTIONS.map(({ key, label }) => {
        const Icon = REACTION_ICON[key];
        const n = counts[key];
        const pct = total ? Math.round((n / total) * 100) : 0;
        const correct = answer === key;
        return (
          <li key={key} className="flex items-center gap-3">
            <span className={cn("flex shrink-0 items-center gap-2 font-semibold", big ? "w-56 text-2xl" : "w-32 text-sm")}>
              <Icon className={big ? "size-7" : "size-4"} /> {label}
            </span>
            <span className={cn("relative flex-1 overflow-hidden rounded-full border-2 border-ink bg-white", big ? "h-12" : "h-7")}>
              <motion.span
                className={cn(
                  "absolute inset-y-0 left-0",
                  answer ? (correct ? "bg-lime" : "bg-ink/15") : "bg-ink",
                )}
                initial={false}
                animate={{ width: `${pct}%` }}
                transition={{ type: "spring", stiffness: 160, damping: 22 }}
              />
              {correct && (
                <span className={cn("absolute inset-y-0 left-3 flex items-center gap-1 font-mono font-extrabold", big ? "text-lg" : "text-xs")}>
                  <Check className={big ? "size-5" : "size-3.5"} /> ĐÚNG
                </span>
              )}
            </span>
            <span className={cn("shrink-0 text-right font-mono font-bold tabular-nums", big ? "w-28 text-2xl" : "w-16 text-sm")}>
              {n} · {pct}%
            </span>
          </li>
        );
      })}
    </ul>
  );
}
