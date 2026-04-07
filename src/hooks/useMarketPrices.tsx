import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { MarketPrice } from '@/types/agrigenie';

export function useMarketPrices(state?: string) {
  return useQuery({
    queryKey: ['market_prices', state],
    queryFn: async (): Promise<MarketPrice[]> => {
      let query = supabase.from('market_prices').select('*');
      if (state) {
        query = query.eq('location_state', state);
      }
      const { data, error } = await query.order('updated_at', { ascending: false });
      if (error) throw error;
      return (data || []).map((row: any) => ({
        crop: row.crop,
        price: Number(row.price),
        trend: row.trend as MarketPrice['trend'],
        demand: row.demand as MarketPrice['demand'],
        mandiName: row.mandi_name,
      }));
    },
  });
}
