import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { CropHistory } from '@/types/agrigenie';
import { mockCropHistory } from '@/data/mockData';

export function useCropHistory(userId?: string) {
  return useQuery({
    queryKey: ['user_crop_history', userId],
    queryFn: async (): Promise<CropHistory[]> => {
      if (!userId) return mockCropHistory;
      try {
        const { data, error } = await supabase
          .from('user_crop_history')
          .select('*')
          .eq('user_id', userId)
          .order('year', { ascending: false });
        if (error) throw error;
        if (data && data.length > 0) {
          return data.map((row) => ({
            crop: row.crop,
            season: row.season,
            year: row.year,
            yield: Number(row.yield ?? 0),
          }));
        }
      } catch (err) {
        console.warn('Could not fetch crop history from remote server, using local data:', err);
      }
      try {
        const local = localStorage.getItem('agrigenie_crop_history');
        if (local) return JSON.parse(local);
      } catch {}
      return mockCropHistory;
    },
    enabled: !!userId,
  });
}

