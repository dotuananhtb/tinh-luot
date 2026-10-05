"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Check, Hourglass, WifiOff } from "lucide-react";
import { REACTIONS, type Reaction } from "@/lib/content";
import { castVote, myVote, useLive, useVoteCounts } from "@/lib/live";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useContent } from "@/components/content-provider";
import { PostBody, REACTION_ICON } from "@/components/sections/feed-section";
import { VoteBars } from "./vote-bars";

const homeHref = (hash = "") => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/${hash}`;

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-dvh bg-paper">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b-2 border-ink bg-paper/95 px-4 py-3 backdrop-blur">
        <span className="border-2 border-ink bg-lime px-2 py-0.5 font-mono text-xs font-extrabold tracking-[0.2em]">TỈNH LƯỚT</span>
        <span className="flex items-center gap-1.5 font-mono text-xs font-bold">
          <span className="size-2 animate-pulse rounded-full bg-alarm" /> BỎ PHIẾU TRỰC TIẾP
        </span>
      </header>
      <div className="mx-auto max-w-md px-4 py-6">{children}</div>
    </main>
  );
}

function Notice({ icon, title, body, cta }: { icon: React.ReactNode; title: string; body: string; cta?: React.ReactNode }) {
  return (
    <div className="mt-10 rounded-2xl border-2 border-ink bg-white p-6 text-center shadow-[6px_6px_0_var(--ink)]">
      <div className="mx-auto mb-3 grid size-12 place-items-center rounded-full bg-ink text-lime">{icon}</div>
      <h1 className="font-mono text-xl font-extrabold">{title}</h1>
      <p className="mt-2 text-muted-ink">{body}</p>
      {cta && <div className="mt-5">{cta}</div>}
    </div>
  );
}

/** Màn hình điện thoại của khán giả: đi theo bài đăng MC đang chiếu. */
export function VoteApp() {
  const live = useLive();
  const { posts } = useContent();
  const state = live.data;
  const key = state ? `${state.session}/${state.post}` : null;
  const counts = useVoteCounts(state?.session, state?.post);
  // Phiếu của máy này, gắn với bài đang chiếu (key) để đổi bài là tự xóa.
  const [mine, setMine] = useState<{ key: string; reaction: Reaction | null } | null>(null);
  const [busy, setBusy] = useState(false);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    if (!state || !key) return;
    let alive = true;
    myVote(state.session, state.post).then((r) => alive && setMine({ key, reaction: r }));
    return () => {
      alive = false;
    };
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps -- chỉ cần chạy lại khi đổi bài/buổi

  if (live.loading) return <Frame><Notice icon={<Hourglass />} title="Đang kết nối…" body="Chờ một chút nhé." /></Frame>;
  if (live.error || !state) {
    return (
      <Frame>
        <Notice
          icon={<WifiOff />}
          title="Chưa kết nối được"
          body="Mạng đang yếu hoặc buổi trình diễn chưa bắt đầu. Bạn vẫn có thể chơi trên trang chính."
          cta={<a className={buttonVariants()} href={homeHref()}>Mở trang chính <ArrowRight /></a>}
        />
      </Frame>
    );
  }

  if (state.screen === "pledge") {
    return (
      <Frame>
        <Notice
          icon={<Check />}
          title="Đến lúc cam kết!"
          body="Tắt 5 thói quen, ký tên và tên bạn sẽ hiện trên màn chiếu."
          cta={<a className={buttonVariants({ size: "lg" })} href={homeHref("#cam-ket")}>Ký cam kết <ArrowRight /></a>}
        />
      </Frame>
    );
  }

  if (state.screen === "idle") {
    return <Frame><Notice icon={<Hourglass />} title="Chờ MC bắt đầu" body="Giữ màn hình này. Bài đăng sẽ tự hiện khi bắt đầu bỏ phiếu." /></Frame>;
  }

  const post = posts[state.post];
  const voted = mine?.key === key ? mine.reaction : null;
  const answerLabel = REACTIONS.find((r) => r.key === post.answer)?.label;

  const vote = async (r: Reaction) => {
    if (voted || busy || !key) return;
    setBusy(true);
    const res = await castVote(state.session, state.post, r);
    setBusy(false);
    if (res.ok || res.reason === "already") setMine({ key, reaction: res.reaction ?? r });
    setOffline(!res.ok && res.reason === "offline");
  };

  return (
    <Frame>
      <p className="mb-3 font-mono text-xs font-bold">
        BÀI {state.post + 1}/{posts.length} · {state.reveal ? "ĐÃ LẬT ĐÁP ÁN" : voted ? "ĐÃ BỎ PHIẾU" : "BẠN SẼ PHẢN ỨNG THẾ NÀO?"}
      </p>
      <div className="overflow-hidden rounded-2xl border-2 border-ink">
        <PostBody post={post} truth={state.reveal} />
      </div>

      {!state.reveal && (
        <div className="mt-4 grid grid-cols-2 gap-2.5">
          {REACTIONS.map(({ key: k, label }) => {
            const Icon = REACTION_ICON[k];
            return (
              <button
                key={k}
                type="button"
                disabled={!!voted || busy}
                onClick={() => vote(k)}
                className={cn(
                  "flex min-h-16 cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 border-ink bg-white font-bold transition-[transform,background-color] active:scale-95 disabled:cursor-default last:col-span-2",
                  voted === k && "bg-lime shadow-[4px_4px_0_var(--ink)]",
                  voted && voted !== k && "opacity-40",
                )}
              >
                <Icon className="size-5" /> {label}
              </button>
            );
          })}
        </div>
      )}

      {offline && <p className="mt-3 text-sm font-semibold text-alarm" role="alert">Chưa gửi được phiếu. Kiểm tra mạng rồi thử lại.</p>}

      <AnimatePresence>
        {voted && !state.reveal && (
          <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 text-center font-mono text-sm font-bold">
            Đã ghi phiếu. Nhìn lên màn chiếu, chờ MC lật đáp án!
          </motion.p>
        )}
      </AnimatePresence>

      {state.reveal && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-5 space-y-4">
          <div className={cn("rounded-2xl border-2 border-ink p-4", voted === post.answer ? "bg-lime" : "bg-white")}>
            <p className="font-mono font-extrabold">
              {voted === post.answer ? "Bạn chọn đúng!" : voted ? `Nên chọn “${answerLabel}”` : `Đáp án: “${answerLabel}”`}
            </p>
            <p className="mt-1 text-sm">{post.explain}</p>
          </div>
          <div>
            <p className="mb-2 font-mono text-xs font-bold">CẢ LỚP CHỌN ({counts.total} phiếu)</p>
            <VoteBars counts={counts.counts} total={counts.total} answer={post.answer} />
          </div>
        </motion.div>
      )}
    </Frame>
  );
}
