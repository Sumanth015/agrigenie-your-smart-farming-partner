import { TrendingUp, TrendingDown, Minus, MapPin } from 'lucide-react';
import { MarketPrice } from '@/types/agrigenie';
import { useTranslation } from 'react-i18next';

interface MarketInsightsCardProps {
  prices: MarketPrice[];
  detectedLocation?: string;
}

export function MarketInsightsCard({ prices, detectedLocation }: MarketInsightsCardProps) {
  const { t } = useTranslation();

  const getTrendIcon = (trend: MarketPrice['trend']) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-primary" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-destructive" />;
      case 'stable': return <Minus className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getDemandBadge = (demand: MarketPrice['demand']) => {
    const baseClass = 'score-badge text-xs';
    switch (demand) {
      case 'high': return <span className={`${baseClass} score-high`}>{t('market.highDemand')}</span>;
      case 'medium': return <span className={`${baseClass} score-medium`}>{t('market.medium')}</span>;
      case 'low': return <span className={`${baseClass} score-low`}>{t('market.low')}</span>;
    }
  };

  return (
    <div className="card-agri p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg text-foreground">{t('market.title')}</h3>
        <span className="text-xs text-muted-foreground">{t('market.perQuintal')}</span>
      </div>
      {detectedLocation && (
        <div className="mb-3 flex items-center gap-1.5 text-xs text-primary">
          <MapPin className="w-3.5 h-3.5" />
          <span>Showing prices near <strong>{detectedLocation}</strong></span>
        </div>
      )}
      {prices.length === 0 ? (
        <div className="p-6 text-center text-muted-foreground text-sm">
          <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>Allow location access to see nearby market prices.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {prices.slice(0, 6).map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-muted hover:bg-muted/80 transition-colors">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">{item.crop}</span>
                  {getTrendIcon(item.trend)}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                  <MapPin className="w-3 h-3" />{item.mandiName}
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-foreground">₹{item.price.toLocaleString()}</div>
                {getDemandBadge(item.demand)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
