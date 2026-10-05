"use client";

import { createContext, useContext, useState, useSyncExternalStore } from "react";
import { GoogleAuthProvider, signInWithPopup, signOut, type User } from "firebase/auth";
import { set } from "firebase/database";
import { Copy, KeyRound, LogIn, LogOut, ShieldAlert, TriangleAlert } from "lucide-react";
import { dbRef, emailKey, getAuthInstance, useDbValue, useUser } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Role = "owner" | "editor";
type EditorCtx = { user: User; role: Role };
const Ctx = createContext<EditorCtx | null>(null);

export function useEditor() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useEditor must be used inside <EditorGate>");
  return ctx;
}

function Shell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main className="grid min-h-dvh place-items-center bg-paper px-4">
      <div className="w-full max-w-md rounded-2xl border-2 border-ink bg-white p-7 shadow-[8px_8px_0_var(--ink)]">
        <p className="mb-1 font-mono text-xs font-bold tracking-widest text-muted-ink">TỈNH LƯỚT</p>
        <h1 className="mb-4 font-mono text-2xl font-extrabold">{title}</h1>
        {children}
      </div>
    </main>
  );
}

/**
 * Google chặn đăng nhập trong trình duyệt nhúng của các app (lỗi "disallowed_useragent"),
 * nên mở link từ Zalo/Messenger/Facebook… sẽ không đăng nhập được. Phát hiện để hướng dẫn trước.
 */
const IN_APP_UA = /FBAN|FBAV|FB_IAB|Instagram|Zalo|Messenger|MicroMessenger|Line\/|TikTok|musical_ly|; wv\)/i;
const noopSubscribe = () => () => {};
function useInAppBrowser() {
  return useSyncExternalStore(noopSubscribe, () => IN_APP_UA.test(navigator.userAgent), () => false);
}

function InAppWarning() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
    } catch {
      // clipboard bị chặn: người dùng dùng menu "Mở bằng trình duyệt" của app
    }
  };
  return (
    <div className="mb-5 rounded-xl border-2 border-alarm bg-alarm/10 p-4 text-sm" role="alert">
      <p className="flex items-center gap-1.5 font-bold text-alarm">
        <TriangleAlert className="size-4" /> Đang mở trong ứng dụng (Zalo/Messenger…)
      </p>
      <p className="mt-1.5">
        Google không cho đăng nhập ở đây. Bấm <b>⋯</b> ở góc màn hình → <b>Mở bằng trình duyệt</b> (Safari/Chrome), hoặc sao chép link rồi dán vào Safari/Chrome.
      </p>
      <Button size="sm" variant="outline" className="mt-3" onClick={copy}>
        <Copy /> {copied ? "Đã sao chép link" : "Sao chép link"}
      </Button>
    </div>
  );
}

/**
 * Tự tham gia bằng mã mời: ghi mã vào nhánh riêng của mình, rồi tự thêm email vào danh sách.
 * Rules trên server so mã với mã bí mật (người thường không đọc được) nên đoán sai là bị từ chối.
 */
function InviteForm({ user }: { user: User }) {
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = code.trim();
    if (!clean || busy) return;
    setBusy(true);
    setError(null);
    try {
      await set(dbRef(`inviteAttempts/${user.uid}`), clean);
      await set(dbRef(`editors/${emailKey(user.email!)}`), "editor");
      window.location.reload(); // nghe lại quyền từ đầu
    } catch {
      setError("Mã không đúng hoặc đã bị tắt. Hỏi lại trưởng nhóm.");
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="mb-5 rounded-xl bg-paper p-4">
      <label htmlFor="invite-code" className="mb-1.5 flex items-center gap-1.5 text-sm font-bold">
        <KeyRound className="size-4" /> Có mã mời từ trưởng nhóm?
      </label>
      <div className="flex flex-wrap gap-2">
        <Input
          id="invite-code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          maxLength={40}
          placeholder="Nhập mã mời"
          className="h-11 min-w-0 flex-[1_1_160px] rounded-full border-2 bg-white px-4 font-mono text-base tracking-widest"
        />
        <Button type="submit" disabled={!code.trim() || busy}>
          {busy ? "Đang kiểm tra…" : "Vào nhóm"}
        </Button>
      </div>
      {error && <p className="mt-2 text-sm font-semibold text-alarm" role="alert">{error}</p>}
    </form>
  );
}

/** Chỉ cho vào khi đã đăng nhập Google bằng email có trong danh sách biên tập viên. */
export function EditorGate({ title, children }: { title: string; children: React.ReactNode }) {
  const user = useUser();
  const isGoogle = !!user && !user.isAnonymous && !!user.email;
  const role = useDbValue<Role>(isGoogle ? `editors/${emailKey(user.email!)}` : null);
  const inApp = useInAppBrowser();
  const [error, setError] = useState<string | null>(null);

  const login = async () => {
    setError(null);
    try {
      await signInWithPopup(await getAuthInstance(), new GoogleAuthProvider());
    } catch (e) {
      const code = (e as { code?: string }).code ?? "";
      setError(
        code.includes("disallowed") || code.includes("web-storage-unsupported")
          ? "Trình duyệt này không hỗ trợ đăng nhập Google. Mở link bằng Safari hoặc Chrome."
          : code.includes("operation-not-allowed") || code.includes("configuration-not-found")
          ? "Đăng nhập Google chưa được bật trong Firebase (Authentication → Sign-in method)."
          : code.includes("unauthorized-domain")
            ? "Tên miền này chưa được thêm vào Authorized domains của Firebase."
            : code.includes("popup-closed")
              ? "Bạn đã đóng cửa sổ đăng nhập."
              : `Không đăng nhập được (${code || "lỗi không rõ"}).`,
      );
    }
  };

  if (user === undefined || (isGoogle && role.loading)) {
    return <Shell title={title}><p className="text-muted-ink">Đang kiểm tra đăng nhập…</p></Shell>;
  }

  if (!isGoogle) {
    return (
      <Shell title={title}>
        <p className="mb-5 text-muted-ink">Trang dành cho thành viên nhóm. Đăng nhập bằng tài khoản Google đã được cấp quyền.</p>
        {inApp && <InAppWarning />}
        <Button onClick={login}>
          <LogIn /> Đăng nhập với Google
        </Button>
        {error && <p className="mt-4 text-sm font-semibold text-alarm" role="alert">{error}</p>}
      </Shell>
    );
  }

  if (!role.data) {
    return (
      <Shell title={title}>
        <p className="mb-2 flex items-center gap-2 font-semibold">
          <ShieldAlert className="size-5 text-alarm" /> Tài khoản chưa có quyền
        </p>
        <p className="mb-4 text-sm text-muted-ink">
          Nhập mã mời, hoặc gửi email <b className="text-ink">{user.email}</b> cho trưởng nhóm để được thêm vào danh sách.
        </p>
        <InviteForm user={user} />
        <Button variant="outline" onClick={async () => signOut(await getAuthInstance())}>
          <LogOut /> Đăng xuất
        </Button>
      </Shell>
    );
  }

  return <Ctx.Provider value={{ user, role: role.data }}>{children}</Ctx.Provider>;
}

export function SignOutButton() {
  return (
    <Button variant="outline" size="sm" onClick={async () => signOut(await getAuthInstance())}>
      <LogOut /> Đăng xuất
    </Button>
  );
}
