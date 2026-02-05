import { Droplets, Gauge, FlaskConical, Satellite, Wifi } from 'lucide-react';
import { SoilData } from '@/types/agrigenie';

interface SoilDataCardProps {
  data: SoilData;
}

export function SoilDataCard({ data }: SoilDataCardProps) {
  const getPhColor = (ph: number) => {
    if (ph < 5.5) return 'text-destructive';
    if (ph < 6.0) return 'text-amber-600';
    if (ph <= 7.5) return 'text-primary';
    if (ph <= 8.5) return 'text-amber-600';
    return 'text-destructive';
  };

  const getMoistureColor = (moisture: number) => {
    if (moisture < 20) return 'text-destructive';
    if (moisture < 40) return 'text-amber-600';
    if (moisture <= 60) return 'text-primary';
    return 'text-water';
  };

  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="card-agri p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg text-foreground">Soil Data</h3>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {data.source === 'satellite' ? (
            <Satellite className="w-4 h-4 text-primary" />
          ) : (
            <Wifi className="w-4 h-4 text-primary" />
          )}
          <span className="capitalize">{data.source}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* pH Level */}
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-2">
            <Gauge className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">pH Level</span>
          </div>
          <div className={`text-2xl font-bold ${getPhColor(data.ph)}`}>
            {data.ph}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {data.ph >= 6.0 && data.ph <= 7.5 ? 'Optimal' : 'Needs attention'}
          </div>
        </div>

        {/* Moisture */}
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-2">
            <Droplets className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Moisture</span>
          </div>
          <div className={`text-2xl font-bold ${getMoistureColor(data.moisture)}`}>
            {data.moisture}%
          </div>
          <div className="w-full bg-muted rounded-full h-1.5 mt-2">
            <div 
              className="bg-water h-1.5 rounded-full transition-all"
              style={{ width: `${data.moisture}%` }}
            />
          </div>
        </div>

        {/* NPK Values */}
        <div className="stat-card col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <FlaskConical className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">NPK Values (kg/ha)</span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-primary">{data.nitrogen}</div>
              <div className="text-xs text-muted-foreground">Nitrogen (N)</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-accent">{data.phosphorus}</div>
              <div className="text-xs text-muted-foreground">Phosphorus (P)</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-secondary">{data.potassium}</div>
              <div className="text-xs text-muted-foreground">Potassium (K)</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-border text-xs text-muted-foreground">
        Last updated: {formatTimestamp(data.lastUpdated)}
      </div>
    </div>
  );
}
