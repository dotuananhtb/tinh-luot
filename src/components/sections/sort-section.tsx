"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useAnimate } from "motion/react";
import { Check, MoveDown } from "lucide-react";
import { type Bin } from "@/lib/content";
import { useContent } from "@/components/content-provider";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/shared/section-heading";

type Placed = Record<Bin, string[]>;

function pointFromEvent(e: MouseEvent | TouchEvent | PointerEvent) {
  if ("changedTouches" in e && e.changedTouches.length) return { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
  const m = e as MouseEvent;
  return { x: m.clientX, y: m.clientY };
}

/** Chồng 9 thẻ: kéo thẻ trên cùng thả vào ô, hoặc bấm thẳng vào ô. Sai thì thẻ rung và quay lại. */
export function SortSection() {
  const { bins: BINS, chips: CHIPS } = useContent();
  // Chỉ lưu chỉ số thẻ đã đặt; chữ luôn lấy từ nội dung mới nhất (có thể đổi khi bản trên Firebase tải xong).
  const [placedIdx, setPlacedIdx] = useState<number[]>([]);
  const deck = CHIPS.map((c, i) => ({ ...c, i })).filter((c) => !placedIdx.includes(c.i));
  const placed: Placed = { tn: [], tg: [], mt: [] };
  placedIdx.forEach((i) => placed[CHIPS[i].bin].push(CHIPS[i].text));
  const [hover, setHover] = useState<Bin | null>(null);
  const [miss, setMiss] = useState<{ bin: Bin; n: number } | null>(null);
  const [scope, animate] = useAnimate();
  const binRefs = useRef<Partial<Record<Bin, HTMLButtonElement | null>>>({});
  const top = deck[0];
  const finished = deck.length === 0;

  const binAt = (x: number, y: number) =>
    BINS.find(({ key }) => {
      const r = binRefs.current[key]?.getBoundingClientRect();
      return r && x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
    })?.key ?? null;

  const tryPlace = (bin: Bin) => {
    if (!top) return;
    if (top.bin === bin) {
      setPlacedIdx((p) => [...p, top.i]);
      setMiss(null);
      return;
    }
    setMiss((m) => ({ bin, n: (m?.n ?? 0) + 1 }));
    if (scope.current) animate(scope.current, { rotate: [0, -6, 6, -4, 4, 0] }, { duration: 0.4 });
  };

  return (
    <section id="phan-loai" className="border-t-2 border-ink py-20">
      <div className="mx-auto max-w-5xl px-4">
        <SectionHeading
          index={4}
          kicker="Phân loại"
          title={<>Tín ngưỡng, tôn giáo hay mê tín dị đoan?</>}
          lead="Kéo thẻ trên cùng của chồng bài vào đúng ô. Trên điện thoại có thể bấm thẳng vào ô."
        />

        {/* chồng bài */}
        <div className="relative mx-auto mb-8 grid h-44 max-w-sm place-items-center">
          <AnimatePresence>
            {deck
              .slice(0, 4)
              .reverse()
              .map((c, i, arr) => {
                const depth = arr.length - 1 - i;
                const isTop = depth === 0;
                return (
                  <motion.div
                    key={`chip-${c.i}`}
                    ref={isTop ? scope : undefined}
                    drag={isTop}
                    dragSnapToOrigin
                    dragElastic={0.9}
                    whileDrag={{ scale: 1.06, rotate: -3, cursor: "grabbing" }}
                    onDrag={(e) => {
                      const p = pointFromEvent(e);
                      setHover(binAt(p.x, p.y));
                    }}
                    onDragEnd={(e) => {
                      const p = pointFromEvent(e);
                      const b = binAt(p.x, p.y);
                      setHover(null);
                      if (b) tryPlace(b);
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: depth * 8, scale: 1 - depth * 0.04 }}
                    exit={{ opacity: 0, scale: 0.6, y: 120, transition: { duration: 0.25 } }}
                    transition={{ type: "spring", stiffness: 300, damping: 26 }}
                    style={{ zIndex: 10 - depth }}
                    className={cn(
                      "absolute grid h-36 w-[min(100%,20rem)] touch-none place-items-center rounded-2xl border-2 border-ink p-5 text-center select-none",
                      isTop ? "cursor-grab bg-lime shadow-[6px_6px_0_var(--ink)]" : "bg-white",
                    )}
                  >
                    <p className={cn("text-xl font-bold text-balance", !isTop && "opacity-0")}>{c.text}</p>
                    {isTop && (
                      <span className="absolute top-2.5 right-3 font-mono text-[10px] font-bold">
                        {CHIPS.length - deck.length + 1}/{CHIPS.length}
                      </span>
                    )}
                  </motion.div>
                );
              })}
          </AnimatePresence>
          {finished && (
            <motion.p
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 rounded-full bg-ink px-5 py-3 font-mono font-bold text-lime"
            >
              <Check className="size-5" /> Đã phân loại xong 9/9
            </motion.p>
          )}
        </div>

        <p className="mb-4 flex items-center justify-center gap-2 font-mono text-xs font-bold text-muted-ink" aria-live="polite">
          {miss ? (
            <span className="text-alarm">Chưa đúng, “{top?.text}” không thuộc ô {BINS.find((b) => b.key === miss.bin)?.label}. Thử ô khác.</span>
          ) : finished ? (
            "Đọc định nghĩa bên dưới để chốt kiến thức."
          ) : (
            <>
              <MoveDown className="size-4" /> Kéo xuống một ô
            </>
          )}
        </p>

        {/* các ô */}
        <div className="grid gap-3 md:grid-cols-3">
          {BINS.map((b) => (
            <button
              key={b.key}
              ref={(el) => {
                binRefs.current[b.key] = el;
              }}
              type="button"
              disabled={finished}
              onClick={() => tryPlace(b.key)}
              aria-label={`Thả “${top?.text ?? ""}” vào ô ${b.label}`}
              className={cn(
                "min-h-32 cursor-pointer rounded-2xl border-2 border-ink p-4 text-left transition-[background-color,transform] duration-150 disabled:cursor-default",
                hover === b.key ? "scale-[1.02] bg-lime" : "bg-white hover:bg-lime/40",
                miss?.bin === b.key && "animate-[jitter_.3s_steps(2)_2] bg-alarm/10",
              )}
            >
              <span className="flex items-center justify-between font-mono text-sm font-extrabold uppercase">
                {b.label}
                <span className="tabular-nums text-muted-ink">{placed[b.key].length}/{CHIPS.filter((c) => c.bin === b.key).length}</span>
              </span>
              <span className="mt-3 flex flex-wrap gap-1.5">
                {placed[b.key].map((t) => (
                  <motion.span
                    key={t}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="rounded-full bg-ink px-2.5 py-1 text-xs font-semibold text-paper"
                  >
                    {t}
                  </motion.span>
                ))}
              </span>
            </button>
          ))}
        </div>

        <AnimatePresence>
          {finished && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 grid gap-3 md:grid-cols-3"
            >
              {BINS.map((b) => (
                <div key={b.key} className="rounded-2xl bg-ink p-5 text-paper">
                  <h3 className="font-mono font-extrabold text-lime uppercase">{b.label}</h3>
                  <p className="mt-2 text-sm leading-relaxed">{b.def}</p>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
