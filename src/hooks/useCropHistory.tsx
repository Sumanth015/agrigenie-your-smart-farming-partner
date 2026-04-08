import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { CropHistory } from '@/types/agrigenie';

export function useCropHistory(userId?: string) {
  return useQuery({
    queryKey: ['user_crop_history', userId],
    queryFn: async (): Promise<CropHistory[]> => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from('user_crop_history')
        .select('*')
        .eq('user_id', userId)
        .order('year', { ascending: false });
      if (error) throw error;
      return (data || []).map((row) => ({
        crop: row.crop,
        season: row.season,
        year: row.year,
        yield: Number(row.yield ?? 0),
      }));
    },
    enabled: !!userId,
  });
}
