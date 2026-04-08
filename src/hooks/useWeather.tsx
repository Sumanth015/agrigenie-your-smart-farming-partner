import { useQuery } from '@tanstack/react-query';
import type { WeatherForecast } from '@/types/agrigenie';

function mapWeatherCode(code: number): WeatherForecast['condition'] {
  if (code <= 1) return 'sunny';
  if (code <= 3) return 'cloudy';
  if (code <= 67 || (code >= 80 && code <= 82)) return 'rainy';
  return 'stormy';
}

function getAlert(code: number, rainfall: number): string | undefined {
  if (code >= 95) return 'Thunderstorm expected — protect crops and livestock';
  if (rainfall >= 20) return `Heavy rainfall expected (${rainfall}mm)`;
  return undefined;
}

export function useWeather(lat?: number, lng?: number) {
  return useQuery({
    queryKey: ['weather', lat, lng],
    queryFn: async (): Promise<WeatherForecast[]> => {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,relative_humidity_2m_mean,weather_code&timezone=auto&forecast_days=7`
      );
      if (!res.ok) throw new Error('Weather API error');
      const data = await res.json();
      const d = data.daily;
      return d.time.map((date: string, i: number) => ({
        date: new Date(date),
        temperature: { min: Math.round(d.temperature_2m_min[i]), max: Math.round(d.temperature_2m_max[i]) },
        rainfall: Math.round(d.precipitation_sum[i]),
        humidity: Math.round(d.relative_humidity_2m_mean[i]),
        condition: mapWeatherCode(d.weather_code[i]),
        alert: getAlert(d.weather_code[i], d.precipitation_sum[i]),
      }));
    },
    enabled: !!lat && !!lng,
    staleTime: 30 * 60 * 1000, // 30 min
  });
}
