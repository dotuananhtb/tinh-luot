"use client";

import { useEffect, useState } from "react";
import { ScanEye } from "lucide-react";
import { cn } from "@/lib/utils";
import { STEPS } from "@/lib/content";
import { useLens } from "@/components/lens/lens-provider";

/** Thanh tiến độ 6 bước + đồng hồ "độ ồn" + công tắc soi toàn trang. */
export function ProgressBar({ noise }: { noise: number }) {
  const [active, setActive] = useState(0);
  const { full, setFull } = useLens();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY + window.innerHeight * 0.35;
      let idx = 0;
      STEPS.forEach((s, i) => {
        const el = document.getElementById(s.id);
        if (el && el.offsetTop <= y) idx = i;
      });
      setActive(idx);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav aria-label="Tiến độ" className="sticky top-0 z-50 border-b-2 border-ink bg-paper/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-2.5">
        <ol className="flex flex-1 gap-1">
          {STEPS.map((s, i) => (
            <li key={s.id} className="flex-1">
              <a
                href={`#${s.id}`}
                aria-current={i === active ? "step" : undefined}
                className={cn(
                  "block truncate font-mono text-[10px] font-bold uppercase transition-colors",
                  i === active ? "text-ink" : "text-muted-ink",
                )}
              >
                <span
                  className={cn(
                    "mb-1 block h-1.5 rounded-full border-[1.5px] transition-colors duration-300",
                    i < active && "border-ink bg-ink",
                    i === active && "border-ink bg-lime",
                    i > active && "border-transparent bg-ink/15",
                  )}
                />
                <span className="hidden sm:inline">
                  {i + 1}. {s.label}
                </span>
              </a>
            </li>
          ))}
        </ol>
        <div className="hidden items-center gap-2 font-mono text-[10px] font-bold md:flex" title="Độ ồn của trang">
          <span>ỒN</span>
          <span className="relative h-2 w-16 overflow-hidden rounded-full bg-ink/15">
            <span
              className="absolute inset-y-0 left-0 rounded-full bg-alarm transition-[width] duration-500"
              style={{ width: `${Math.round(noise * 100)}%` }}
            />
          </span>
          <span className="w-8 tabular-nums">{Math.round(noise * 100)}%</span>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={full}
          onClick={() => setFull(!full)}
          className={cn(
            "flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border-2 border-ink px-3 font-mono text-[11px] font-bold transition-colors",
            full ? "bg-ink text-lime" : "bg-white",
          )}
        >
          <ScanEye className="size-4" />
          <span className="hidden sm:inline">{full ? "Đang soi toàn trang" : "Soi toàn trang"}</span>
        </button>
      </div>
    </nav>
  );
}
