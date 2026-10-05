"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "motion/react";
import { BellOff, Download, ExternalLink } from "lucide-react";
import { BLOOKET_URL, PLEDGES, SLOGAN } from "@/lib/content";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionHeading } from "@/components/shared/section-heading";
import { NoiseMarquee } from "@/components/shared/noise-marquee";
import { drawCertificate, certificateFileName } from "@/lib/certificate";
import { addToWall, getServerWall, getWall, subscribeWall } from "@/lib/pledge-wall";

export function PledgeSection({
  offs,
  onToggle,
  score,
  played,
}: {
  offs: boolean[];
  onToggle: (i: number) => void;
  score: number;
  played: boolean;
}) {
  const remaining = offs.filter((o) => !o).length;
  const allOff = remaining === 0;
  const [name, setName] = useState("");
  const wall = useSyncExternalStore(subscribeWall, getWall, getServerWall);
  const [me, setMe] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (me && canvasRef.current) drawCertificate(canvasRef.current, { name: me, score: played ? score : null });
  }, [me, score, played]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = name.trim().replace(/\s+/g, " ");
    if (!clean) return;
    addToWall({ name: clean, score: played ? score : null, t: Date.now() });
    setMe(clean);
    setName("");
  };

  const download = () => {
    if (!canvasRef.current || !me) return;
    const a = document.createElement("a");
    a.download = certificateFileName(me);
    a.href = canvasRef.current.toDataURL("image/png");
    a.click();
  };

  return (
    <section id="cam-ket" className="relative overflow-hidden border-t-2 border-ink py-20">
      {/* tiếng ồn nền: dịu dần theo mỗi công tắc được tắt */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-[opacity,filter] duration-700"
        style={{ opacity: (remaining / PLEDGES.length) * 0.55, filter: `blur(${(PLEDGES.length - remaining) * 1.5}px)` }}
      >
        <NoiseMarquee rows={9} />
      </div>

      <div className="relative mx-auto max-w-5xl px-4">
        <div className="rounded-2xl bg-paper/90 p-1 backdrop-blur-sm">
          <SectionHeading
            index={6}
            kicker="Cam kết 5 không"
            title={allOff ? <>Yên tĩnh rồi. Giờ là lời cam kết.</> : <>Tắt 5 thói quen đang làm trang này ồn ào.</>}
            lead="Mỗi công tắc là một phản xạ khi lướt. Tắt nó đi là một lời cam kết, và trang sẽ dịu bớt."
            className="mb-0"
          />
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          {/* bảng "cài đặt thông báo" */}
          <div className="overflow-hidden rounded-3xl border-2 border-ink bg-white shadow-[8px_8px_0_var(--ink)]">
            <div className="flex items-center justify-between border-b-2 border-ink bg-ink px-5 py-3 font-mono text-xs font-bold text-paper">
              <span>CÀI ĐẶT · THÓI QUEN KHI LƯỚT</span>
              <span className="text-lime">{PLEDGES.length - remaining}/5 TẮT</span>
            </div>
            <ul>
              {PLEDGES.map((p, i) => (
                <li key={p.on} className="border-b border-ink/10 last:border-b-0">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={!offs[i]}
                    onClick={() => onToggle(i)}
                    className="flex min-h-16 w-full cursor-pointer items-center gap-4 px-5 py-3 text-left transition-colors hover:bg-paper/60"
                  >
                    <span className="min-w-0 flex-1">
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.span
                          key={offs[i] ? "off" : "on"}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.18 }}
                          className={cn("block font-mono font-bold", offs[i] ? "text-ink" : "text-alarm")}
                        >
                          {offs[i] ? p.off : p.on}
                        </motion.span>
                      </AnimatePresence>
                      <span className="text-xs text-muted-ink">{offs[i] ? "Đã cam kết" : "Đang bật"}</span>
                    </span>
                    <span
                      className={cn(
                        "relative h-8 w-14 shrink-0 rounded-full border-2 border-ink transition-colors duration-200",
                        offs[i] ? "bg-paper" : "bg-alarm",
                      )}
                    >
                      <motion.span
                        layout
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className={cn(
                          "absolute top-0.5 size-6 rounded-full border-2 border-ink bg-white",
                          offs[i] ? "left-0.5" : "right-0.5",
                        )}
                      />
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* ký tên + bức tường */}
          <div>
            <form onSubmit={submit} className={cn("transition-opacity", !allOff && "pointer-events-none opacity-40")}>
              <label htmlFor="pledge-name" className="font-mono text-sm font-bold">
                {allOff ? "Ký tên để cam kết" : "Tắt hết 5 công tắc để ký tên"}
              </label>
              <div className="mt-2 flex flex-wrap gap-3">
                <Input
                  id="pledge-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={40}
                  disabled={!allOff}
                  placeholder="Tên của bạn"
                  autoComplete="name"
                  className="h-11 min-w-0 flex-[1_1_200px] rounded-full border-2 bg-white px-5 text-base"
                />
                <Button type="submit" disabled={!allOff || !name.trim()}>
                  <BellOff /> Tôi cam kết
                </Button>
              </div>
            </form>

            <div className="mt-8 flex flex-wrap items-baseline gap-3 font-mono font-bold">
              Đã có
              <span className="border-2 border-ink bg-lime px-2 text-4xl tabular-nums">{wall.length}</span>
              sinh viên cam kết
            </div>
            <div className="mt-4 flex max-h-56 flex-wrap gap-1.5 overflow-y-auto">
              {wall.length === 0 && <p className="text-sm text-muted-ink">Hãy là người đầu tiên ký cam kết.</p>}
              {[...wall].reverse().map((w) => (
                <span
                  key={w.t}
                  className={cn(
                    "rounded-full border px-3 py-1 text-sm",
                    w.name === me ? "border-ink bg-lime font-bold" : "border-ink/20 bg-white",
                  )}
                >
                  {w.name}
                </span>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-ink">Bức tường cam kết được lưu trên trình duyệt của thiết bị này.</p>
          </div>
        </div>

        <AnimatePresence>
          {me && (
            <motion.div
              initial={{ opacity: 0, y: 30, rotate: -2 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="mt-12 flex flex-col items-center"
            >
              <canvas
                ref={canvasRef}
                width={1080}
                height={1920}
                aria-label={`Thẻ chứng nhận Người lướt tỉnh táo của ${me}`}
                className="h-auto w-[min(100%,320px)] rounded-xl border-2 border-ink shadow-[8px_8px_0_var(--ink)]"
              />
              <Button className="mt-6" onClick={download}>
                <Download /> Tải ảnh để đăng story
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <footer className="relative mx-auto mt-20 max-w-5xl px-4 text-center">
        <p className="font-mono text-[clamp(1.2rem,4vw,1.8rem)] leading-snug font-extrabold text-balance">{SLOGAN}</p>
        {BLOOKET_URL && (
          <a href={BLOOKET_URL} target="_blank" rel="noopener" className={cn(buttonVariants({ variant: "outline" }), "mt-6")}>
            Ôn tập 100 câu trên Blooket <ExternalLink />
          </a>
        )}
        <p className="mt-6 text-xs text-muted-ink">
          Sản phẩm sáng tạo · Chủ nghĩa xã hội khoa học · Vấn đề tôn giáo trong thời kỳ quá độ lên CNXH
        </p>
      </footer>
    </section>
  );
}
