import { useState, useEffect } from 'react';
import { MapPin, Leaf, Loader2, Search, LocateFixed } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCropRecommendations } from '@/hooks/useCropRecommendations';
import { CropRecommendations } from './CropRecommendations';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

const STATES = [
  'Andhra Pradesh', 'Gujarat', 'Haryana', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Punjab', 'Rajasthan', 'Tamil Nadu',
  'Uttar Pradesh', 'West Bengal'
];

const SOIL_TYPES = ['Clay', 'Sandy', 'Loamy', 'Silty', 'Peaty', 'Chalky', 'Black Cotton'];

async function reverseGeocode(lat: number, lng: number): Promise<{ state: string; district: string }> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`,
      { headers: { 'Accept-Language': 'en' } }
    );
    const data = await res.json();
    const addr = data.address || {};
    return {
      state: addr.state || '',
      district: addr.county || addr.state_district || addr.city || '',
    };
  } catch {
    return { state: '', district: '' };
  }
}

export function LocationCropAdvisor() {
  const { t } = useTranslation();
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [soilType, setSoilType] = useState('');
  const [searchTriggered, setSearchTriggered] = useState(false);
  const [locating, setLocating] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  const { data: recommendations = [], isLoading } = useCropRecommendations(
    searchTriggered ? state || undefined : undefined,
    searchTriggered ? soilType || undefined : undefined
  );

  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ lat: latitude, lng: longitude });
        const geo = await reverseGeocode(latitude, longitude);

        // Match detected state to our list
        const matchedState = STATES.find(
          s => geo.state.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(geo.state.toLowerCase())
        );
        if (matchedState) setState(matchedState);
        if (geo.district) setDistrict(geo.district);

        setSearchTriggered(false);
        setLocating(false);
        toast.success(`Location detected: ${geo.district}, ${geo.state}`);
      },
      (err) => {
        setLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          toast.error('Location permission denied. Please allow location access and try again.');
        } else {
          toast.error('Could not detect your location. Please enter manually.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Auto-detect on mount
  useEffect(() => {
    detectLocation();
  }, []);

  const handleSearch = () => {
    if (!state) {
      toast.error('Please select a state');
      return;
    }
    setSearchTriggered(true);
  };

  return (
    <div className="space-y-6">
      <div className="card-agri p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-lg text-foreground">Location-Based Crop Advisor</h3>
          </div>
          <Button variant="outline" size="sm" onClick={detectLocation} disabled={locating}>
            {locating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <LocateFixed className="w-4 h-4 mr-2" />}
            {locating ? 'Detecting...' : 'Use My Location'}
          </Button>
        </div>

        {coords && (
          <div className="mb-4 p-3 rounded-xl bg-primary/5 border border-primary/20 text-sm">
            <span className="text-primary font-medium">📍 GPS Coordinates:</span>{' '}
            <span className="text-foreground">{coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}</span>
          </div>
        )}

        <p className="text-sm text-muted-foreground mb-4">
          Allow location access for automatic detection, or enter details manually.
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
