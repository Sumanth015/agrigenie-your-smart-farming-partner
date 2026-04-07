import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { CropRecommendation } from '@/types/agrigenie';

export function useCropRecommendations(state?: string, soilType?: string) {
  return useQuery({
    queryKey: ['crop_recommendations', state, soilType],
    queryFn: async (): Promise<CropRecommendation[]> => {
      let query = supabase.from('crop_recommendations').select('*');
      if (state) {
        query = query.contains('suitable_states', [state]);
      }
      if (soilType) {
        query = query.contains('suitable_soil_types', [soilType]);
      }
      const { data, error } = await query.order('suitability_score', { ascending: false });
      if (error) throw error;
      return (data || []).map((row: any) => ({
        name: row.crop_name,
        suitabilityScore: row.suitability_score,
        expectedYield: Number(row.expected_yield),
        profitMargin: Number(row.profit_margin),
        sustainabilityScore: row.sustainability_score,
        waterRequirement: row.water_requirement as CropRecommendation['waterRequirement'],
        growthDuration: row.growth_duration,
        riskLevel: row.risk_level as CropRecommendation['riskLevel'],
        reasoning: row.reasoning,
      }));
    },
  });
}
