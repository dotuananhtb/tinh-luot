"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Check, Hourglass, Pencil, WifiOff } from "lucide-react";
import { REACTIONS, type Reaction } from "@/lib/content";
import { castVote, myVote, useLive, useVoteCounts } from "@/lib/live";
import { useDisplayName } from "@/lib/firebase";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useContent } from "@/components/content-provider";
import { PostBody, REACTION_ICON } from "@/components/shared/post-body";
import { VoteBars } from "./vote-bars";
import { burst } from "@/lib/celebrate";

const homeHref = (hash = "") => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/${hash}`;

type Greeting = { name: string | null; onEdit: () => void } | undefined;

function Frame({ children, greeting }: { children: React.ReactNode; greeting?: Greeting }) {
  return (
    <main className="min-h-dvh bg-paper">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b-2 border-ink bg-paper/95 px-4 py-3 backdrop-blur">
        <span className="border-2 border-ink bg-lime px-2 py-0.5 font-mono text-xs font-extrabold tracking-[0.2em]">TỈNH LƯỚT</span>
        {greeting?.name ? (
          <button
            type="button"
            onClick={greeting.onEdit}
            className="flex min-h-11 max-w-[60%] cursor-pointer items-center gap-1.5 rounded-full px-2 text-sm font-semibold"
            aria-label={`Đổi tên hiển thị (đang là ${greeting.name})`}
          >
            <span className="truncate">Chào, {greeting.name}</span>
            <Pencil className="size-3.5 shrink-0" />
          </button>
        ) : (
          <span className="flex items-center gap-1.5 font-mono text-xs font-bold">
            <span className="size-2 animate-pulse rounded-full bg-alarm" /> BỎ PHIẾU TRỰC TIẾP
          </span>
        )}
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

/** Đặt tên hiển thị cho tài khoản ẩn danh. Không bắt buộc: có thể bỏ qua. */
function NameCard({ initial, editing, onSave, onSkip }: { initial: string; editing: boolean; onSave: (n: string) => Promise<boolean>; onSkip: () => void }) {
  const [value, setValue] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    setBusy(true);
    const ok = await onSave(value);
    setBusy(false);
    setError(!ok);
  };
  return (
    <form onSubmit={submit} className="mt-8 rounded-2xl border-2 border-ink bg-white p-6 shadow-[6px_6px_0_var(--ink)]">
      <h1 className="font-mono text-xl font-extrabold">{editing ? "Đổi tên hiển thị" : "Bạn tên gì?"}</h1>
      <p className="mt-1 text-sm text-muted-ink">Không cần đăng ký. Tên chỉ gắn với thiết bị này.</p>
      <label htmlFor="display-name" className="mt-5 mb-1.5 block text-sm font-bold">
        Tên hiển thị
      </label>
      <Input
        id="display-name"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        maxLength={40}
        autoComplete="nickname"
        autoFocus
        placeholder="Ví dụ: Lan Anh"
        className="h-12 rounded-xl border-2 bg-white px-4 text-base"
      />
      {error && <p className="mt-2 text-sm font-semibold text-alarm" role="alert">Chưa lưu được tên. Kiểm tra mạng rồi thử lại.</p>}
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Button type="submit" size="lg" disabled={!value.trim() || busy}>
          {busy ? "Đang lưu…" : editing ? "Lưu tên" : "Vào bỏ phiếu"} <ArrowRight />
        </Button>
        <Button type="button" variant="ghost" onClick={onSkip}>
          {editing ? "Hủy" : "Bỏ qua"}
        </Button>
      </div>
    </form>
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
  const display = useDisplayName();
  const [editingName, setEditingName] = useState(false);
  const [skippedName, setSkippedName] = useState(false);
  const correctNow = !!state?.reveal && !!mine && mine.key === key && mine.reaction === posts[state.post]?.answer;
  useEffect(() => {
    if (correctNow) burst(0.5, 0.45, 1);
  }, [correctNow]);
  const greeting: Greeting = { name: display.name, onEdit: () => setEditingName(true) };

  useEffect(() => {
    if (!state || !key) return;
    let alive = true;
    myVote(state.session, state.post).then((r) => alive && setMine({ key, reaction: r }));
    return () => {
      alive = false;
    };
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps -- chỉ cần chạy lại khi đổi bài/buổi

  if (display.ready && (editingName || (!display.name && !skippedName))) {
    return (
      <Frame greeting={greeting}>
        <NameCard
          initial={display.name ?? ""}
          editing={editingName}
          onSave={async (n) => {
            const ok = await display.save(n);
            if (ok) setEditingName(false);
            return ok;
          }}
          onSkip={() => (editingName ? setEditingName(false) : setSkippedName(true))}
        />
      </Frame>
    );
  }

  if (live.loading) return <Frame greeting={greeting}><Notice icon={<Hourglass />} title="Đang kết nối…" body="Chờ một chút nhé." /></Frame>;
  if (live.error || !state) {
    return (
      <Frame greeting={greeting}>
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
      <Frame greeting={greeting}>
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
    return <Frame greeting={greeting}><Notice icon={<Hourglass />} title="Chờ MC bắt đầu" body="Giữ màn hình này. Bài đăng sẽ tự hiện khi bắt đầu bỏ phiếu." /></Frame>;
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
    <Frame greeting={greeting}>
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

      {voted && !state.reveal && (
          <p className="mt-4 animate-in text-center font-mono text-sm font-bold duration-300 fade-in slide-in-from-bottom-2">
            Đã ghi phiếu. Nhìn lên màn chiếu, chờ MC lật đáp án!
          </p>
        )}

      {state.reveal && (
        <div className="mt-5 animate-in space-y-4 duration-300 fade-in slide-in-from-bottom-3">
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
        </div>
      )}
    </Frame>
  );
}
