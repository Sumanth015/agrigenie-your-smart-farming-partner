import { useState } from 'react';
import { Leaf, ChevronDown, ChevronUp, Droplets, Clock, AlertTriangle, TrendingUp, Download, Sparkles } from 'lucide-react';
import { CropRecommendation } from '@/types/agrigenie';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

interface CropRecommendationsProps {
  recommendations: CropRecommendation[];
}

export function CropRecommendations({ recommendations }: CropRecommendationsProps) {
  const { t } = useTranslation();
  const [expandedCrop, setExpandedCrop] = useState<string | null>(null);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'score-high';
    if (score >= 60) return 'score-medium';
    return 'score-low';
  };

  const getRiskBadge = (risk: CropRecommendation['riskLevel']) => {
    switch (risk) {
      case 'low': return <span className="score-badge score-high text-xs">{t('recommendations.lowRisk')}</span>;
      case 'medium': return <span className="score-badge score-medium text-xs">{t('recommendations.mediumRisk')}</span>;
      case 'high': return <span className="score-badge score-low text-xs">{t('recommendations.highRisk')}</span>;
    }
  };

  const getWaterIcon = (water: CropRecommendation['waterRequirement']) => {
    const count = water === 'low' ? 1 : water === 'medium' ? 2 : 3;
    return (
      <div className="flex gap-0.5">
        {[...Array(3)].map((_, i) => (
          <Droplets key={i} className={`w-4 h-4 ${i < count ? 'text-water' : 'text-muted'}`} />
        ))}
      </div>
    );
  };

  return (
    <div className="card-agri p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent" />
          {t('recommendations.title')}
        </h3>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          {t('recommendations.pdfReport')}
        </Button>
      </div>
      <div className="space-y-3">
        {recommendations.map((crop, index) => (
          <div key={crop.name} className="border border-border rounded-xl overflow-hidden transition-all hover:shadow-md">
            <button
              onClick={() => setExpandedCrop(expandedCrop === crop.name ? null : crop.name)}
              className="w-full p-4 flex items-center gap-4 text-left hover:bg-muted/50 transition-colors"
            >
              <div className="w-8 h-8 rounded-full gradient-hero flex items-center justify-center text-primary-foreground font-bold text-sm flex-shrink-0">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-foreground">{crop.name}</span>
                  <span className={`score-badge ${getScoreColor(crop.suitabilityScore)}`}>
                    {crop.suitabilityScore}% {t('recommendations.match')}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" />₹{crop.profitMargin.toLocaleString()}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{crop.growthDuration} {t('recommendations.days')}</span>
                </div>
              </div>
              {expandedCrop === crop.name ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
            </button>
            {expandedCrop === crop.name && (
              <div className="px-4 pb-4 pt-0 border-t border-border bg-muted/30 animate-fade-in">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 mb-4">
                  <div className="text-center p-3 bg-background rounded-xl">
                    <div className="text-2xl font-bold text-primary">{crop.expectedYield}</div>
                    <div className="text-xs text-muted-foreground">{t('recommendations.tonsPerAcre')}</div>
                  </div>
                  <div className="text-center p-3 bg-background rounded-xl">
                    <div className="text-2xl font-bold text-accent">₹{(crop.profitMargin / 1000).toFixed(0)}K</div>
                    <div className="text-xs text-muted-foreground">{t('recommendations.estProfit')}</div>
                  </div>
                  <div className="text-center p-3 bg-background rounded-xl">
                    <div className="text-2xl font-bold text-primary">{crop.sustainabilityScore}%</div>
                    <div className="text-xs text-muted-foreground">{t('recommendations.sustainabilityLabel')}</div>
                  </div>
                  <div className="text-center p-3 bg-background rounded-xl">
                    {getWaterIcon(crop.waterRequirement)}
                    <div className="text-xs text-muted-foreground mt-1 capitalize">{crop.waterRequirement} {t('recommendations.water')}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-4 h-4 text-muted-foreground" />
                  {getRiskBadge(crop.riskLevel)}
                </div>
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="font-medium text-sm text-primary">{t('recommendations.whyThisCrop')}</span>
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed">{crop.reasoning}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
