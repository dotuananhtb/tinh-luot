"use client";

import { useMemo, useState } from "react";
import { push, serverTimestamp, set } from "firebase/database";
import { AlertTriangle, ExternalLink, MonitorPlay, RotateCcw, Save, Undo2 } from "lucide-react";
import { DEFAULT_CONTENT, mergeContent, type SiteContent } from "@/lib/content";
import { dbRef, useDbValue } from "@/lib/firebase";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { SignOutButton, useEditor } from "@/components/editor-gate";
import { FieldEditor, setAt, type Json } from "./field-editor";
import { EditorsPanel, HistoryPanel } from "./side-panels";
import { validateContent } from "./validate-content";

/** Thứ tự mục trong thanh bên = thứ tự hành trình trên trang chính. */
const SECTIONS: { key: keyof SiteContent; label: string; step: string }[] = [
  { key: "hero", label: "Màn mở đầu", step: "1" },
  { key: "noise", label: "Tít báo lớp ồn", step: "1" },
  { key: "marx", label: "Câu nói của Mác", step: "1" },
  { key: "flips", label: "12 thẻ Hiểu đúng", step: "2" },
  { key: "principles", label: "4 nguyên tắc", step: "2" },
  { key: "faces", label: "Hai mặt: định nghĩa", step: "2" },
  { key: "faceCases", label: "Hai mặt: tình huống", step: "2" },
  { key: "posts", label: "8 bài đăng", step: "3" },
  { key: "bins", label: "3 ô phân loại", step: "4" },
  { key: "chips", label: "9 thẻ phân loại", step: "4" },
  { key: "traits", label: "5 đặc điểm", step: "5" },
  { key: "policies", label: "5 chính sách", step: "5" },
  { key: "timeline", label: "Dòng thời gian", step: "5" },
  { key: "pledges", label: "5 cam kết", step: "6" },
  { key: "slogan", label: "Khẩu hiệu", step: "·" },
  { key: "blooketUrl", label: "Link Blooket", step: "·" },
];

type Tab = keyof SiteContent | "history" | "editors";
const stable = (v: unknown) => JSON.stringify(v);
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

