import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

interface PriorityCardProps {
  title: string;
  description: string;
  brand: string;
  brandAccent: string;
  action?: string;
  onClick?: () => void;
}

export function PriorityCard({ title, description, brand, brandAccent, action, onClick }: PriorityCardProps) {
  return (
    <Card
      className="border-border/50 bg-card/40 cursor-pointer transition-all duration-200 hover:border-primary/30 hover:bg-accent/30"
      onClick={onClick}
    >
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: brandAccent }}
          />
          <span className="text-xs font-medium text-muted-foreground">{brand}</span>
        </div>
        <h3 className="text-sm font-medium text-foreground mb-1.5">{title}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
        {action && (
          <div className="mt-3 flex items-center gap-1 text-xs font-medium text-primary">
            {action}
            <ArrowRight className="h-3 w-3" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
