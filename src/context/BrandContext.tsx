import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { BRANDS, BRAND_IDS, type Brand } from '@/data/brands';

function loadCanonOverrides(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const overrides: Record<string, string> = {};
  for (const id of BRAND_IDS) {
    try {
      const val = localStorage.getItem(`respin_canon_${id}`);
      if (val) overrides[id] = val;
    } catch {}
  }
  return overrides;
}

interface BrandContextType {
  activeBrandId: string;
  brand: Brand;
  setActiveBrandId: (id: string) => void;
  updateCanon: (brandId: string, canon: string) => void;
  getBrand: (id: string) => Brand;
}

const BrandContext = createContext<BrandContextType | null>(null);

export function BrandProvider({ children }: { children: ReactNode }) {
  const [activeBrandId, setActiveBrandId] = useState('kikis');
  const [canonOverrides, setCanonOverrides] = useState<Record<string, string>>({});

  useEffect(() => {
    setCanonOverrides(loadCanonOverrides());
  }, []);

  const getBrand = (id: string): Brand => {
    const base = BRANDS[id] || BRANDS.kikis;
    return canonOverrides[id] ? { ...base, canon: canonOverrides[id] } : base;
  };

  const brand = getBrand(activeBrandId);

  const updateCanon = (brandId: string, canon: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`respin_canon_${brandId}`, canon);
    }
    setCanonOverrides((prev) => ({ ...prev, [brandId]: canon }));
  };

  return (
    <BrandContext.Provider value={{ activeBrandId, brand, setActiveBrandId, updateCanon, getBrand }}>
      {children}
    </BrandContext.Provider>
  );
}

export function useBrand() {
  const ctx = useContext(BrandContext);
  if (!ctx) throw new Error('useBrand must be used within BrandProvider');
  return ctx;
}
