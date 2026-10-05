import { cn } from "@/lib/utils";
import { NOISE_HEADLINES } from "@/lib/content";

/** Các hàng tiêu đề giật gân chạy ngang, xen kẽ chiều. Thuần trang trí (aria-hidden ở nơi dùng). */
export function NoiseMarquee({ rows = 7, className }: { rows?: number; className?: string }) {
  return (
    <div className={cn("flex h-full flex-col justify-between overflow-hidden py-2 select-none", className)}>
      {Array.from({ length: rows }, (_, r) => {
        const words = [...NOISE_HEADLINES.slice(r * 3), ...NOISE_HEADLINES.slice(0, r * 3)];
        const reverse = r % 2 === 1;
        return (
          <div
            key={r}
            className="flex w-max animate-marquee"
            style={{
              "--marquee-duration": `${26 + (r % 3) * 9}s`,
              animationDirection: reverse ? "reverse" : "normal",
            } as React.CSSProperties}
          >
            {[0, 1].map((dup) => (
              <div key={dup} className="flex shrink-0 items-center gap-6 pr-6">
                {words.map((w, i) => (
                  <span
                    key={i}
                    className={cn(
                      "font-display text-[clamp(2.4rem,9vw,6.5rem)] leading-[0.95] uppercase",
                      (i + r) % 3 === 0 ? "text-alarm" : (i + r) % 3 === 1 ? "text-ink" : "text-ink/25",
                      (i + r) % 5 === 0 && "rounded-md bg-alarm px-3 text-white",
                    )}
                  >
                    {w}
                  </span>
                ))}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
