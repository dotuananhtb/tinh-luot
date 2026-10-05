"use client";

import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signInAnonymously, type User } from "firebase/auth";
import { getDatabase, onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { firebaseConfig } from "./firebase-config";

// Khởi tạo lười, chỉ ở client (static export không chạy được SDK lúc build).
function app() {
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}
export const db = () => getDatabase(app());
export const auth = () => getAuth(app());
export const dbRef = (path: string) => ref(db(), path);

/** Email → khóa hợp lệ của RTDB (dấu chấm không được phép trong khóa). */
export const emailKey = (email: string) => email.trim().toLowerCase().replaceAll(".", ",");

/** Người dùng hiện tại; `undefined` khi đang chờ Firebase trả lời. */
export function useUser() {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  useEffect(() => onAuthStateChanged(auth(), setUser), []);
  return user;
}

/** Bảo đảm có phiên ẩn danh (khán giả). Trả về uid, hoặc null nếu Firebase Auth chưa bật / mất mạng. */
export async function ensureAnonUid(): Promise<string | null> {
  try {
    const a = auth();
    if (a.currentUser) return a.currentUser.uid;
    const cred = await signInAnonymously(a);
    return cred.user.uid;
  } catch {
    return null;
  }
}

export type LiveValue<T> = { data: T | null; loading: boolean; error: boolean };

/** Đăng ký nghe một nhánh RTDB theo thời gian thực. `path = null` thì không nghe. */
export function useDbValue<T>(path: string | null): LiveValue<T> {
  // Ghi kèm path để khi path đổi, dữ liệu của path cũ không bị trả về như thể đã tải xong.
  const [state, setState] = useState<LiveValue<T> & { path: string | null }>({ path: null, data: null, loading: false, error: false });
  useEffect(() => {
    if (!path) return;
    return onValue(
      dbRef(path),
      (snap) => setState({ path, data: (snap.val() as T) ?? null, loading: false, error: false }),
      () => setState({ path, data: null, loading: false, error: true }),
    );
  }, [path]);
  if (!path) return { data: null, loading: false, error: false };
  if (state.path !== path) return { data: null, loading: true, error: false };
  return state;
}
