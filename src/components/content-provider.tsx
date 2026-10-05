"use client";

import { createContext, useContext, useEffect, useMemo, useSyncExternalStore } from "react";
import { DEFAULT_CONTENT, mergeContent, type SiteContent } from "@/lib/content";
import { useDbValue } from "@/lib/firebase";
import snapshot from "@/lib/content-snapshot.json";

/**
 * Thứ tự ưu tiên nội dung (sau ghi đè trước):
 *   mặc định trong code ← bản nhúng lúc build ← bản lưu trên máy ← bản trực tiếp từ Firebase.
 * Nhờ hai lớp giữa, chữ hiện đúng ngay từ đầu thay vì nhảy sau khi Firebase trả lời.
 */
const BAKED = mergeContent(DEFAULT_CONTENT, snapshot);
const CACHE_KEY = "tinhluot.content.v1";

let cachedRaw: string | null | undefined;
let cachedValue: SiteContent = BAKED;
function readCache(): SiteContent {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(CACHE_KEY);
  } catch {}
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cachedValue = raw ? mergeContent(BAKED, JSON.parse(raw)) : BAKED;
    } catch {
      cachedValue = BAKED;
    }
  }
  return cachedValue;
}
const noopSubscribe = () => () => {};

const Ctx = createContext<SiteContent>(BAKED);

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const remote = useDbValue<unknown>("content");
  const cached = useSyncExternalStore(noopSubscribe, readCache, () => BAKED);
  const content = useMemo(
    () => (remote.loading || remote.error ? cached : mergeContent(BAKED, remote.data)),
    [remote.loading, remote.error, remote.data, cached],
  );

  // Lưu bản mới nhất cho lần mở sau.
  useEffect(() => {
    if (remote.loading || remote.error) return;
    try {
      if (remote.data) localStorage.setItem(CACHE_KEY, JSON.stringify(remote.data));
      else localStorage.removeItem(CACHE_KEY);
    } catch {}
  }, [remote.loading, remote.error, remote.data]);

  return <Ctx.Provider value={content}>{children}</Ctx.Provider>;
}

export const useContent = () => useContext(Ctx);