function Editor({ initial, remote }: { initial: SiteContent; remote: SiteContent }) {
  const { user, role } = useEditor();
  const [draft, setDraft] = useState<SiteContent>(initial);
  const [baseline, setBaseline] = useState(() => stable(initial));
  const [tab, setTab] = useState<Tab>("hero");
  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const dirty = stable(draft) !== baseline;
  const remoteChanged = stable(remote) !== baseline && stable(remote) !== stable(draft);
  const issues = useMemo(() => validateContent(draft), [draft]);

  const change = (path: (string | number)[], v: Json) => {
    setDraft((d) => setAt(d as unknown as Json, path, v) as unknown as SiteContent);
    setStatus(null);
  };

  const save = async () => {
    if (issues.length || saving) return;
    setSaving(true);
    try {
      // Cất bản đang chạy trên web vào lịch sử trước khi ghi đè.
      await set(push(dbRef("contentHistory")), { content: remote, by: user.email, t: serverTimestamp() });
      await set(dbRef("content"), draft);
      setBaseline(stable(draft));
      setStatus("Đã lưu. Trang chính cập nhật ngay cho mọi người.");
    } catch (e) {
      setStatus(`Lưu thất bại: ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  const sectionKey = tab !== "history" && tab !== "editors" ? tab : null;

  return (
    <main className="min-h-dvh bg-paper">
      <header className="sticky top-0 z-20 flex flex-wrap items-center gap-3 border-b-2 border-ink bg-paper/95 px-4 py-3 backdrop-blur">
        <span className="border-2 border-ink bg-lime px-2 py-0.5 font-mono text-xs font-extrabold tracking-[0.2em]">TỈNH LƯỚT</span>
        <span className="font-mono text-sm font-bold">Quản trị nội dung</span>
        <span className="hidden truncate text-xs text-muted-ink sm:inline">
          {user.email} · {role === "owner" ? "owner" : "biên tập viên"}
        </span>
        <div className="ml-auto flex flex-wrap gap-2">
          <a className={buttonVariants({ variant: "outline", size: "sm" })} href={`${base}/`} target="_blank" rel="noopener">
            <ExternalLink /> Xem trang
          </a>
          <a className={buttonVariants({ variant: "outline", size: "sm" })} href={`${base}/trinh-chieu/`} target="_blank" rel="noopener">
            <MonitorPlay /> Trình chiếu
          </a>
          <SignOutButton />
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 md:grid-cols-[220px_minmax(0,1fr)]">
        <nav aria-label="Mục nội dung" className="md:sticky md:top-20 md:self-start">
          <ul className="flex gap-1 overflow-x-auto pb-2 md:flex-col md:overflow-visible">
            {SECTIONS.map((s) => (
              <li key={s.key} className="shrink-0">
                <button
                  type="button"
                  onClick={() => setTab(s.key)}
                  className={cn(
                    "flex w-full cursor-pointer items-center gap-2 min-h-11 rounded-lg px-3 py-2 text-left text-sm font-semibold whitespace-nowrap",
                    tab === s.key ? "bg-ink text-lime" : "hover:bg-ink/5",
                    stable(draft[s.key]) !== stable(remote[s.key]) && "after:ml-auto after:size-2 after:rounded-full after:bg-alarm",
                  )}
                >
                  <span className="w-3 font-mono text-xs opacity-60">{s.step}</span>
                  {s.label}
                </button>
              </li>
            ))}
            <li className="mt-2 shrink-0 border-t border-ink/15 pt-2">
              <button type="button" onClick={() => setTab("history")} className={cn("w-full cursor-pointer min-h-11 rounded-lg px-3 py-2 text-left text-sm font-semibold", tab === "history" ? "bg-ink text-lime" : "hover:bg-ink/5")}>
                Lịch sử lưu
              </button>
            </li>
            {role === "owner" && (
              <li className="shrink-0">
                <button type="button" onClick={() => setTab("editors")} className={cn("w-full cursor-pointer min-h-11 rounded-lg px-3 py-2 text-left text-sm font-semibold", tab === "editors" ? "bg-ink text-lime" : "hover:bg-ink/5")}>
                  Thành viên
                </button>
              </li>
            )}
          </ul>
        </nav>

        <section className="min-w-0">
          {remoteChanged && (
            <div className="mb-4 flex flex-wrap items-center gap-3 rounded-xl border-2 border-alarm bg-alarm/10 p-3 text-sm" role="alert">
              <AlertTriangle className="size-4 text-alarm" />
              <span className="flex-1">Một thành viên khác vừa lưu bản mới. Lưu bây giờ sẽ ghi đè thay đổi của họ.</span>
              <Button size="sm" variant="outline" onClick={() => { setDraft(remote); setBaseline(stable(remote)); }}>
                Tải bản mới nhất
              </Button>
            </div>
          )}

          <div className="rounded-2xl border-2 border-ink bg-white/60 p-5">
            {sectionKey && (
              <>
                <h1 className="mb-4 font-mono text-xl font-extrabold">{SECTIONS.find((s) => s.key === sectionKey)?.label}</h1>
                <FieldEditor
                  value={draft[sectionKey] as unknown as Json}
                  onChange={(p, v) => change([sectionKey, ...p], v)}
                />
                <button
                  type="button"
                  className="mt-5 inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-muted-ink underline-offset-2 hover:underline"
                  onClick={() => change([sectionKey], DEFAULT_CONTENT[sectionKey] as unknown as Json)}
                >
                  <RotateCcw className="size-3.5" /> Đặt mục này về nội dung gốc
                </button>
              </>
            )}
            {tab === "history" && (
              <HistoryPanel
                onRestore={(c, label) => {
                  setDraft(mergeContent(DEFAULT_CONTENT, c));
                  setStatus(`Đã nạp ${label} vào bản nháp. Bấm Lưu để áp dụng.`);
                }}
              />
            )}
            {tab === "editors" && role === "owner" && <EditorsPanel selfEmail={user.email!} />}
          </div>
        </section>
      </div>

      {/* thanh lưu cố định */}
      <div className="sticky bottom-0 z-20 border-t-2 border-ink bg-paper/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3">
          {issues.length > 0 ? (
            <details className="min-w-0 flex-1 text-sm">
              <summary className="cursor-pointer font-semibold text-alarm">{issues.length} lỗi cần sửa trước khi lưu</summary>
              <ul className="mt-2 max-h-40 list-disc space-y-1 overflow-y-auto pl-5">
                {issues.map((i) => <li key={i}>{i}</li>)}
              </ul>
            </details>
          ) : (
            <p className="min-w-0 flex-1 text-sm font-semibold" role="status">
              {status ?? (dirty ? "Có thay đổi chưa lưu." : "Không có thay đổi.")}
            </p>
          )}
          <Button variant="ghost" disabled={!dirty || saving} onClick={() => { setDraft(JSON.parse(baseline)); setStatus(null); }}>
            <Undo2 /> Hủy thay đổi
          </Button>
          <Button disabled={!dirty || issues.length > 0 || saving} onClick={save}>
            <Save /> {saving ? "Đang lưu…" : "Lưu"}
          </Button>
        </div>
      </div>
    </main>
  );
}

/** Đợi bản trên Firebase tải xong rồi mới dựng trình sửa (bản nháp khởi tạo đúng một lần). */
export function AdminApp() {
  const remote = useDbValue<unknown>("content");
  const merged = useMemo(() => mergeContent(DEFAULT_CONTENT, remote.data), [remote.data]);
  if (remote.loading) return <p className="p-10 font-mono">Đang tải nội dung…</p>;
  return <Editor initial={merged} remote={merged} />;
}
