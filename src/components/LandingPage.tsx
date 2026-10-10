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

      {/* Happy Farmers Gallery Section */}
      <section className="py-16 md:py-24 bg-secondary/30 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3.5 py-1.5 rounded-full inline-block mb-3">
              🌾 Real Impact, Real Farmers
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">
              Happy Farmers Across India
            </h2>
            <p className="text-muted-foreground text-lg">
              Over 25,000+ farmers rely on AgriGenie to protect crops, conserve water, and increase farm profits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Farmer 1 */}
            <div className="card-agri overflow-hidden rounded-2xl flex flex-col border border-border hover:shadow-xl transition-all">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src="/images/farmers/farmer_ramesh.jpg"
                  alt="Ramesh Gowda"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute top-3 right-3 bg-emerald-600 text-white font-bold text-xs px-2.5 py-1 rounded-full">
                  +48% Yield
                </div>
                <div className="absolute bottom-3 left-3 text-white">
                  <h4 className="font-bold text-lg">Ramesh Gowda</h4>
                  <p className="text-xs text-white/90">Mandya, Karnataka • Paddy</p>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <p className="text-xs text-muted-foreground italic">
                  "AgriGenie’s weather alert saved my paddy crop right before unseasonal rains. Highest yield in 15 years!"
                </p>
                <div className="pt-2 border-t border-border flex justify-between items-center text-xs font-semibold text-primary">
                  <span>+₹54,000 Extra Profit/Acre</span>
                  <span className="text-yellow-500">★★★★★</span>
                </div>
              </div>
            </div>

            {/* Farmer 2 */}
            <div className="card-agri overflow-hidden rounded-2xl flex flex-col border border-border hover:shadow-xl transition-all">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src="/images/farmers/farmer_sunita.jpg"
                  alt="Sunita Patil"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute top-3 right-3 bg-emerald-600 text-white font-bold text-xs px-2.5 py-1 rounded-full">
                  +42% Yield
                </div>
                <div className="absolute bottom-3 left-3 text-white">
                  <h4 className="font-bold text-lg">Sunita Patil</h4>
                  <p className="text-xs text-white/90">Nashik, Maharashtra • Vegetables</p>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <p className="text-xs text-muted-foreground italic">
                  "The AI disease detector caught tomato blight within seconds. The organic treatment saved our whole harvest."
                </p>
                <div className="pt-2 border-t border-border flex justify-between items-center text-xs font-semibold text-primary">
                  <span>+₹68,500 Extra Profit/Acre</span>
                  <span className="text-yellow-500">★★★★★</span>
                </div>
              </div>
            </div>

            {/* Farmer 3 */}
            <div className="card-agri overflow-hidden rounded-2xl flex flex-col border border-border hover:shadow-xl transition-all">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src="/images/farmers/farmer_couple.jpg"
                  alt="Anand & Meena Murugan"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute top-3 right-3 bg-emerald-600 text-white font-bold text-xs px-2.5 py-1 rounded-full">
                  +52% Yield
                </div>
                <div className="absolute bottom-3 left-3 text-white">
                  <h4 className="font-bold text-lg">Anand & Meena</h4>
                  <p className="text-xs text-white/90">Coimbatore, Tamil Nadu • Chilli</p>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <p className="text-xs text-muted-foreground italic">
                  "Smart drip irrigation cut our power bills by half and doubled the quality and red color of our chilli harvest."
                </p>
                <div className="pt-2 border-t border-border flex justify-between items-center text-xs font-semibold text-primary">
                  <span>45% Water Conserved</span>
                  <span className="text-yellow-500">★★★★★</span>
                </div>
              </div>
            </div>
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
