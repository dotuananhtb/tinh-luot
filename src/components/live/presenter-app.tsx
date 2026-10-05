"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { remove, set } from "firebase/database";
import { ChevronLeft, ChevronRight, Eye, EyeOff, MonitorPlay, RotateCcw, ScanLine, Users } from "lucide-react";
import { REACTIONS } from "@/lib/content";
import { dbRef } from "@/lib/firebase";
import { newSessionId, setLive, useLive, useVoteCounts, type LiveState } from "@/lib/live";
import { usePledgeWall } from "@/lib/pledges";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useContent } from "@/components/content-provider";
import { SignOutButton } from "@/components/editor-gate";
import { PostBody } from "@/components/shared/post-body";
import { QrCode, useSiteUrl } from "./qr-code";
import { VoteBars } from "./vote-bars";
import { CountUp } from "@/components/fx/count-up";
import { celebrateBig } from "@/lib/celebrate";

const SCREENS: { key: LiveState["screen"]; label: string; hint: string }[] = [
  { key: "idle", label: "Chờ", hint: "1" },
  { key: "vote", label: "Bỏ phiếu", hint: "2" },
  { key: "pledge", label: "Cam kết", hint: "3" },
];

function JoinCard({ url, label, big = false }: { url: string; label: string; big?: boolean }) {
  return (
    <div className={cn("flex items-center gap-4 rounded-2xl border-2 border-ink bg-white p-3", big && "flex-col p-6")}>
      <QrCode url={url} className={cn("aspect-square", big ? "w-[min(38vh,26rem)]" : "w-28")} />
      <div className={cn(big && "text-center")}>
        <p className={cn("font-mono font-extrabold", big ? "text-3xl" : "text-sm")}>{label}</p>
        <p className={cn("font-mono break-all text-muted-ink", big ? "mt-1 text-lg" : "text-xs")}>{url.replace(/^https?:\/\//, "")}</p>
      </div>
    </div>
  );
}

function VoteScreen({ state }: { state: LiveState }) {
  const { posts } = useContent();
  const post = posts[state.post];
  const { counts, total } = useVoteCounts(state.session, state.post);
  // Khoảnh khắc lật đáp án trên máy chiếu.
  useEffect(() => {
    if (state.reveal) celebrateBig();
  }, [state.reveal, state.post]);
  const voteUrl = useSiteUrl("/bo-phieu/");
  const answerLabel = REACTIONS.find((r) => r.key === post.answer)?.label;

  return (
    <div className="grid h-full gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
      <div className="flex min-h-0 flex-col gap-4">
        <p className="font-mono text-lg font-extrabold">
          BÀI {state.post + 1}/{posts.length}
        </p>
        <div className="shrink-0 overflow-hidden rounded-2xl border-2 border-ink text-xl [&_.aspect-video]:aspect-auto [&_.aspect-video]:h-[clamp(5rem,17vh,15rem)] [&_p]:text-[1.15rem]">
          <PostBody post={post} truth={state.reveal} />
        </div>
        <JoinCard url={voteUrl} label="Quét để bỏ phiếu" />
      </div>
      <div className="flex min-h-0 flex-col justify-center gap-6">
        <div className="flex items-baseline justify-between">
          <p className="font-mono text-2xl font-extrabold">CẢ LỚP PHẢN ỨNG</p>
          <p className="flex items-center gap-2 font-mono text-2xl font-bold tabular-nums">
            <Users className="size-6" /> <CountUp value={total} />
          </p>
        </div>
        <VoteBars counts={counts} total={total} answer={state.reveal ? post.answer : null} big />
        <AnimatePresence>
          {state.reveal && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-2xl border-2 border-ink bg-lime p-5"
            >
              <p className="font-mono text-2xl font-extrabold">Phản ứng đúng: {answerLabel}</p>
              <p className="mt-2 text-xl leading-snug">{post.explain}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function PledgeScreen() {
  const { all, entries, hidden } = usePledgeWall();
  const pledgeUrl = useSiteUrl("/#cam-ket");
  // Chế độ kiểm duyệt hiện cả tên đã ẩn (gạch ngang) để có thể bỏ ẩn.
  const [moderate, setModerate] = useState(false);

  return (
    <div className="grid h-full gap-8 lg:grid-cols-[auto_minmax(0,1fr)]">
      <div className="flex flex-col items-center justify-center gap-6">
        <JoinCard url={pledgeUrl} label="Quét để ký cam kết" big />
      </div>
      <div className="flex min-h-0 flex-col">
        <div className="flex flex-wrap items-baseline gap-4">
          <span className="font-mono text-3xl font-bold">Đã có</span>
          <motion.span
            key={entries.length}
            initial={{ scale: 1.25 }}
            animate={{ scale: 1 }}
            className="border-4 border-ink bg-lime px-4 font-mono text-[clamp(4rem,10vw,8rem)] leading-none font-extrabold tabular-nums"
          >
            <CountUp value={entries.length} />
          </motion.span>
          <span className="font-mono text-3xl font-bold">sinh viên cam kết</span>
        </div>
        <div className="mt-6 flex items-center justify-between">
          <p className="font-mono text-sm font-bold text-muted-ink">BỨC TƯỜNG CAM KẾT</p>
          <Button variant="outline" size="sm" onClick={() => setModerate((m) => !m)}>
            {moderate ? <Eye /> : <EyeOff />} {moderate ? "Xong kiểm duyệt" : "Kiểm duyệt tên"}
          </Button>
        </div>
        <div className="mt-3 flex min-h-0 flex-1 flex-wrap content-start gap-2 overflow-y-auto">
          {(moderate ? all : entries.slice(0, 80)).map((w) => {
            const isHidden = !!hidden[w.id];
            return (
              <motion.button
                layout
                key={w.id}
                type="button"
                disabled={!moderate}
                onClick={() => (isHidden ? remove(dbRef(`hidden/${w.id}`)) : set(dbRef(`hidden/${w.id}`), true))}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                className={cn(
                  "rounded-full border-2 px-4 py-1.5 text-xl font-semibold",
                  isHidden ? "border-alarm bg-alarm/10 text-alarm line-through" : "border-ink bg-white",
                  moderate && "cursor-pointer hover:bg-alarm/10",
                )}
                title={moderate ? (isHidden ? "Bấm để hiện lại" : "Bấm để ẩn tên này") : undefined}
              >
                {w.name}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function IdleScreen() {
  const voteUrl = useSiteUrl("/bo-phieu/");
  const { slogan } = useContent();
  return (
    <div className="flex h-full flex-col items-center justify-center gap-5 text-center lg:gap-8">
      <p className="font-mono text-[clamp(1.75rem,min(4.5vw,6vh),3.5rem)] leading-tight font-extrabold text-balance">Mở điện thoại, quét mã để cùng lướt</p>
      <JoinCard url={voteUrl} label="tinh-luot · bỏ phiếu" big />
      <p className="font-mono text-xl font-bold text-muted-ink">{slogan}</p>
    </div>
  );
}

/** Màn hình máy chiếu. Phím: ← → đổi bài · Space lật đáp án · 1/2/3 đổi màn · F toàn màn hình. */
export function PresenterApp() {
  const live = useLive();
  const { posts } = useContent();
  const state = live.data;
  const [confirmReset, setConfirmReset] = useState(false);

  const update = useCallback(
    (patch: Partial<LiveState>) => state && setLive({ ...state, ...patch }),
    [state],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!state || (e.target as HTMLElement).closest("input, textarea")) return;
      if (e.key === "ArrowRight" && state.post < posts.length - 1) update({ post: state.post + 1, reveal: false, screen: "vote" });
      else if (e.key === "ArrowLeft" && state.post > 0) update({ post: state.post - 1, reveal: false, screen: "vote" });
      else if (e.key === " ") {
        e.preventDefault();
        update({ reveal: !state.reveal });
      } else if (["1", "2", "3"].includes(e.key)) update({ screen: SCREENS[Number(e.key) - 1].key });
      else if (e.key.toLowerCase() === "f") {
        if (document.fullscreenElement) document.exitFullscreen();
        else document.documentElement.requestFullscreen();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [state, posts.length, update]);

  if (live.loading) return <p className="p-10 font-mono">Đang kết nối…</p>;
  if (!state) return <p className="p-10 font-mono text-alarm">Không đọc được trạng thái trình chiếu (kiểm tra mạng / Firebase).</p>;

  return (
    <main className="flex h-dvh flex-col bg-paper">
      <header className="flex flex-wrap items-center gap-3 border-b-2 border-ink px-5 py-2.5">
        <span className="border-2 border-ink bg-lime px-2 py-0.5 font-mono text-xs font-extrabold tracking-[0.2em]">TỈNH LƯỚT</span>
        <span className="flex items-center gap-1.5 font-mono text-xs font-bold">
          <MonitorPlay className="size-4" /> Buổi: {state.session}
        </span>
        <nav className="ml-auto flex gap-1" aria-label="Màn hình">
          {SCREENS.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => update({ screen: s.key })}
              className={cn(
                "h-11 cursor-pointer rounded-full border-2 border-ink px-4 font-mono text-xs font-bold",
                state.screen === s.key ? "bg-ink text-lime" : "bg-white",
              )}
            >
              {s.hint}. {s.label}
            </button>
          ))}
        </nav>
        <SignOutButton />
      </header>

      <div className="min-h-0 flex-1 overflow-auto p-6">
        {state.screen === "vote" && <VoteScreen state={state} />}
        {state.screen === "pledge" && <PledgeScreen />}
        {state.screen === "idle" && <IdleScreen />}
      </div>

      <footer className="flex flex-wrap items-center gap-3 border-t-2 border-ink px-5 py-3">
        <Button variant="outline" disabled={state.post === 0} onClick={() => update({ post: state.post - 1, reveal: false, screen: "vote" })}>
          <ChevronLeft /> Bài trước
        </Button>
        <Button onClick={() => update({ reveal: !state.reveal, screen: "vote" })}>
          <ScanLine /> {state.reveal ? "Ẩn đáp án" : "Lật đáp án"}
          <kbd className="ml-1 rounded border border-ink/40 px-1 text-xs">Space</kbd>
        </Button>
        <Button
          variant="outline"
          disabled={state.post === posts.length - 1}
          onClick={() => update({ post: state.post + 1, reveal: false, screen: "vote" })}
        >
          Bài sau <ChevronRight />
        </Button>
        <span className="ml-auto font-mono text-xs text-muted-ink">← → đổi bài · Space lật · 1/2/3 đổi màn · F toàn màn hình</span>
        <Button
          variant={confirmReset ? "ink" : "ghost"}
          size="sm"
          onClick={() => {
            if (!confirmReset) return setConfirmReset(true);
            setConfirmReset(false);
            update({ session: newSessionId(), post: 0, reveal: false, screen: "idle" });
          }}
          onBlur={() => setConfirmReset(false)}
        >
          <RotateCcw /> {confirmReset ? "Bấm lần nữa để mở buổi mới" : "Buổi mới (đếm phiếu lại từ 0)"}
        </Button>
      </footer>
    </main>
  );
}
