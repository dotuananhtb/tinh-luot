"use client";

import { Share2 } from "lucide-react";
import { MARX_QUOTE } from "@/lib/content";
import { TwoLayer } from "@/components/lens/two-layer";

/** Một câu bị cắt khỏi ngữ cảnh (hiện tượng) và đoạn đầy đủ (bản chất). Gọi tên phạm trù ngay sau đó. */
export function QuoteScene() {
  return (
    <div id="cau-noi" className="border-t-2 border-ink bg-ink py-20 text-paper">
      <div className="mx-auto max-w-4xl px-4">
        <p className="mb-6 text-center font-mono text-xs font-bold tracking-[0.25em] text-lime">
          CÂU NÓI ĐƯỢC CHIA SẺ NHIỀU NHẤT VỀ TÔN GIÁO
        </p>

        <TwoLayer
          className="overflow-hidden rounded-2xl border-2 border-paper"
          noise={
            <div className="flex h-full min-h-[22rem] flex-col justify-between bg-white p-5 text-ink md:p-8">
              <div className="flex items-center gap-2 text-sm">
                <span className="grid size-9 place-items-center rounded-full bg-alarm font-mono text-xs font-bold text-white">
                  TN
                </span>
                <span className="font-semibold">Trích dẫn hay mỗi ngày</span>
                <span className="text-muted-ink">· 2 phút</span>
              </div>
              <p className="my-6 animate-jitter font-display text-[clamp(2.2rem,8vw,4.8rem)] leading-[0.95] text-alarm uppercase">
                “{MARX_QUOTE.cut}!!!”
              </p>
              <div className="flex items-center justify-between text-sm text-muted-ink">
                <span className="font-bold text-ink">Thấy chưa, chính Mác nói đấy!</span>
                <span className="inline-flex items-center gap-1">
                  <Share2 className="size-4" /> 1,2 triệu lượt chia sẻ
                </span>
              </div>
            </div>
          }
          truth={
            <div className="flex h-full min-h-[22rem] flex-col justify-center gap-4 bg-lime p-5 text-ink md:p-8">
              <p className="font-mono text-[11px] font-bold tracking-widest">ĐOẠN ĐẦY ĐỦ</p>
              <blockquote className="space-y-3 font-mono text-[clamp(0.95rem,2.3vw,1.25rem)] leading-relaxed font-bold">
                {MARX_QUOTE.full.map((s) => (
                  <p key={s} className="text-ink/75">
                    {s}
                  </p>
                ))}
                <p className="text-ink">
                  <span className="bg-ink px-1 text-lime [box-decoration-break:clone]">{MARX_QUOTE.cut}.</span>
                </p>
              </blockquote>
              <p className="font-mono text-sm font-extrabold">— {MARX_QUOTE.author}</p>
              <p className="text-sm">
                Mạng xã hội chỉ giữ lại câu cuối. Phần bị cắt cho thấy tôn giáo là tiếng kêu của người đau khổ, không phải lời miệt thị người có đạo.
              </p>
            </div>
          }
        />

        <div className="mt-12 grid gap-8 md:grid-cols-[1.1fr_1fr] md:items-start">
          <div>
            <h2 className="font-mono text-[clamp(1.6rem,4.5vw,2.4rem)] leading-tight font-extrabold text-balance">
              Bạn vừa làm một thao tác <span className="bg-lime px-1 text-ink">triết học</span>.
            </h2>
            <p className="mt-4 leading-relaxed text-paper/85">
              Câu bị cắt là <b className="text-paper">hiện tượng</b>: cái bề ngoài, dễ thấy, lan nhanh. Đoạn đầy đủ là{" "}
              <b className="text-paper">bản chất</b>: cái bên trong, quyết định ý nghĩa thật. Hiện tượng biểu hiện bản chất
              nhưng không trùng khít với nó, nên nhận thức không được dừng lại ở hiện tượng.
            </p>
            <p className="mt-3 leading-relaxed text-paper/85">
              Muốn con người không còn cần đến “liều thuốc an ủi”, phải thay đổi chính hiện thực khổ đau đã sinh ra nhu cầu ấy.
            </p>
          </div>
          <ul className="space-y-2.5">
            {[
              { k: "Lớp ồn", v: "Hiện tượng", cls: "bg-alarm text-white" },
              { k: "Lớp vàng", v: "Bản chất", cls: "bg-lime text-ink" },
              { k: "Kính Tỉnh", v: "Tư duy biện chứng", cls: "bg-paper text-ink" },
            ].map((r) => (
              <li key={r.k} className="flex items-center justify-between gap-3 rounded-xl border-2 border-paper/20 p-3">
                <span className={`rounded-md px-2.5 py-1 font-mono text-xs font-bold ${r.cls}`}>{r.k}</span>
                <span className="font-mono font-bold">= {r.v}</span>
              </li>
            ))}
            <li className="pt-2 text-sm text-paper/70">
              Suốt hành trình, hãy dùng Kính Tỉnh: đi qua hiện tượng để nắm lấy bản chất.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
