import { Fragment } from "react";
import { Flag, Play, SearchCheck, Share2, SkipForward, ThumbsUp } from "lucide-react";
import type { Post, Reaction } from "@/lib/content";
import { cn } from "@/lib/utils";

// Thẻ bài đăng dùng chung cho trang chính, /bo-phieu và /trinh-chieu.
// Tách riêng (không kèm Kính Tỉnh, hiệu ứng) để các trang nhẹ chỉ tải đúng phần này.

export const REACTION_ICON: Record<Reaction, React.ComponentType<{ className?: string }>> = {
  like: ThumbsUp,
  share: Share2,
  verify: SearchCheck,
  report: Flag,
  skip: SkipForward,
};

/** Tách đoạn văn thành các mảnh thường / mảnh được đánh dấu theo `flags`. */
function splitFlags(post: Post) {
  const parts: { text: string; flag?: Post["flags"][number] }[] = [];
  let rest = post.text;
  while (rest) {
    let first: { idx: number; flag: Post["flags"][number] } | null = null;
    for (const f of post.flags) {
      const idx = rest.indexOf(f.text);
      if (idx !== -1 && (!first || idx < first.idx)) first = { idx, flag: f };
    }
    if (!first) {
      parts.push({ text: rest });
      break;
    }
    if (first.idx > 0) parts.push({ text: rest.slice(0, first.idx) });
    parts.push({ text: first.flag.text, flag: first.flag });
    rest = rest.slice(first.idx + first.flag.text.length);
  }
  return parts;
}

/** Thân bài đăng, vẽ hai lần (ồn / sự thật) với cùng bố cục để Kính Tỉnh cắt khít. */
export function PostBody({ post, truth }: { post: Post; truth?: boolean }) {
  const parts = splitFlags(post);
  const text = (
    <p className="leading-[2.15]">
      {parts.map((p, i) =>
        p.flag && truth ? (
          <mark
            key={i}
            className={cn(
              "relative rounded-[3px] text-ink underline decoration-2 underline-offset-4",
              p.flag.tone === "bad" ? "bg-alarm/15 decoration-alarm decoration-wavy" : "bg-good/15 decoration-good",
            )}
          >
            {p.text}
            <span
              className={cn(
                "absolute -top-[1.2rem] left-0 rounded px-1 py-px font-mono text-xs leading-tight font-bold whitespace-nowrap text-white no-underline",
                p.flag.tone === "bad" ? "bg-alarm" : "bg-good",
              )}
            >
              {p.flag.tone === "bad" ? "⚑ " : "✓ "}
              {p.flag.note}
            </span>
          </mark>
        ) : (
          <Fragment key={i}>{p.text}</Fragment>
        ),
      )}
    </p>
  );

  return (
    <div className={cn("h-full", truth ? "bg-[#F7FBDD]" : "bg-white")}>
      <div className="flex items-center gap-2.5 px-4 pt-4">
        <span
          className="grid size-10 shrink-0 place-items-center rounded-full font-mono text-sm font-bold"
          style={{ background: post.color }}
        >
          {post.initials}
        </span>
        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate text-[0.95rem] font-semibold">{post.name}</p>
          <p className="text-xs text-muted-ink">{post.meta}</p>
        </div>
        {truth && (
          <span className="rounded-full bg-ink px-2 py-1 font-mono text-xs font-bold tracking-wider text-lime">
            BẢN CHẤT
          </span>
        )}
      </div>

      {post.kind === "dm" ? (
        <div className="mx-4 my-3 rounded-xl bg-paper/70 p-3">
          <div className="max-w-[92%] rounded-2xl rounded-bl-sm border border-ink/15 bg-white px-3 py-1.5">{text}</div>
          <p className="mt-1.5 text-xs text-muted-ink">Người này không có trong danh sách bạn bè của bạn</p>
        </div>
      ) : (
        <div className="px-4 pt-3 pb-3">{text}</div>
      )}

      {post.media && (
        <div className="relative mx-4 mb-3 grid aspect-video place-items-center overflow-hidden rounded-xl bg-[repeating-linear-gradient(45deg,#2a2526_0_14px,#332d2e_14px_28px)] text-white">
          <span
            className={cn(
              "absolute top-2.5 left-2.5 rounded px-1.5 py-1 font-mono text-xs font-bold",
              post.media.live ? "bg-alarm" : "bg-black/60",
            )}
          >
            {post.media.live && "● "}
            {post.media.label}
          </span>
          <span className="grid size-14 place-items-center rounded-full bg-white/90 text-ink">
            <Play className="ml-0.5 size-6 fill-ink" />
          </span>
          <span
            className={cn(
              "absolute inset-x-2.5 bottom-2.5 text-sm font-bold",
              truth && "rounded bg-lime px-2 py-1 font-mono text-xs text-ink",
            )}
          >
            {truth ? post.media.caption : "Xem đến cuối!!!"}
          </span>
        </div>
      )}

      <div className="flex justify-between border-t border-ink/10 px-4 py-2.5 text-xs text-muted-ink">
        {post.stats ? (
          <>
            <span className="inline-flex items-center gap-1">
              <ThumbsUp className="size-3" /> {post.stats[0]}
            </span>
            <span>
              {post.stats[1]} · {post.stats[2]}
            </span>
          </>
        ) : (
          <span>Tin nhắn</span>
        )}
      </div>
    </div>
  );
}
