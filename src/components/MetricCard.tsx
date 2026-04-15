import { Card, CardContent } from '@/components/ui/card';

interface MetricCardProps {
  label: string;
  value: string | number;
  change?: string;
  icon?: React.ReactNode;
}

export function MetricCard({ label, value, change, icon }: MetricCardProps) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1.5">
            <p className="text-metadata text-muted-foreground">
              {label}
            </p>
            <p className="text-kpi text-foreground">
              {value}
            </p>
            {change && (
              <p className="text-xs text-primary">{change}</p>
            )}
          </div>
          {icon && (
            <div className="text-muted-foreground/40">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
