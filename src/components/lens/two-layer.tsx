"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useLens } from "./lens-provider";

/**
 * Hai lớp chồng khít nhau: `noise` (lớp ồn, chỉ để nhìn) và `truth` (lớp sự thật).
 * Lớp sự thật nằm trên, bị cắt thành hình tròn theo vị trí Kính Tỉnh. Trình đọc màn hình
 * chỉ đọc lớp sự thật.
 */
export function TwoLayer({
  noise,
  truth,
  className,
  truthClassName,
}: {
  noise: React.ReactNode;
  truth: React.ReactNode;
  className?: string;
  truthClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { register } = useLens();

  useEffect(() => (ref.current ? register(ref.current) : undefined), [register]);

  return (
    <div ref={ref} className={cn("relative grid", className)}>
      <div aria-hidden className="col-start-1 row-start-1">
        {noise}
      </div>
      <div className={cn("lens-truth relative z-10 col-start-1 row-start-1", truthClassName)}>{truth}</div>
    </div>
  );
}
