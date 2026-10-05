"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

/**
 * Hiệu ứng toàn trang, gắn một lần ở trang chính:
 * - Lenis: cuộn mượt có quán tính (con lăn chuột); cảm ứng giữ cuộn gốc.
 * - [data-reveal="words"]: tiêu đề trồi lên từng chữ khi cuộn tới ("tỉnh dần").
 * - [data-reveal="stagger"]: các con lần lượt hiện ra (trang báo "in" từng dòng).
 * Chỉ gắn data-reveal cho chữ cố định trong code (không phải chữ lấy từ Firebase),
 * vì SplitText sửa DOM của phần tử. Tất cả tắt khi bật "giảm chuyển động".
 */
export function MotionFx() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ anchors: { offset: -64 }, lerp: 0.12 });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
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
    return () => mm.revert();
  });

  return null;
}
