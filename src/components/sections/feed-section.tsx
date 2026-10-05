"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowDown, Check, RotateCcw, X } from "lucide-react";
import { MAX_SCORE, REACTIONS, verdict, type Post, type Reaction } from "@/lib/content";
import { useContent } from "@/components/content-provider";
import { PostBody, REACTION_ICON } from "@/components/shared/post-body";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { TwoLayer } from "@/components/lens/two-layer";
import { SectionHeading } from "@/components/shared/section-heading";
import { CountUp } from "@/components/fx/count-up";
import { burstFrom } from "@/lib/celebrate";

function PostCard({
  post,
  index,
  picked,
  onPick,
}: {
  post: Post;
  index: number;
  picked: Reaction | null;
  onPick: (r: Reaction) => void;
}) {
  const right = picked === post.answer;
  const answerLabel = REACTIONS.find((r) => r.key === post.answer)!.label;

  return (
    <article className="overflow-hidden rounded-2xl border-2 border-ink bg-white shadow-[6px_6px_0_var(--ink)]">
      <div className="flex items-center justify-between bg-ink px-4 py-1.5 font-mono text-xs font-bold text-paper">
        <span>BÀI {index + 1}/8</span>
        <span className="text-lime">SOI TRƯỚC KHI BẤM</span>
      </div>
      <TwoLayer noise={<PostBody post={post} />} truth={<PostBody post={post} truth />} />

      <div role="group" aria-label="Phản ứng của bạn" className="grid grid-cols-5 gap-1 border-t-2 border-ink p-1.5">
        {REACTIONS.map(({ key, label }) => {
          const Icon = REACTION_ICON[key];
          const isPicked = picked === key;
          const isAnswer = picked && !right && key === post.answer;
          return (
            <button
              key={key}
              type="button"
              disabled={!!picked}
              onClick={() => onPick(key)}
              className={cn(
                "flex min-h-14 min-w-0 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl px-0.5 text-center break-words text-xs leading-tight font-semibold text-muted-ink transition-[background-color,transform] duration-150 active:scale-95 disabled:cursor-default",
                !picked && "hover:bg-paper hover:text-ink",
                isPicked && (right ? "bg-lime text-ink" : "bg-alarm text-white"),
                isAnswer && "text-good outline-2 outline-good outline-dashed -outline-offset-2",
              )}
            >
              <Icon className="size-5" />
              {label}
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {picked && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden"
            role="status"
          >
            <div
              className={cn(
                "m-2 mt-0 flex gap-3 rounded-xl p-3 text-sm",
                right ? "bg-lime" : "bg-alarm/10",
              )}
            >
              <span
                className={cn(
                  "grid size-7 shrink-0 place-items-center rounded-full",
                  right ? "bg-ink text-lime" : "bg-alarm text-white",
                )}
              >
                {right ? <Check className="size-4" /> : <X className="size-4" />}
              </span>
              <div>
                <p className="font-mono font-bold">
                  {right ? "Chính xác! +10" : `Chưa đúng – nên chọn “${answerLabel}”`}
                </p>
                <p className="mt-0.5">{post.explain}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}

export function FeedSection({
  answers,
  score,
  onPick,
  onReset,
}: {
  answers: (Reaction | null)[];
  score: number;
  onPick: (i: number, r: Reaction) => void;
  onReset: () => void;
}) {
  const done = answers.filter(Boolean).length;
  const POSTS = useContent().posts;
  const finished = done === POSTS.length;
  const resultRef = useRef<HTMLDivElement>(null);
  // Ăn mừng khi vừa lướt xong với kết quả "Người lướt tỉnh táo".
  useEffect(() => {
    if (finished && score >= 70) {
      const t = setTimeout(() => burstFrom(resultRef.current, 1.2), 350);
      return () => clearTimeout(t);
    }
  }, [finished, score]);
  const v = verdict(score);

  return (
    <section id="luot-thu" className="border-t-2 border-ink bg-[radial-gradient(var(--ink)_1px,transparent_1px)] [background-size:18px_18px] py-20">
      <div className="mx-auto max-w-5xl px-4">
        <div className="rounded-2xl bg-paper/95 p-1">
          <SectionHeading
            index={3}
            kicker="Lướt thử"
            title={<>Bảng tin của bạn. Soi rồi hãy bấm.</>}
            lead="8 bài đăng, mỗi bài chọn một phản ứng: đúng được +10 điểm, sai sẽ có giải thích. Đưa Kính Tỉnh qua bài đăng để thấy những dấu hiệu mà mắt thường lướt qua. Mọi tên trong bảng tin đều là tên giả."
            className="mb-0"
          />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="mx-auto flex w-full max-w-xl flex-col gap-8">
            {POSTS.map((p, i) => (
              <PostCard key={i} post={p} index={i} picked={answers[i]} onPick={(r) => onPick(i, r)} />
            ))}
          </div>

          <aside className="sticky top-16 z-20 order-first self-start lg:order-none">
            <div className="flex items-center gap-4 rounded-2xl border-2 border-ink bg-ink px-4 py-2.5 text-paper lg:block lg:p-4">
              <div className="flex shrink-0 items-baseline gap-2 lg:block">
                <p className="font-mono text-xs font-bold tracking-widest text-lime">ĐỘ TỈNH TÁO</p>
                <p className="font-mono text-xl font-extrabold tabular-nums lg:mt-1 lg:text-4xl">
                  <CountUp value={score} />
                  <span className="text-sm text-paper/60 lg:text-lg">/{MAX_SCORE}</span>
                </p>
              </div>
              <div className="flex flex-1 gap-1 lg:mt-3">
                {answers.map((a, i) => (
                  <span
                    key={i}
                    className={cn(
                      "h-1.5 flex-1 rounded-full",
                      !a ? "bg-paper/20" : a === POSTS[i].answer ? "bg-lime" : "bg-alarm",
                    )}
                  />
                ))}
              </div>
              <ul className="mt-4 hidden space-y-1.5 text-xs text-paper/80 lg:block">
                <li className="flex items-center gap-2">
                  <span className="size-3 rounded-sm bg-alarm" /> Dấu hiệu thao túng
                </li>
                <li className="flex items-center gap-2">
                  <span className="size-3 rounded-sm bg-good" /> Dấu hiệu lành mạnh
                </li>
              </ul>
            </div>
          </aside>
        </div>

        <AnimatePresence>
          {finished && (
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              ref={resultRef}
              className="mx-auto mt-12 max-w-xl rounded-2xl border-2 border-ink bg-white p-7 text-center shadow-[8px_8px_0_var(--ink)]"
              aria-live="polite"
            >
              <p className="font-mono text-xs font-bold tracking-widest">KẾT QUẢ</p>
              <p className="font-mono text-6xl font-extrabold tabular-nums">
                <CountUp value={score} />
                <span className="text-2xl">/{MAX_SCORE}</span>
              </p>
              <p
                className={cn(
                  "mt-3 inline-block rounded-lg border-2 border-ink px-4 py-1.5 font-mono text-lg font-extrabold",
                  v.tone === "lime" && "bg-lime",
                  v.tone === "amber" && "bg-[#F7C59F]",
                  v.tone === "red" && "bg-alarm text-white",
                )}
              >
                {v.title}
              </p>
              <p className="mt-3 text-muted-ink">{v.msg}</p>
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <Button variant={score < 40 ? "default" : "outline"} onClick={onReset}>
                  <RotateCcw /> Lướt lại
                </Button>
                {score >= 40 && (
                  <a href="#phan-loai" className={buttonVariants()}>
                    Tiếp tục <ArrowDown />
                  </a>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
