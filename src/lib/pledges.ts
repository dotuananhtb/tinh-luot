"use client";

import { useMemo, useSyncExternalStore } from "react";
import { get, serverTimestamp, set } from "firebase/database";
import { dbRef, ensureAnonUid, useDbValue } from "./firebase";
import { addToWall, getServerWall, getWall, subscribeWall } from "./pledge-wall";

export type PledgeEntry = { id: string; name: string; score: number | null; t: number };
type RemotePledge = { name: string; score?: number; t: number };

/**
 * Bức tường cam kết. Ưu tiên dữ liệu chung trên Firebase (realtime, bỏ tên bị kiểm duyệt ẩn);
 * nếu Firebase lỗi (chưa bật Auth, mất mạng) thì dùng bản lưu trên thiết bị.
 */
export function usePledgeWall() {
  const remote = useDbValue<Record<string, RemotePledge>>("pledges");
  const hidden = useDbValue<Record<string, boolean>>("hidden");
  const local = useSyncExternalStore(subscribeWall, getWall, getServerWall);

  return useMemo(() => {
    const live = !remote.error && !remote.loading;
    // `all` gồm cả tên đã bị ẩn (cho màn kiểm duyệt); `entries` là những gì công khai.
    const all: PledgeEntry[] = live
      ? Object.entries(remote.data ?? {}).map(([id, p]) => ({ id, name: p.name, score: p.score ?? null, t: p.t }))
      : local.map((w) => ({ id: String(w.t), name: w.name, score: w.score, t: w.t }));
    all.sort((a, b) => b.t - a.t);
    const entries = all.filter((e) => !hidden.data?.[e.id]);
    return { all, entries, live, loading: remote.loading, hidden: hidden.data ?? {} };
  }, [remote, hidden.data, local]);
}

export type PledgeResult = "live" | "already" | "local";

/** Ký cam kết: mỗi thiết bị một chữ ký trên bức tường chung. */
export async function submitPledge(name: string, score: number | null): Promise<PledgeResult> {
  const uid = await ensureAnonUid();
  if (uid) {
    try {
      const mine = dbRef(`pledges/${uid}`);
      if ((await get(mine)).exists()) return "already";
      await set(mine, { name, t: serverTimestamp(), ...(score === null ? {} : { score }) });
      return "live";
    } catch {
      // rơi xuống lưu cục bộ
    }
  }
  addToWall({ name, score, t: Date.now() });
  return "local";
}
