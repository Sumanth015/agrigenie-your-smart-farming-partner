import { Sun, Cloud, CloudRain, CloudLightning, AlertTriangle } from 'lucide-react';
import { WeatherForecast } from '@/types/agrigenie';
import { useTranslation } from 'react-i18next';

interface WeatherCardProps {
  forecasts: WeatherForecast[];
}

export function WeatherCard({ forecasts }: WeatherCardProps) {
  const { t } = useTranslation();

  const getWeatherIcon = (condition: WeatherForecast['condition']) => {
    switch (condition) {
      case 'sunny': return <Sun className="w-8 h-8 text-harvest" />;
      case 'cloudy': return <Cloud className="w-8 h-8 text-muted-foreground" />;
      case 'rainy': return <CloudRain className="w-8 h-8 text-water" />;
      case 'stormy': return <CloudLightning className="w-8 h-8 text-destructive" />;
    }
  };

  const getDayName = (date: Date, index: number) => {
    if (index === 0) return t('weather.today');
    if (index === 1) return t('weather.tomorrow');
    return new Intl.DateTimeFormat('en-IN', { weekday: 'short' }).format(date);
  };

  const hasAlert = forecasts.some(f => f.alert);

  return (
    <div className="card-agri p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg text-foreground">{t('weather.title')}</h3>
        {hasAlert && (
          <div className="flex items-center gap-1 text-destructive text-xs">
            <AlertTriangle className="w-4 h-4" />
            <span>{t('weather.alert')}</span>
          </div>
        )}
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
        {forecasts.map((forecast, index) => (
          <div key={index} className={`flex-shrink-0 w-20 p-3 rounded-xl text-center transition-all ${
            forecast.alert ? 'bg-destructive/10 border border-destructive/30' : 'bg-muted hover:bg-muted/80'
          }`}>
            <div className="text-xs font-medium text-muted-foreground mb-2">{getDayName(forecast.date, index)}</div>
            <div className="flex justify-center mb-2">{getWeatherIcon(forecast.condition)}</div>
            <div className="text-sm font-bold text-foreground">{forecast.temperature.max}°</div>
            <div className="text-xs text-muted-foreground">{forecast.temperature.min}°</div>
            {forecast.rainfall > 0 && (
              <div className="text-xs text-water mt-1 flex items-center justify-center gap-0.5">
                <CloudRain className="w-3 h-3" />{forecast.rainfall}mm
              </div>
            )}
          </div>
        ))}
      </div>
      {hasAlert && (
        <div className="mt-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-medium text-destructive text-sm">{t('weather.weatherAlert')}</div>
              <div className="text-xs text-foreground/80 mt-0.5">{forecasts.find(f => f.alert)?.alert}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
