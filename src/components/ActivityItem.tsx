import type { ActivityEntry } from '@/data/activity';
import { getBrandAccent } from '@/data/brands';

const TYPE_COLORS: Record<string, string> = {
  acq: 'text-primary',
  ret: 'text-brand-blue',
  lore: 'text-brand-gold',
  intel: 'text-muted-foreground',
  content: 'text-foreground',
  crm: 'text-brand-gold',
};

export function ActivityItem({ entry }: { entry: ActivityEntry }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-border/30 last:border-0">
      <span
        className="mt-1.5 h-2 w-2 rounded-full shrink-0"
        style={{ backgroundColor: getBrandAccent(entry.brand) }}
      />
      <div className="min-w-0 flex-1">
        <p className="text-sm text-foreground leading-relaxed">{entry.text}</p>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{entry.brand}</span>
          <span className="text-muted-foreground/30">·</span>
          <span className="text-xs text-muted-foreground">{entry.time}</span>
        </div>
      </div>
    </div>
  );
}
