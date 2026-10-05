"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";

const COARSE = "(pointer: coarse)";
const subscribeCoarse = (cb: () => void) => {
  const mq = window.matchMedia(COARSE);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

/**
 * Kính Tỉnh: một thấu kính tròn cố định trên viewport. Mỗi "lớp sự thật" đăng ký với provider;
 * provider tính toạ độ kính theo hệ toạ độ riêng của từng lớp (--lx/--ly) để clip-path cắt đúng chỗ.
 * Vị trí cập nhật thẳng vào style (không re-render React) để chạy mượt 60fps.
 */
type LensCtx = {
  register: (el: HTMLElement) => () => void;
  full: boolean;
  setFull: (v: boolean) => void;
  visible: boolean;
  coarse: boolean;
  lensRef: React.RefObject<HTMLDivElement | null>;
  startDrag: (e: React.PointerEvent) => void;
};

const Ctx = createContext<LensCtx | null>(null);

export function useLens() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useLens must be used inside <LensProvider>");
  return ctx;
}

export function LensProvider({ children }: { children: React.ReactNode }) {
  const layers = useRef(new Set<HTMLElement>());
  const inView = useRef(new Set<Element>());
  const pos = useRef({ x: -9999, y: -9999 });
  const lensRef = useRef<HTMLDivElement | null>(null);
  const frame = useRef(0);
  const [full, setFull] = useState(false);
  const [visible, setVisible] = useState(false);
  const coarse = useSyncExternalStore(subscribeCoarse, () => window.matchMedia(COARSE).matches, () => false);

  const paint = useCallback(() => {
    frame.current = 0;
    const { x, y } = pos.current;
    if (lensRef.current) lensRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    for (const el of layers.current) {
      if (!inView.current.has(el)) continue;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--lx", `${x - r.left}px`);
      el.style.setProperty("--ly", `${y - r.top}px`);
    }
  }, []);

  const schedule = useCallback(() => {
    if (!frame.current) frame.current = requestAnimationFrame(paint);
  }, [paint]);

  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observer.current = new IntersectionObserver((entries) => {
      for (const en of entries) {
        if (en.isIntersecting) inView.current.add(en.target);
        else inView.current.delete(en.target);
      }
      setVisible(inView.current.size > 0);
      schedule();
    });
    layers.current.forEach((el) => observer.current!.observe(el));
    return () => observer.current?.disconnect();
  }, [schedule]);

  useEffect(() => {
    // Vị trí khởi đầu: giữa màn hình, hơi lệch lên trên.
    pos.current = { x: window.innerWidth / 2, y: window.innerHeight * 0.46 };
    schedule();

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pos.current = { x: e.clientX, y: e.clientY };
      schedule();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [schedule]);

  // Kéo kính trên màn hình cảm ứng (qua tay cầm, để phần kính không chặn thao tác bên dưới).
  const startDrag = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      const target = e.currentTarget as HTMLElement;
      target.setPointerCapture(e.pointerId);
      const offset = { x: pos.current.x - e.clientX, y: pos.current.y - e.clientY };
      const move = (ev: PointerEvent) => {
        pos.current = {
          x: Math.min(window.innerWidth - 24, Math.max(24, ev.clientX + offset.x)),
          y: Math.min(window.innerHeight - 24, Math.max(60, ev.clientY + offset.y)),
        };
        schedule();
      };
      const up = () => {
        target.removeEventListener("pointermove", move);
        target.removeEventListener("pointerup", up);
        target.removeEventListener("pointercancel", up);
      };
      target.addEventListener("pointermove", move);
      target.addEventListener("pointerup", up);
      target.addEventListener("pointercancel", up);
    },
    [schedule],
  );

  const register = useCallback(
    (el: HTMLElement) => {
      layers.current.add(el);
      observer.current?.observe(el);
      schedule();
      return () => {
        layers.current.delete(el);
        inView.current.delete(el);
        observer.current?.unobserve(el);
      };
    },
    [schedule],
  );

  useEffect(() => {
    document.documentElement.dataset.lensFull = full ? "true" : "false";
  }, [full]);

  const value = useMemo(
    () => ({ register, full, setFull, visible, coarse, lensRef, startDrag }),
    [register, full, visible, coarse, startDrag],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
