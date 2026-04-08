import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { SoilData } from '@/types/agrigenie';

export function useSoilData(userId?: string) {
  return useQuery({
    queryKey: ['soil_data', userId],
    queryFn: async (): Promise<SoilData | null> => {
      if (!userId) return null;
      const { data, error } = await supabase
        .from('soil_data')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      if (!data) return null;
      return {
        ph: data.ph ?? 0,
        moisture: data.moisture ?? 0,
        nitrogen: data.nitrogen ?? 0,
        phosphorus: data.phosphorus ?? 0,
        potassium: data.potassium ?? 0,
        source: (data.source as SoilData['source']) || 'manual',
        lastUpdated: new Date(data.updated_at),
      };
    },
    enabled: !!userId,
  });
}
