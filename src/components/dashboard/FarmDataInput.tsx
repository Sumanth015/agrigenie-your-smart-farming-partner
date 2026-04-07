import { useState } from 'react';
import { FlaskConical, Droplets, Loader2, Save, Plus, Trash2, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const SOIL_TYPES = ['Clay', 'Sandy', 'Loamy', 'Silty', 'Peaty', 'Chalky', 'Black Cotton'];
const COMMON_CROPS = ['Rice', 'Wheat', 'Cotton', 'Sugarcane', 'Maize', 'Groundnut', 'Soybean', 'Pulses', 'Jowar', 'Bajra'];
const SEASONS = ['Kharif', 'Rabi', 'Zaid'];

export function FarmDataInput() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Soil form
  const [soil, setSoil] = useState({
    ph: '', moisture: '', nitrogen: '', phosphorus: '', potassium: '', soil_type: '',
  });
  const [savingSoil, setSavingSoil] = useState(false);

  // Crop history form
  const [newCrop, setNewCrop] = useState({ crop: '', season: 'Kharif', year: new Date().getFullYear().toString(), yield: '' });

  // Fetch existing soil data
  const { data: existingSoil } = useQuery({
    queryKey: ['soil_data', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('soil_data')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      if (data) {
        setSoil({
          ph: data.ph?.toString() || '',
          moisture: data.moisture?.toString() || '',
          nitrogen: data.nitrogen?.toString() || '',
          phosphorus: data.phosphorus?.toString() || '',
          potassium: data.potassium?.toString() || '',
          soil_type: data.soil_type || '',
        });
      }
      return data;
    },
    enabled: !!user,
  });

  // Fetch crop history
  const { data: cropHistory = [] } = useQuery({
    queryKey: ['user_crop_history', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_crop_history')
        .select('*')
        .eq('user_id', user!.id)
        .order('year', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const saveSoilData = async () => {
    if (!user) return;
    setSavingSoil(true);
    try {
      const payload = {
        user_id: user.id,
        ph: soil.ph ? parseFloat(soil.ph) : null,
        moisture: soil.moisture ? parseFloat(soil.moisture) : null,
        nitrogen: soil.nitrogen ? parseFloat(soil.nitrogen) : null,
        phosphorus: soil.phosphorus ? parseFloat(soil.phosphorus) : null,
        potassium: soil.potassium ? parseFloat(soil.potassium) : null,
        soil_type: soil.soil_type || null,
        source: 'manual' as const,
      };
      const { error } = await supabase.from('soil_data').insert(payload);
      if (error) throw error;

      // Generate a notification for the user
      await supabase.from('notifications').insert({
        user_id: user.id,
        type: 'fertilizer',
        title: 'Soil Data Updated',
        message: `Your soil data has been recorded. pH: ${soil.ph || 'N/A'}, Moisture: ${soil.moisture || 'N/A'}%. Recommendations will be updated.`,
      });

      queryClient.invalidateQueries({ queryKey: ['soil_data'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('Soil data saved successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save soil data');
    } finally {
      setSavingSoil(false);
    }
  };

  const addCropMutation = useMutation({
    mutationFn: async () => {
      if (!user || !newCrop.crop) throw new Error('Please select a crop');
      const { error } = await supabase.from('user_crop_history').insert({
        user_id: user.id,
        crop: newCrop.crop,
        season: newCrop.season,
        year: parseInt(newCrop.year),
        yield: newCrop.yield ? parseFloat(newCrop.yield) : null,
      });
      if (error) throw error;

      await supabase.from('notifications').insert({
        user_id: user.id,
        type: 'fertilizer',
        title: 'Crop History Updated',
        message: `Added ${newCrop.crop} (${newCrop.season} ${newCrop.year}) to your history. AI suggestions will consider this.`,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user_crop_history'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      setNewCrop({ crop: '', season: 'Kharif', year: new Date().getFullYear().toString(), yield: '' });
      toast.success('Crop added to history!');
    },
    onError: (err: any) => toast.error(err.message),
  });

  const deleteCropMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('user_crop_history').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user_crop_history'] });
      toast.success('Crop removed');
    },
  });

  return (
    <div className="space-y-6">
      {/* Soil Data Input */}
      <div className="card-agri p-5">
        <div className="flex items-center gap-2 mb-4">
          <FlaskConical className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-lg text-foreground">Soil Data Input</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Enter your soil test results for personalized recommendations.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
          <div>
            <Label>pH Level</Label>
            <Input type="number" step="0.1" min="0" max="14" placeholder="e.g. 6.8" value={soil.ph} onChange={e => setSoil({ ...soil, ph: e.target.value })} className="mt-1" />
          </div>
          <div>
            <Label>Moisture (%)</Label>
            <Input type="number" min="0" max="100" placeholder="e.g. 42" value={soil.moisture} onChange={e => setSoil({ ...soil, moisture: e.target.value })} className="mt-1" />
          </div>
          <div>
            <Label>Nitrogen (kg/ha)</Label>
            <Input type="number" min="0" placeholder="e.g. 280" value={soil.nitrogen} onChange={e => setSoil({ ...soil, nitrogen: e.target.value })} className="mt-1" />
          </div>
          <div>
            <Label>Phosphorus (kg/ha)</Label>
            <Input type="number" min="0" placeholder="e.g. 45" value={soil.phosphorus} onChange={e => setSoil({ ...soil, phosphorus: e.target.value })} className="mt-1" />
          </div>
          <div>
            <Label>Potassium (kg/ha)</Label>
            <Input type="number" min="0" placeholder="e.g. 210" value={soil.potassium} onChange={e => setSoil({ ...soil, potassium: e.target.value })} className="mt-1" />
          </div>
          <div>
            <Label>Soil Type</Label>
            <select
              value={soil.soil_type}
              onChange={e => setSoil({ ...soil, soil_type: e.target.value })}
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring mt-1"
            >
              <option value="">Select type</option>
              {SOIL_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <Button onClick={saveSoilData} disabled={savingSoil}>
          {savingSoil ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          Save Soil Data
        </Button>
      </div>

      {/* Crop History Input */}
      <div className="card-agri p-5">
        <div className="flex items-center gap-2 mb-4">
          <History className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-lg text-foreground">Past Crops Grown</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Add crops you've grown before — this helps the AI suggest better rotation and new crops.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
          <div>
            <Label>Crop</Label>
            <select
              value={newCrop.crop}
              onChange={e => setNewCrop({ ...newCrop, crop: e.target.value })}
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring mt-1"
            >
              <option value="">Select crop</option>
              {COMMON_CROPS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <Label>Season</Label>
            <select
              value={newCrop.season}
              onChange={e => setNewCrop({ ...newCrop, season: e.target.value })}
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring mt-1"
            >
              {SEASONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <Label>Year</Label>
            <Input type="number" min="2015" max="2026" value={newCrop.year} onChange={e => setNewCrop({ ...newCrop, year: e.target.value })} className="mt-1" />
          </div>
          <div>
            <Label>Yield (tons/acre)</Label>
            <Input type="number" step="0.1" min="0" placeholder="Optional" value={newCrop.yield} onChange={e => setNewCrop({ ...newCrop, yield: e.target.value })} className="mt-1" />
          </div>
        </div>

        <Button onClick={() => addCropMutation.mutate()} disabled={!newCrop.crop || addCropMutation.isPending}>
          {addCropMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
          Add Crop
        </Button>

        {/* Existing crop history */}
        {cropHistory.length > 0 && (
          <div className="mt-4 space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Your Crop History</h4>
            {cropHistory.map((item: any) => (
              <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-muted">
                <div>
                  <span className="font-medium text-foreground">{item.crop}</span>
                  <span className="text-sm text-muted-foreground ml-2">
                    {item.season} {item.year} {item.yield ? `• ${item.yield} t/acre` : ''}
                  </span>
                </div>
                <button
                  onClick={() => deleteCropMutation.mutate(item.id)}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
