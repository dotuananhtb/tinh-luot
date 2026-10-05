"use client";

import confetti from "canvas-confetti";

// Pháo giấy theo màu nhận diện. Tự tắt khi người dùng bật "giảm chuyển động".
const COLORS = ["#E5FD54", "#1E1A1B", "#FFFFFF"];

const base = { colors: COLORS, disableForReducedMotion: true, zIndex: 70 } as const;

/** Bắn một cụm từ một điểm trên màn hình (toạ độ 0..1). */
export function burst(x = 0.5, y = 0.6, scale = 1) {
  confetti({ ...base, particleCount: Math.round(90 * scale), spread: 75, startVelocity: 42, origin: { x, y }, scalar: 0.9 });
}

/** Bắn từ phần tử vừa được bấm / vừa hoàn thành. */
export function burstFrom(el: Element | null, scale = 1) {
  if (!el) return burst(0.5, 0.6, scale);
  const r = el.getBoundingClientRect();
  burst((r.left + r.width / 2) / window.innerWidth, (r.top + r.height / 2) / window.innerHeight, scale);
}

/** Hai luồng pháo từ hai mép màn hình, dùng cho khoảnh khắc lớn (máy chiếu, ký cam kết). */
export function celebrateBig() {
  const end = Date.now() + 900;
  const frame = () => {
    confetti({ ...base, particleCount: 6, angle: 60, spread: 60, origin: { x: 0, y: 0.75 }, startVelocity: 55 });
    confetti({ ...base, particleCount: 6, angle: 120, spread: 60, origin: { x: 1, y: 0.75 }, startVelocity: 55 });
    if (Date.now() < end) requestAnimationFrame(frame);
  };
  frame();
}
