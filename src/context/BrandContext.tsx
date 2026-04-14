import { createContext, useContext, useState, type ReactNode } from 'react';
import { BRANDS, type Brand } from '@/data/brands';

interface BrandContextType {
  activeBrandId: string;
  brand: Brand;
  setActiveBrandId: (id: string) => void;
}

const BrandContext = createContext<BrandContextType | null>(null);

export function BrandProvider({ children }: { children: ReactNode }) {
  const [activeBrandId, setActiveBrandId] = useState('kikis');
  const brand = BRANDS[activeBrandId] || BRANDS.kikis;

  return (
    <BrandContext.Provider value={{ activeBrandId, brand, setActiveBrandId }}>
      {children}
    </BrandContext.Provider>
  );
}

export function useBrand() {
  const ctx = useContext(BrandContext);
  if (!ctx) throw new Error('useBrand must be used within BrandProvider');
  return ctx;
}
