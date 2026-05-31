import { UrgencyInfo } from "../types/actionCenter";

interface UrgencyBadgeProps {
  urgency: UrgencyInfo;
}

const classNamesByLevel: Record<UrgencyInfo["level"], string> = {
  low: "bg-emerald-100 text-emerald-900 ring-emerald-200",
  medium: "bg-amber-100 text-amber-950 ring-amber-200",
  high: "bg-orange-100 text-orange-950 ring-orange-200",
  urgent: "bg-rose-100 text-rose-950 ring-rose-200",
};

export function UrgencyBadge({ urgency }: UrgencyBadgeProps) {
  return (
    <div className={`inline-flex flex-col rounded-2xl px-4 py-3 ring-1 ${classNamesByLevel[urgency.level]}`}>
      <span className="text-xs font-semibold uppercase tracking-[0.22em]">Urgency</span>
      <span className="mt-1 text-lg font-semibold">{urgency.label}</span>
      <span className="mt-1 text-sm leading-5 opacity-80">{urgency.note}</span>
    </div>
  );
}
