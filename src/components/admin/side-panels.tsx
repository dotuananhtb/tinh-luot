"use client";

import { useState } from "react";
import { remove, set } from "firebase/database";
import { Copy, History, KeyRound, RefreshCw, Trash2, UserPlus, XCircle } from "lucide-react";
import type { SiteContent } from "@/lib/content";
import { dbRef, emailKey, useDbValue } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type HistoryEntry = { content: SiteContent; by: string; t: number };

const fmt = (t: number) =>
  new Date(t).toLocaleString("vi-VN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit" });

/** Các bản đã lưu trước đó; "Khôi phục" chỉ nạp vào bản nháp, bấm Lưu mới ghi lên. */
export function HistoryPanel({ onRestore }: { onRestore: (c: SiteContent, label: string) => void }) {
  const h = useDbValue<Record<string, HistoryEntry>>("contentHistory");
  const list = Object.entries(h.data ?? {})
    .map(([id, e]) => ({ id, ...e }))
    .sort((a, b) => b.t - a.t)
    .slice(0, 40);

  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-ink">Mỗi lần lưu, bản trước đó được cất ở đây. Khôi phục sẽ nạp vào bản nháp để bạn xem lại rồi mới lưu.</p>
      {h.loading && <p className="text-sm">Đang tải…</p>}
      {!h.loading && list.length === 0 && <p className="text-sm text-muted-ink">Chưa có lần lưu nào.</p>}
      {list.map((e) => (
        <div key={e.id} className="flex items-center gap-3 rounded-xl border-2 border-ink/15 bg-white px-4 py-2.5">
          <History className="size-4 shrink-0 text-muted-ink" />
          <div className="min-w-0 flex-1 text-sm">
            <p className="font-semibold">Trước lần lưu lúc {fmt(e.t)}</p>
            <p className="truncate text-xs text-muted-ink">bởi {e.by}</p>
          </div>
          <Button size="sm" variant="outline" onClick={() => onRestore(e.content, `bản trước lần lưu lúc ${fmt(e.t)}`)}>
            Khôi phục
          </Button>
        </div>
      ))}
    </div>
  );
}

// Bỏ các ký tự dễ nhầm (0/O, 1/I/L) để đọc mã cho nhau không sai.
const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
function randomCode(len = 8) {
  const bytes = crypto.getRandomValues(new Uint32Array(len));
  return Array.from(bytes, (b) => CODE_ALPHABET[b % CODE_ALPHABET.length]).join("");
}

/** Mã mời: ai đăng nhập Google và nhập đúng mã sẽ tự thành biên tập viên. Chỉ owner xem/đổi được. */
function InviteCodeCard() {
  const secret = useDbValue<{ inviteCode?: string }>("secret");
  const code = secret.data?.inviteCode ?? null;
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // trình duyệt chặn clipboard: người dùng tự bôi đen mã
    }
  };

  return (
    <div className="rounded-xl border-2 border-ink bg-white p-4">
      <p className="flex items-center gap-1.5 text-sm font-bold">
        <KeyRound className="size-4" /> Mã mời
      </p>
      <p className="mt-1 text-xs text-muted-ink">
        Gửi mã cho thành viên: họ vào trang này, đăng nhập Google rồi nhập mã. Tạo mã mới thì mã cũ hết hiệu lực (người đã vào vẫn giữ quyền).
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {code ? (
          <code className="rounded-lg bg-lime px-3 py-2 font-mono text-xl font-extrabold tracking-[0.25em] select-all">{code}</code>
        ) : (
          <span className="text-sm font-semibold text-muted-ink">Đang tắt: không ai tự vào được.</span>
        )}
        {code && (
          <Button size="sm" variant="outline" onClick={copy}>
            <Copy /> {copied ? "Đã chép" : "Sao chép"}
          </Button>
        )}
        <Button size="sm" onClick={() => set(dbRef("secret/inviteCode"), randomCode())}>
          <RefreshCw /> {code ? "Tạo mã mới" : "Tạo mã"}
        </Button>
        {code && (
          <Button size="sm" variant="ghost" onClick={() => remove(dbRef("secret/inviteCode"))}>
            <XCircle /> Tắt mã
          </Button>
        )}
      </div>
    </div>
  );
}

/** Owner thêm/xóa biên tập viên. Email lưu dưới dạng khóa (dấu chấm → dấu phẩy). */
export function EditorsPanel({ selfEmail }: { selfEmail: string }) {
  const eds = useDbValue<Record<string, "owner" | "editor">>("editors");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const self = emailKey(selfEmail);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) return setMsg("Email chưa đúng định dạng.");
    if (/[#$[\]/]/.test(clean)) return setMsg("Email có ký tự không hỗ trợ.");
    try {
      await set(dbRef(`editors/${emailKey(clean)}`), "editor");
      setEmail("");
      setMsg(`Đã thêm ${clean}. Người đó đăng nhập Google bằng email này là vào được.`);
    } catch {
      setMsg("Không thêm được (chỉ owner mới có quyền).");
    }
  };

  return (
    <div className="space-y-4">
      <InviteCodeCard />
      <form onSubmit={add} className="flex flex-wrap gap-2">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email-thanh-vien@gmail.com"
          aria-label="Email thành viên"
          className="h-11 min-w-0 flex-[1_1_220px] rounded-full border-2 bg-white px-4"
        />
        <Button type="submit">
          <UserPlus /> Thêm biên tập viên
        </Button>
      </form>
      {msg && <p className="text-sm font-semibold" role="status">{msg}</p>}
      <ul className="divide-y divide-ink/10 rounded-xl border-2 border-ink/15 bg-white">
        {Object.entries(eds.data ?? {}).map(([k, role]) => (
          <li key={k} className="flex items-center gap-3 px-4 py-2.5 text-sm">
            <span className="min-w-0 flex-1 truncate">{k.replaceAll(",", ".")}</span>
            <span className={role === "owner" ? "rounded bg-ink px-2 py-0.5 font-mono text-xs font-bold text-lime" : "font-mono text-xs text-muted-ink"}>
              {role === "owner" ? "OWNER" : "biên tập"}
            </span>
            {k !== self && role !== "owner" && (
              <Button size="icon" variant="ghost" aria-label={`Xóa ${k.replaceAll(",", ".")}`} onClick={() => remove(dbRef(`editors/${k}`))}>
                <Trash2 />
              </Button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
