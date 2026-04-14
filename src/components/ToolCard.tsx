import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Tool } from '@/data/tools';

interface ToolCardProps {
  tool: Tool;
  onClick: () => void;
  isActive?: boolean;
}

export function ToolCard({ tool, onClick, isActive }: ToolCardProps) {
  return (
    <Card
      className={`cursor-pointer border-border/50 transition-all duration-200 hover:border-primary/30 hover:bg-accent/40 ${
        isActive ? 'border-primary/50 bg-accent/60' : 'bg-card/40'
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <span className="text-xl shrink-0">{tool.icon}</span>
          <div className="min-w-0 space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium text-foreground truncate">
                {tool.name}
              </h3>
              {tool.badge && (
                <Badge
                  variant="outline"
                  className="text-[10px] px-1.5 py-0 border-primary/30 text-primary shrink-0"
                >
                  {tool.badge}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {tool.desc}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
