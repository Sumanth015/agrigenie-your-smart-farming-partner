import { Droplets, Leaf, Wind, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function SustainabilityCard() {
  const { t } = useTranslation();

  const metrics = [
    { label: t('sustainability.waterEfficiency'), value: 78, icon: Droplets, color: 'text-water' },
    { label: t('sustainability.soilHealth'), value: 72, icon: Leaf, color: 'text-primary' },
    { label: t('sustainability.carbonFootprint'), value: 65, icon: Wind, color: 'text-muted-foreground' },
  ];

  const suggestions = [t('sustainability.s1'), t('sustainability.s2'), t('sustainability.s3'), t('sustainability.s4')];

  return (
    <div className="card-agri p-5">
      <div className="flex items-center gap-2 mb-4">
        <Leaf className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-lg text-foreground">{t('sustainability.title')}</h3>
      </div>
      <div className="mb-6 p-4 rounded-xl bg-muted text-center">
        <div className="text-4xl font-bold text-primary mb-1">72%</div>
        <div className="text-sm text-muted-foreground">{t('sustainability.overall')}</div>
        <div className="w-full bg-background rounded-full h-3 mt-3">
          <div className="bg-primary h-3 rounded-full transition-all" style={{ width: '72%' }} />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-6">
        {metrics.map((metric, i) => (
          <div key={i} className="text-center p-3 rounded-xl bg-muted">
            <metric.icon className={`w-6 h-6 ${metric.color} mx-auto mb-2`} />
            <div className="text-xl font-bold text-foreground">{metric.value}%</div>
            <div className="text-xs text-muted-foreground">{metric.label}</div>
          </div>
        ))}
      </div>
      <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-primary" />
          <span className="font-medium text-sm text-primary">{t('sustainability.suggestions')}</span>
        </div>
        <ul className="space-y-2">
          {suggestions.map((suggestion, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
              {suggestion}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
