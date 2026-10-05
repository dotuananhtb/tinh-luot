"use client";

import { useMemo } from "react";
import { get, set } from "firebase/database";
import { REACTIONS, type Reaction } from "./content";
import { dbRef, ensureAnonUid, useDbValue } from "./firebase";

/** Trạng thái buổi trình diễn do người trình chiếu điều khiển; mọi máy khán giả nghe theo. */
export type LiveState = {
  session: string;
  post: number; // 0..7
  reveal: boolean;
  screen: "idle" | "vote" | "pledge";
};

export const useLive = () => useDbValue<LiveState>("live");

export const votePath = (session: string, post: number) => `votes/${session}/p${post + 1}`;

/** Đếm phiếu realtime của một bài trong một buổi. */
export function useVoteCounts(session: string | undefined, post: number | undefined) {
  const v = useDbValue<Record<string, Reaction>>(session !== undefined && post !== undefined ? votePath(session, post) : null);
  return useMemo(() => {
    const counts = Object.fromEntries(REACTIONS.map((r) => [r.key, 0])) as Record<Reaction, number>;
    for (const r of Object.values(v.data ?? {})) if (r in counts) counts[r] += 1;
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    return { counts, total, error: v.error };
  }, [v.data, v.error]);
}

export type VoteResult = { ok: true; reaction: Reaction } | { ok: false; reason: "offline" | "already"; reaction?: Reaction };

/** Phiếu mà thiết bị này đã bỏ (nếu có). */
export async function myVote(session: string, post: number): Promise<Reaction | null> {
  const uid = await ensureAnonUid();
  if (!uid) return null;
  try {
    return ((await get(dbRef(`${votePath(session, post)}/${uid}`))).val() as Reaction) ?? null;
  } catch {
    return null;
  }
}

/** Bỏ phiếu: mỗi thiết bị một phiếu cho mỗi bài trong một buổi (rules của Firebase bảo đảm). */
export async function castVote(session: string, post: number, reaction: Reaction): Promise<VoteResult> {
  const uid = await ensureAnonUid();
  if (!uid) return { ok: false, reason: "offline" };
  const mine = dbRef(`${votePath(session, post)}/${uid}`);
  try {
    await set(mine, reaction);
    return { ok: true, reaction };
  } catch {
    const existing = await get(mine).then((s) => s.val() as Reaction | null).catch(() => null);
    return existing ? { ok: false, reason: "already", reaction: existing } : { ok: false, reason: "offline" };
  }
}

/** Ghi trạng thái màn chiếu (chỉ biên tập viên). */
export const setLive = (next: LiveState) => set(dbRef("live"), next);

/** Mã buổi mới theo thời điểm, ví dụ "b-1005-1430". */
export function newSessionId(d = new Date()) {
  const p = (n: number) => String(n).padStart(2, "0");
  return `b-${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}`;
}
