import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { MarketPrice } from '@/types/agrigenie';
import { mockMarketPrices } from '@/data/mockData';

interface MarketPriceRow {
  crop: string;
  price: number;
  trend: string;
  demand: string;
  mandi_name: string;
  location_district?: string;
  updated_at: string;
}

export function useMarketPrices(state?: string, district?: string) {
  return useQuery({
    queryKey: ['market_prices', state, district],
    queryFn: async (): Promise<MarketPrice[]> => {
      try {
        let query = supabase.from('market_prices').select('*');
        if (state) {
          query = query.eq('location_state', state);
        }
        const { data, error } = await query.order('updated_at', { ascending: false });
        if (error) throw error;
        
        const rows = data || [];
        if (rows.length > 0) {
          // Sort: district matches first, then others
          const districtLower = district?.toLowerCase() || '';
          (rows as MarketPriceRow[]).sort((a, b) => {
            const aMatch = a.location_district?.toLowerCase() === districtLower ? 0 : 1;
            const bMatch = b.location_district?.toLowerCase() === districtLower ? 0 : 1;
            return aMatch - bMatch;
          });

          return (rows as MarketPriceRow[]).map((row) => ({
            crop: row.crop,
            price: Number(row.price),
            trend: row.trend as MarketPrice['trend'],
            demand: row.demand as MarketPrice['demand'],
            mandiName: row.mandi_name,
          }));
        }
      } catch (err) {
        console.warn('Could not fetch market prices from remote server, using local data:', err);
      }
      return mockMarketPrices;
    },
  });
}

