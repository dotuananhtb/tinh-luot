"use client";

import { createContext, useContext, useState } from "react";
import { GoogleAuthProvider, signInWithPopup, signOut, type User } from "firebase/auth";
import { LogIn, LogOut, ShieldAlert } from "lucide-react";
import { auth, emailKey, useDbValue, useUser } from "@/lib/firebase";
import { Button } from "@/components/ui/button";

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

/** Chỉ cho vào khi đã đăng nhập Google bằng email có trong danh sách biên tập viên. */
export function EditorGate({ title, children }: { title: string; children: React.ReactNode }) {
  const user = useUser();
  const isGoogle = !!user && !user.isAnonymous && !!user.email;
  const role = useDbValue<Role>(isGoogle ? `editors/${emailKey(user.email!)}` : null);
  const [error, setError] = useState<string | null>(null);

  const login = async () => {
    setError(null);
    try {
      await signInWithPopup(auth(), new GoogleAuthProvider());
    } catch (e) {
      const code = (e as { code?: string }).code ?? "";
      setError(
        code.includes("operation-not-allowed") || code.includes("configuration-not-found")
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
        <p className="mb-5 text-sm text-muted-ink">
          Gửi email <b className="text-ink">{user.email}</b> cho trưởng nhóm để được thêm vào danh sách biên tập viên, rồi tải lại trang.
        </p>
        <Button variant="outline" onClick={() => signOut(auth())}>
          <LogOut /> Đăng xuất
        </Button>
      </Shell>
    );
  }

  return <Ctx.Provider value={{ user, role: role.data }}>{children}</Ctx.Provider>;
}

export function SignOutButton() {
  return (
    <Button variant="outline" size="sm" onClick={() => signOut(auth())}>
      <LogOut /> Đăng xuất
    </Button>
  );
}
