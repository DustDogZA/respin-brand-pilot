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
      className={`cursor-pointer transition-all duration-200 hover:border-primary/30 hover:bg-accent/40 ${
        isActive ? 'border-primary/50 bg-accent/60' : ''
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <span className="text-xl shrink-0 bg-muted rounded-[10px] w-9 h-9 flex items-center justify-center">{tool.icon}</span>
          <div className="min-w-0 space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold tracking-[-0.01em] text-foreground truncate">
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
            <p className="text-[13px] text-muted-foreground line-clamp-2 leading-relaxed">
              {tool.desc}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
