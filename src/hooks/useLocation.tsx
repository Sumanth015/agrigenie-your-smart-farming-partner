import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface LocationInfo {
  lat: number;
  lng: number;
  state: string;
  district: string;
}

const KNOWN_STATES = [
  'Andhra Pradesh', 'Gujarat', 'Haryana', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Punjab', 'Rajasthan', 'Tamil Nadu',
  'Uttar Pradesh', 'West Bengal', 'Bihar', 'Odisha', 'Chhattisgarh',
  'Jharkhand', 'Assam', 'Telangana', 'Goa'
];

async function reverseGeocode(lat: number, lng: number): Promise<{ state: string; district: string }> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`,
      { headers: { 'Accept-Language': 'en' } }
    );
    const data = await res.json();
    const addr = data.address || {};
    const rawState = addr.state || '';
    const matched = KNOWN_STATES.find(
      s => rawState.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(rawState.toLowerCase())
    );
    return {
      state: matched || rawState,
      district: addr.county || addr.state_district || addr.city || '',
    };
  } catch {
    return { state: '', district: '' };
  }
}

export function useLocation() {
  const [location, setLocation] = useState<LocationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const detect = () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      setLoading(false);
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const geo = await reverseGeocode(latitude, longitude);
        setLocation({ lat: latitude, lng: longitude, state: geo.state, district: geo.district });
        setLoading(false);
      },
      (err) => {
        setError(err.code === err.PERMISSION_DENIED ? 'Permission denied' : 'Location unavailable');
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  useEffect(() => {
    detect();
  }, []);

  return { location, loading, error, detect };
}
