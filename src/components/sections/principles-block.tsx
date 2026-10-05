"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, X } from "lucide-react";
import { type Face } from "@/lib/content";
import { useContent } from "@/components/content-provider";
import { cn } from "@/lib/utils";
import { TwoLayer } from "@/components/lens/two-layer";

/** 4 nguyên tắc: ngộ nhận (hiện tượng) đè lên nguyên tắc (bản chất). */
function PrincipleCards() {
  const PRINCIPLES = useContent().principles;
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {PRINCIPLES.map((p, i) => (
        <TwoLayer
          key={p.title}
          className="overflow-hidden rounded-2xl border-2 border-ink"
          noise={
            <div className="flex h-full min-h-56 flex-col justify-between bg-white p-5">
              <span className="font-mono text-xs font-bold text-muted-ink">NGỘ NHẬN #{i + 1}</span>
              <p className="font-display text-[clamp(1.5rem,4vw,2rem)] leading-tight text-alarm uppercase">“{p.myth}”</p>
              <span className="font-mono text-xs font-bold">SOI ĐỂ THẤY NGUYÊN TẮC →</span>
            </div>
          }
          truth={
            <div className="flex h-full min-h-56 flex-col justify-between gap-3 bg-lime p-5">
              <span className="font-mono text-xs font-bold">NGUYÊN TẮC {i + 1}</span>
              <p className="font-mono text-lg leading-snug font-extrabold">{p.title}</p>
              <p className="text-sm leading-relaxed">{p.body}</p>
            </div>
          }
        />
      ))}
    </div>
  );
}

/** Trò chơi phân biệt hai mặt: chọn tình huống thuộc mặt tư tưởng hay mặt chính trị. */
function TwoFacesGame() {
  const { faces: FACES, faceCases: FACE_CASES } = useContent();
  const [picks, setPicks] = useState<(Face | null)[]>(() => FACE_CASES.map(() => null));
  const done = picks.filter(Boolean).length;
  const right = picks.filter((p, i) => p === FACE_CASES[i].face).length;

  return (
    <div className="mt-12">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="font-mono text-xl font-extrabold">Tách hai mặt</h3>
          <p className="text-sm text-muted-ink">Mỗi tình huống thuộc mặt nào? Chọn đúng mặt thì mới chọn đúng cách giải quyết.</p>
        </div>
        <p className="font-mono text-sm font-bold tabular-nums" aria-live="polite">
          {done}/{FACE_CASES.length} · đúng {right}
        </p>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3">
        {(Object.keys(FACES) as Face[]).map((f) => (
          <div key={f} className={cn("rounded-xl border-2 border-ink p-3", f === "chinhtri" ? "bg-ink text-paper" : "bg-white")}>
            <p className="font-mono text-sm font-extrabold">{FACES[f].label}</p>
            <p className={cn("mt-1 text-xs font-bold", f === "chinhtri" ? "text-lime" : "text-good")}>{FACES[f].nature}</p>
            <p className="mt-1 text-xs leading-snug opacity-80">{FACES[f].method}</p>
          </div>
        ))}
      </div>

      <ol className="space-y-2.5">
        {FACE_CASES.map((c, i) => {
          const pick = picks[i];
          const ok = pick === c.face;
          return (
            <li key={c.text} className="rounded-xl border-2 border-ink bg-white p-3.5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <p className="flex-1 font-medium">{c.text}</p>
                <div className="flex shrink-0 gap-2" role="group" aria-label="Chọn mặt">
                  {(Object.keys(FACES) as Face[]).map((f) => (
                    <button
                      key={f}
                      type="button"
                      disabled={!!pick}
                      onClick={() => setPicks((p) => p.map((v, j) => (j === i ? f : v)))}
                      className={cn(
                        "min-h-11 flex-1 cursor-pointer rounded-full border-2 border-ink px-3.5 text-xs font-bold transition-[background-color,transform] active:scale-95 disabled:cursor-default sm:flex-none",
                        !pick && "hover:bg-lime",
                        pick === f && (ok ? "bg-lime" : "bg-alarm text-white"),
                        pick && pick !== f && f === c.face && "outline-2 outline-good outline-dashed outline-offset-2",
                        pick && pick !== f && f !== c.face && "opacity-40",
                      )}
                    >
                      {FACES[f].label}
                    </button>
                  ))}
                </div>
              </div>
              <AnimatePresence>
                {pick && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="flex items-start gap-2 overflow-hidden pt-2.5 text-sm"
                  >
                    {ok ? <Check className="mt-0.5 size-4 shrink-0 text-good" /> : <X className="mt-0.5 size-4 shrink-0 text-alarm" />}
                    <span>
                      <b>{FACES[c.face].label}</b> ({FACES[c.face].nature.toLowerCase()}): {FACES[c.face].method.toLowerCase()}.
                    </span>
                  </motion.p>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function PrinciplesBlock() {
  return (
    <div className="mt-20">
      <div className="mb-6 flex items-center gap-3 font-mono text-xs font-bold tracking-widest uppercase">
        <span className="rounded bg-ink px-2 py-1 text-lime">4 nguyên tắc</span>
        <span className="h-0.5 flex-1 bg-ink/15" />
      </div>
      <h3 data-reveal="words" className="mb-2 font-mono text-[clamp(1.4rem,4vw,2rem)] leading-tight font-extrabold text-balance">
        Bốn ngộ nhận. Bốn nguyên tắc nằm bên dưới.
      </h3>
      <p className="mb-6 max-w-[60ch] text-muted-ink">
        Đưa Kính Tỉnh qua từng ngộ nhận để thấy nguyên tắc giải quyết vấn đề tôn giáo trong thời kỳ quá độ lên chủ nghĩa xã hội.
      </p>
      <PrincipleCards />
      <TwoFacesGame />
    </div>
  );
}
