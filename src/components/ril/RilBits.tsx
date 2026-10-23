import { cn } from "@/lib/utils";
import { LEVELS, type Domain } from "@/lib/ril";
import { Leaf, Users, Briefcase } from "lucide-react";

export const levelColor = (n: number) => `var(--ril-${Math.max(1, Math.min(9, n))})`;
export const domainColor: Record<Domain, string> = { ecology: "var(--env)", society: "var(--soc)", economy: "var(--eco)" };
export const DomainIcon = { ecology: Leaf, society: Users, economy: Briefcase };

export function RilBadge({ level, asterisk, size = "md" }: { level: number; asterisk?: boolean; size?: "sm" | "md" | "lg" }) {
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-2xl font-display font-bold text-primary-foreground shadow-sm",
        size === "sm" && "h-10 min-w-10 px-2 text-lg",
        size === "md" && "h-16 min-w-16 px-3 text-3xl",
        size === "lg" && "h-36 min-w-36 px-6 text-7xl",
      )}
      style={{ backgroundColor: levelColor(level) }}
    >
      {level}
      {asterisk && "*"}
    </div>
  );
}

export function RilLadder({ active, onSelect, selected }: { active?: number; selected?: number; onSelect?: (n: number) => void }) {
  return (
    <div className="flex flex-col-reverse gap-1.5">
      {LEVELS.map((l) => (
        <div key={l.level}>
          {l.level === 5 && (
            <div className="mb-1.5 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <span className="flex-1 border-t-2 border-dashed border-muted-foreground/50" />
              ↑ Netto regenerativt · Netto skade ↓
              <span className="flex-1 border-t-2 border-dashed border-muted-foreground/50" />
            </div>
          )}
          <button
            type="button"
            onClick={() => onSelect?.(l.level)}
            className={cn(
              "group flex w-full items-center gap-3 rounded-xl border bg-card px-3 py-2 text-left transition hover:translate-x-1",
              (active === l.level || selected === l.level) && "ring-2 ring-offset-2 ring-offset-background",
            )}
            style={{ ["--tw-ring-color" as string]: levelColor(l.level) }}
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-display font-bold text-primary-foreground" style={{ backgroundColor: levelColor(l.level) }}>
              {l.level}
            </span>
            <span className="flex-1">
              <span className="block text-sm font-semibold">{l.name}</span>
              <span className="block text-xs text-muted-foreground">{l.short}</span>
            </span>
            {active === l.level && <span className="text-xs font-bold" style={{ color: levelColor(l.level) }}>◀ Dere er her</span>}
          </button>
        </div>
      ))}
    </div>
  );
}
