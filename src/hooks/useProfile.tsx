import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Profile {
  id: string;
  name: string;
  mobile: string | null;
  village: string | null;
  district: string | null;
  state: string | null;
  farm_size: number | null;
  farm_size_unit: string | null;
  soil_type: string | null;
  preferred_language: string | null;
}

export function useProfile(userId?: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['profile', userId],
    queryFn: async (): Promise<Profile | null> => {
      if (!userId) return null;
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();
        if (error) throw error;
        if (data) return data as Profile;
      } catch (err) {
        console.warn('Could not fetch profile from remote server, using local data:', err);
      }
      try {
        const raw = localStorage.getItem('agrigenie_profile');
        if (raw) return JSON.parse(raw);
      } catch {}
      return null;
    },
    enabled: !!userId,
  });

  const updateProfile = useMutation({
    mutationFn: async (updates: Partial<Profile>) => {
      if (!userId) throw new Error('Not authenticated');

      try {
        const raw = localStorage.getItem('agrigenie_profile');
        const current = raw ? JSON.parse(raw) : { id: userId };
        const updated = { ...current, ...updates };
        localStorage.setItem('agrigenie_profile', JSON.stringify(updated));
      } catch {}

      try {
        const { error } = await supabase
          .from('profiles')
          .update(updates)
          .eq('id', userId);
        if (error) throw error;
      } catch (err) {
        console.warn('Could not sync profile update with remote server (offline mode):', err);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', userId] });
    },
  });

  return { profile: query.data, loading: query.isLoading, updateProfile };
}

