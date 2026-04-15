import { Card, CardContent } from '@/components/ui/card';

interface MetricCardProps {
  label: string;
  value: string | number;
  change?: string;
  icon?: React.ReactNode;
}

export function MetricCard({ label, value, change, icon }: MetricCardProps) {
  return (
    <Card className="rounded-[14px]">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1.5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
              {label}
            </p>
            <p className="text-[32px] font-black tracking-[-0.04em] text-foreground leading-none">
              {value}
            </p>
            {change && (
              <p className="text-xs text-primary">{change}</p>
            )}
          </div>
          {icon && (
            <div className="text-muted-foreground/60">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
