import { History, Leaf, TrendingUp } from 'lucide-react';
import { CropHistory } from '@/types/agrigenie';

interface CropHistoryCardProps {
  history: CropHistory[];
}

export function CropHistoryCard({ history }: CropHistoryCardProps) {
  const sustainabilityScore = 72; // Mock score based on rotation

  const getSeasonColor = (season: string) => {
    return season === 'Kharif' ? 'bg-primary/10 text-primary' : 'bg-accent/20 text-amber-700';
  };

  return (
    <div className="card-agri p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
          <History className="w-5 h-5 text-primary" />
          Crop History
        </h3>
      </div>

      {/* Sustainability Score */}
      <div className="mb-4 p-4 rounded-xl bg-muted">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Soil Sustainability</span>
          <span className="font-bold text-primary">{sustainabilityScore}%</span>
        </div>
        <div className="w-full bg-background rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all"
            style={{ width: `${sustainabilityScore}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Good rotation pattern. Consider adding legumes to improve nitrogen.
        </p>
      </div>

      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
        
        <div className="space-y-4">
          {history.map((item, index) => (
            <div key={index} className="relative flex items-start gap-4 pl-8">
              <div className="absolute left-2.5 w-3 h-3 rounded-full bg-primary border-2 border-background" />
              <div className="flex-1 flex items-center justify-between p-3 rounded-xl bg-muted">
                <div>
                  <div className="flex items-center gap-2">
                    <Leaf className="w-4 h-4 text-primary" />
                    <span className="font-medium text-foreground">{item.crop}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getSeasonColor(item.season)}`}>
                      {item.season}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{item.year}</div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-primary">
                    <TrendingUp className="w-4 h-4" />
                    <span className="font-bold">{item.yield}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">tons/acre</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
