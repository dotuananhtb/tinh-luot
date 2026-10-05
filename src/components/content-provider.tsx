"use client";

import { createContext, useContext, useMemo } from "react";
import { DEFAULT_CONTENT, mergeContent, type SiteContent } from "@/lib/content";
import { useDbValue } from "@/lib/firebase";

const Ctx = createContext<SiteContent>(DEFAULT_CONTENT);

/** Nội dung trang = mặc định trong code, ghi đè bởi bản nhóm đã sửa ở /quan-tri (nếu có). */
export function ContentProvider({ children }: { children: React.ReactNode }) {
  const remote = useDbValue<unknown>("content");
  const content = useMemo(() => mergeContent(DEFAULT_CONTENT, remote.data), [remote.data]);
  return <Ctx.Provider value={content}>{children}</Ctx.Provider>;
}

export const useContent = () => useContext(Ctx);
