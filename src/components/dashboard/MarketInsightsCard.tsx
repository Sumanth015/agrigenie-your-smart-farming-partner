import { TrendingUp, TrendingDown, Minus, MapPin } from 'lucide-react';
import { MarketPrice } from '@/types/agrigenie';

interface MarketInsightsCardProps {
  prices: MarketPrice[];
}

export function MarketInsightsCard({ prices }: MarketInsightsCardProps) {
  const getTrendIcon = (trend: MarketPrice['trend']) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-primary" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-destructive" />;
      case 'stable':
        return <Minus className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getDemandBadge = (demand: MarketPrice['demand']) => {
    const baseClass = 'score-badge text-xs';
    switch (demand) {
      case 'high':
        return <span className={`${baseClass} score-high`}>High Demand</span>;
      case 'medium':
        return <span className={`${baseClass} score-medium`}>Medium</span>;
      case 'low':
        return <span className={`${baseClass} score-low`}>Low</span>;
    }
  };

  return (
    <div className="card-agri p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg text-foreground">Market Prices</h3>
        <span className="text-xs text-muted-foreground">₹/quintal</span>
      </div>

      <div className="space-y-3">
        {prices.slice(0, 5).map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground">{item.crop}</span>
                {getTrendIcon(item.trend)}
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                <MapPin className="w-3 h-3" />
                {item.mandiName}
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-foreground">₹{item.price.toLocaleString()}</div>
              {getDemandBadge(item.demand)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
