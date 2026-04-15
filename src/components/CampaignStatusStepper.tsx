import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const STEPS = [
  { key: 'strategy', label: 'Strategy' },
  { key: 'planning', label: 'Planning' },
  { key: 'production', label: 'Production' },
  { key: 'review', label: 'Review' },
  { key: 'published', label: 'Published' },
  { key: 'learning', label: 'Learning' },
] as const;

interface CampaignStatusStepperProps {
  status: string;
  onAdvance?: (nextStatus: string) => void;
}

export function CampaignStatusStepper({ status, onAdvance }: CampaignStatusStepperProps) {
  const currentIdx = STEPS.findIndex((s) => s.key === status);

  return (
    <div className="flex items-center gap-1 overflow-x-auto">
      {STEPS.map((step, i) => {
        const isPast = i < currentIdx;
        const isCurrent = i === currentIdx;
        const isNext = i === currentIdx + 1;

        return (
          <div key={step.key} className="flex items-center">
            {i > 0 && (
              <div
                className={cn(
                  'h-px w-4 md:w-6 mx-0.5',
                  isPast ? 'bg-primary' : 'bg-border'
                )}
              />
            )}
            <button
              onClick={isNext && onAdvance ? () => onAdvance(step.key) : undefined}
              disabled={!isNext || !onAdvance}
              className={cn(
                'flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-premium border',
                isPast && 'bg-primary/10 text-primary border-primary/20',
                isCurrent && 'bg-primary text-primary-foreground border-primary',
                !isPast && !isCurrent && 'bg-card text-muted-foreground border-border',
                isNext && onAdvance && 'hover:border-primary/40 cursor-pointer',
                (!isNext || !onAdvance) && !isCurrent && !isPast && 'cursor-default'
              )}
            >
              {isPast && <Check className="h-3 w-3" />}
              {step.label}
            </button>
          </div>
        );
      })}
    </div>
  );
}

export { STEPS as CAMPAIGN_STEPS };
