"use client";

import { useEffect } from "react";
import "lenis/dist/lenis.css";

/**
 * Hiệu ứng toàn trang, gắn một lần ở trang chính:
 * - Lenis: cuộn mượt có quán tính (con lăn chuột); cảm ứng giữ cuộn gốc.
 * - [data-reveal="words"]: tiêu đề trồi lên từng chữ khi cuộn tới ("tỉnh dần").
 * - [data-reveal="stagger"]: các con lần lượt hiện ra (trang báo "in" từng dòng).
 * Chỉ gắn data-reveal cho chữ cố định trong code (không phải chữ lấy từ Firebase),
 * vì SplitText sửa DOM của phần tử. Tắt hết khi bật "giảm chuyển động".
 * GSAP + Lenis được tải sau khi trang đã hiện, không nằm trong lượt tải đầu.
 */
export function MotionFx() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cancelled = false;
    let cleanup = () => {};

    (async () => {
      const [{ default: gsap }, { ScrollTrigger }, { SplitText }, { default: Lenis }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
        import("gsap/SplitText"),
        import("lenis"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger, SplitText);

      const lenis = new Lenis({ anchors: { offset: -64 }, lerp: 0.12 });
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      const ctx = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>('[data-reveal="words"]').forEach((el) => {
          SplitText.create(el, {
            type: "words",
            mask: "words",
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self.words, {
                yPercent: 110,
                duration: 0.75,
                ease: "power3.out",
                stagger: 0.045,
                scrollTrigger: { trigger: el, start: "top 88%", once: true },
              }),
          });
        });
        gsap.utils.toArray<HTMLElement>('[data-reveal="stagger"]').forEach((el) => {
          gsap.from(el.children, {
            y: 22,
            opacity: 0,
            duration: 0.55,
            ease: "power2.out",
            stagger: 0.08,
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          });
        });
      });

      cleanup = () => {
        ctx.revert(); // gỡ hết animation + trả lại DOM gốc của SplitText
        gsap.ticker.remove(tick);
        lenis.destroy();
      };
    })();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  return null;
}
