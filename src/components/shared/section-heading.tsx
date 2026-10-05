import { cn } from "@/lib/utils";

export function SectionHeading({
  index,
  kicker,
  title,
  lead,
  className,
}: {
  index: number;
  kicker: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("mb-8 md:mb-10", className)}>
      <div className="mb-4 flex items-center gap-3 font-mono text-xs font-bold tracking-widest uppercase">
        <span className="grid size-8 place-items-center rounded-full bg-ink text-lime">{index}</span>
        <span>{kicker}</span>
        <span className="h-0.5 flex-1 bg-ink/15" />
      </div>
      <h2 className="font-mono text-[clamp(1.75rem,5.5vw,3rem)] leading-[1.08] font-extrabold tracking-tight text-balance">
        {title}
      </h2>
      {lead && <p className="mt-3 max-w-[60ch] text-muted-ink">{lead}</p>}
    </header>
  );
}
