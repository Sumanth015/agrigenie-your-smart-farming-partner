import { useState } from 'react';
import { MapPin, Leaf, Loader2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCropRecommendations } from '@/hooks/useCropRecommendations';
import { CropRecommendations } from './CropRecommendations';
import { useTranslation } from 'react-i18next';

const STATES = [
  'Andhra Pradesh', 'Gujarat', 'Haryana', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Punjab', 'Rajasthan', 'Tamil Nadu',
  'Uttar Pradesh', 'West Bengal'
];

const SOIL_TYPES = ['Clay', 'Sandy', 'Loamy', 'Silty', 'Peaty', 'Chalky', 'Black Cotton'];

export function LocationCropAdvisor() {
  const { t } = useTranslation();
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [soilType, setSoilType] = useState('');
  const [searchTriggered, setSearchTriggered] = useState(false);

  const { data: recommendations = [], isLoading } = useCropRecommendations(
    searchTriggered ? state || undefined : undefined,
    searchTriggered ? soilType || undefined : undefined
  );

  const handleSearch = () => {
    if (!state) return;
    setSearchTriggered(true);
  };

  return (
    <div className="space-y-6">
      <div className="card-agri p-5">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-lg text-foreground">Location-Based Crop Advisor</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Enter your location and soil type to get personalized crop recommendations.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div>
            <Label>State</Label>
            <select
              value={state}
              onChange={(e) => { setState(e.target.value); setSearchTriggered(false); }}
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring mt-1"
            >
              <option value="">Select State</option>
              {STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <Label>District</Label>
            <Input
              placeholder="Enter district"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Soil Type</Label>
            <select
              value={soilType}
              onChange={(e) => { setSoilType(e.target.value); setSearchTriggered(false); }}
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring mt-1"
            >
              <option value="">Any Soil Type</option>
              {SOIL_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <Button onClick={handleSearch} disabled={!state || isLoading}>
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Search className="w-4 h-4 mr-2" />}
          Get Recommendations
        </Button>
      </div>

      {searchTriggered && !isLoading && recommendations.length > 0 && (
        <CropRecommendations recommendations={recommendations} />
      )}

      {searchTriggered && !isLoading && recommendations.length === 0 && (
        <div className="card-agri p-8 text-center">
          <Leaf className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No recommendations found for this location. Try a different state or soil type.</p>
        </div>
      )}
    </div>
  );
}
