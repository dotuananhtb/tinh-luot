"use client";

import { Church, Globe2, HandHeart, Landmark, Users } from "lucide-react";
import { useContent } from "@/components/content-provider";
import { SectionHeading } from "@/components/shared/section-heading";

const TRAIT_ICONS = [Church, HandHeart, Users, Landmark, Globe2];

/** Sau bảng tin ồn ào là một trang báo in: chậm, có nguồn, có cột. */
export function VietnamSection() {
  const { traits: TRAITS, policies: POLICIES, timeline: TIMELINE } = useContent();
  return (
    <section id="viet-nam" className="border-t-2 border-ink py-20">
      <div className="mx-auto max-w-5xl px-4">
        <SectionHeading index={5} kicker="Tôn giáo ở Việt Nam" title="Tắt bảng tin. Mở trang báo." />

        <article className="rounded-sm border-2 border-ink bg-[#FBFAF6] p-5 shadow-[10px_10px_0_var(--ink)] md:p-8">
          {/* măng-sét */}
          <header className="border-b-4 border-double border-ink pb-3 text-center">
            <p className="font-mono text-xs font-bold tracking-[0.12em] text-muted-ink sm:tracking-[0.3em]">SỐ ĐẶC BIỆT · BẢN TIN TỈNH TÁO</p>
            <p className="mt-1 font-mono text-[clamp(1.6rem,6vw,3.2rem)] leading-none font-extrabold tracking-tight">
              TÔN GIÁO Ở VIỆT NAM
            </p>
            <p className="mt-2 flex justify-between border-t border-ink pt-1.5 font-mono text-xs font-bold">
              <span>5 ĐẶC ĐIỂM</span>
              <span>5 CHÍNH SÁCH</span>
              <span>4 MỐC PHÁP LÝ</span>
            </p>
          </header>

          <div className="mt-6 grid gap-8 md:grid-cols-[1.4fr_1fr]">
            <div>
              <h3 className="font-mono text-xl font-extrabold">Đa dạng, hòa bình, đồng hành cùng dân tộc</h3>
              <ol className="mt-4 divide-y divide-ink/15 border-y border-ink/15">
                {TRAITS.map((t, i) => {
                  const Icon = TRAIT_ICONS[i];
                  return (
                    <li key={t} className="flex items-center gap-4 py-3.5">
                      <span className="grid size-11 shrink-0 place-items-center rounded-lg border-2 border-ink bg-lime">
                        <Icon className="size-5" />
                      </span>
                      <p className="font-medium">{t}</p>
                    </li>
                  );
                })}
              </ol>
            </div>

            <aside className="rounded-sm bg-ink p-5 text-paper">
              <p className="font-mono text-xs font-bold tracking-widest text-lime">CHÍNH SÁCH CỦA ĐẢNG, NHÀ NƯỚC</p>
              <ol className="mt-3 space-y-3">
                {POLICIES.map((p, i) => (
                  <li key={p} className="flex gap-3">
                    <span className="font-mono text-2xl leading-none font-extrabold text-lime">{String(i + 1).padStart(2, "0")}</span>
                    <p className="text-sm leading-snug">{p}</p>
                  </li>
                ))}
              </ol>
            </aside>
          </div>

          <div className="mt-8 border-t-2 border-ink pt-5">
            <p className="font-mono text-xs font-bold tracking-widest">DÒNG THỜI GIAN</p>
            <ol className="relative mt-5 grid gap-5 pl-7 md:grid-cols-4 md:pt-7 md:pl-0">
              <span aria-hidden className="absolute top-1 bottom-1 left-[7px] w-[3px] bg-ink md:top-[7px] md:right-2 md:bottom-auto md:left-2 md:h-[3px] md:w-auto" />
              {TIMELINE.map((t) => (
                <li key={t.year} className="relative">
                  <span
                    aria-hidden
                    className="absolute top-1 -left-7 size-[17px] rounded-full border-[3px] border-ink bg-lime md:-top-7 md:left-0"
                  />
                  <p className="font-mono text-2xl font-extrabold">{t.year}</p>
                  <p className="text-sm">{t.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </article>
      </div>
    </section>
  );
}
