"use client";

import { useEffect } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";

/** Số chạy lên/xuống tới `value` thay vì nhảy (điểm, bộ đếm cam kết). */
export function CountUp({ value, className }: { value: number; className?: string }) {
  const reduce = useReducedMotion();
  const mv = useMotionValue(value);
  const rounded = useTransform(mv, (v) => Math.round(v).toString());

  useEffect(() => {
    if (reduce) {
      mv.set(value);
      return;
    }
    const a = animate(mv, value, { duration: 0.8, ease: [0.16, 1, 0.3, 1] });
    return () => a.stop();
  }, [value, reduce, mv]);

  return <motion.span className={className}>{rounded}</motion.span>;
}
