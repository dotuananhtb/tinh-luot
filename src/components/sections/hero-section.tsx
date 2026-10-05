"use client";

import { ArrowDown, ScanEye } from "lucide-react";
import { SLOGAN } from "@/lib/content";
import { buttonVariants } from "@/components/ui/button";
import { TwoLayer } from "@/components/lens/two-layer";
import { useLens } from "@/components/lens/lens-provider";
import { NoiseMarquee } from "@/components/shared/noise-marquee";

export function HeroSection() {
  const { coarse, setFull } = useLens();

  return (
    <section id="mo-dau" className="relative">
      <TwoLayer
        className="min-h-[calc(100dvh-54px)]"
        noise={
          <div className="relative h-full min-h-[calc(100dvh-54px)] bg-paper">
            <NoiseMarquee rows={7} className="absolute inset-0" />
            <div className="absolute inset-0 grid place-items-center px-4">
              <div className="-rotate-3 animate-jitter rounded-lg border-4 border-ink bg-alarm px-5 py-4 text-center text-white shadow-[8px_8px_0_var(--ink)]">
                <p className="font-display text-[clamp(2rem,8vw,5rem)] leading-none uppercase">
                  Tôn giáo do thần linh tạo ra?!!
                </p>
                <p className="mt-2 font-display text-[clamp(1rem,3vw,1.6rem)] tracking-wide text-lime uppercase">
                  Xem ngay kẻo bị xóa
                </p>
              </div>
            </div>
          </div>
        }
        truth={
          <div className="grid h-full min-h-[calc(100dvh-54px)] place-items-center bg-lime px-4 py-24 text-center">
            <div className="max-w-3xl">
              <p className="mb-7 inline-block border-2 border-ink bg-white px-3 py-1 font-mono text-sm font-extrabold tracking-[0.25em]">
                TỈNH LƯỚT
              </p>
              <h1 className="font-mono text-[clamp(1.9rem,6.4vw,4rem)] leading-[1.08] font-extrabold tracking-tight text-balance">
                Tôn giáo từ đâu mà có – do thần linh hay do con người tạo ra?
              </h1>
              <p className="mx-auto mt-6 max-w-xl text-lg">
                Mỗi ngày bạn lướt qua bao nhiêu nội dung về tôn giáo? Bạn có chắc mình đã phản ứng đúng?
              </p>
              <p className="mt-6 font-mono text-sm font-bold">{SLOGAN}</p>
            </div>
          </div>
        }
      />

      {/* Lớp điều khiển nằm trên cả hai lớp, luôn bấm được. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col items-center gap-3 px-4 pb-6">
        <p className="pointer-events-auto rounded-full border-2 border-ink bg-white px-4 py-2 text-center font-mono text-xs font-bold">
          {coarse ? "Kéo Kính Tỉnh hoặc cuộn trang để soi bản chất dưới hiện tượng" : "Di chuột để soi bản chất bên dưới hiện tượng"}
        </p>
        <div className="pointer-events-auto flex flex-wrap justify-center gap-3">
          <a href="#cau-noi" className={buttonVariants({ size: "lg" })}>
            Bắt đầu lướt <ArrowDown />
          </a>
          <button type="button" onClick={() => setFull(true)} className={buttonVariants({ variant: "outline", size: "lg" })}>
            <ScanEye /> Soi toàn trang
          </button>
        </div>
      </div>
    </section>
  );
}
