"use client";

import { GripHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLens } from "./lens-provider";

/** Vòng kính hiển thị. Chỉ hiện khi có "lớp sự thật" trong khung nhìn. */
export function Lens() {
  const { lensRef, visible, full, coarse, startDrag } = useLens();

  return (
    <div
      ref={lensRef}
      aria-hidden={!coarse}
      className={cn(
        "pointer-events-none fixed top-0 left-0 z-40 transition-opacity duration-300",
        visible && !full ? "opacity-100" : "opacity-0",
      )}
      style={{ transform: "translate3d(-9999px,-9999px,0)" }}
    >
      <div
        className="absolute rounded-full"
        style={{
          width: "calc(var(--lr) * 2)",
          height: "calc(var(--lr) * 2)",
          left: "calc(var(--lr) * -1)",
          top: "calc(var(--lr) * -1)",
          boxShadow: "0 0 0 3px var(--ink), 0 0 0 9px var(--lime), 0 0 0 11px var(--ink), 0 18px 40px -8px rgb(30 26 27 / 0.45)",
        }}
      >
        {/* vạch chia độ */}
        {[0, 90, 180, 270].map((deg) => (
          <span
            key={deg}
            className="absolute top-1/2 left-1/2 h-[3px] w-3 -translate-y-1/2 bg-ink"
            style={{ transform: `rotate(${deg}deg) translateX(calc(var(--lr) - 12px))`, transformOrigin: "0 50%" }}
          />
        ))}
      </div>
      <button
        type="button"
        onPointerDown={startDrag}
        className={cn(
          "absolute left-0 flex -translate-x-1/2 touch-none whitespace-nowrap items-center gap-1.5 rounded-full border-2 border-ink bg-ink px-3 py-1.5 font-mono text-[11px] font-bold tracking-wider text-lime select-none",
          coarse ? "pointer-events-auto cursor-grab" : "",
        )}
        style={{ top: "calc(var(--lr) + 16px)" }}
        tabIndex={-1}
        aria-label="Kéo để di chuyển Kính Tỉnh"
      >
        {coarse && <GripHorizontal className="size-3.5" />}
        KÍNH TỈNH
      </button>
    </div>
  );
}
