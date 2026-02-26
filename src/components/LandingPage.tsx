import { Leaf, TrendingUp, Cloud, Globe, Mic, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-farm.jpg';
import { useTranslation } from 'react-i18next';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

const supportedLangs = [
  { code: 'en', nativeName: 'English' },
  { code: 'hi', nativeName: 'हिंदी' },
  { code: 'kn', nativeName: 'ಕನ್ನಡ' },
];

export function LandingPage({ onGetStarted, onLogin }: LandingPageProps) {
  const { t, i18n } = useTranslation();

  const features = [
    { icon: <Leaf className="w-8 h-8" />, title: t('landing.features.aiCrop'), description: t('landing.features.aiCropDesc') },
    { icon: <Globe className="w-8 h-8" />, title: t('landing.features.satellite'), description: t('landing.features.satelliteDesc') },
    { icon: <Cloud className="w-8 h-8" />, title: t('landing.features.weather'), description: t('landing.features.weatherDesc') },
    { icon: <TrendingUp className="w-8 h-8" />, title: t('landing.features.market'), description: t('landing.features.marketDesc') },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center">
              <Leaf className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl text-foreground">{t('app.name')}</span>
          </div>
          
          <div className="flex items-center gap-3">
            <select
              value={i18n.language}
              onChange={(e) => i18n.changeLanguage(e.target.value)}
              className="h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {supportedLangs.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.nativeName}
                </option>
              ))}
            </select>
            <Button variant="ghost" size="icon" className="text-primary">
              <Mic className="w-5 h-5" />
            </Button>
            <Button variant="outline" onClick={onLogin} className="hidden sm:flex">
              <LogIn className="w-4 h-4 mr-2" />
              {t('nav.login')}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/85 via-primary/75 to-primary/90" />
        </div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 bg-primary-foreground rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-48 h-48 bg-primary-foreground rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 text-primary-foreground text-sm mb-6">
              <Leaf className="w-4 h-4" />
              <span>{t('landing.badge')}</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
              {t('app.name')}
              <span className="block text-2xl md:text-3xl font-medium mt-2 opacity-90">
                {t('app.tagline')}
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              {t('app.subtitle')}. {t('app.heroDescription')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero-outline" size="xl" onClick={onGetStarted}>
                {t('landing.getStarted')}
              </Button>
              <Button 
                variant="ghost" 
                size="xl" 
                className="text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Mic className="w-5 h-5 mr-2" />
                {t('landing.askVoice')}
              </Button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="hsl(var(--background))"/>
          </svg>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t('landing.smartFarming')}</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{t('landing.smartFarmingDesc')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="card-agri p-6 text-center group" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl gradient-hero flex items-center justify-center text-primary-foreground group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">{t('landing.readyTransform')}</h2>
            <p className="text-muted-foreground mb-8">{t('landing.readyTransformDesc')}</p>
            <Button variant="hero" size="xl" onClick={onGetStarted}>{t('landing.startFree')}</Button>
          </div>
        </div>
      </section>

      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>{t('app.copyright')}</p>
        </div>
      </footer>
    </div>
  );
}
