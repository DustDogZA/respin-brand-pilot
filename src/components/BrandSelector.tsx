import { BRANDS } from '@/data/brands';
import { useBrand } from '@/context/BrandContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function BrandSelector() {
  const { activeBrandId, setActiveBrandId } = useBrand();
  const brand = BRANDS[activeBrandId];

  return (
    <Select value={activeBrandId} onValueChange={setActiveBrandId}>
      <SelectTrigger className="w-full border-border bg-sidebar-accent/50 text-sm rounded-full">
        <div className="flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-full shrink-0"
            style={{ backgroundColor: brand.accent }}
          />
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent>
        {Object.values(BRANDS).map((b) => (
          <SelectItem key={b.id} value={b.id}>
            <div className="flex items-center gap-2">
              <span
                className="h-2 w-2 rounded-full shrink-0"
                style={{ backgroundColor: b.accent }}
              />
              <span>{b.short}</span>
              <span className="text-muted-foreground text-xs ml-auto">{b.stage}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
