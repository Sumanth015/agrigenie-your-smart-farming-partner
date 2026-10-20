import { useState } from 'react';
import { 
  Leaf, TrendingUp, Cloud, Globe, Mic, LogIn, Sparkles, Activity, 
  ShieldCheck, ArrowRight, Zap, Play, CheckCircle2, Volume2, Cpu, Crosshair
} from 'lucide-react';
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
  const [activeDemoTab, setActiveDemoTab] = useState<'disease' | 'soil'>('disease');
  const [isScanning, setIsScanning] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);

  const triggerScanDemo = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 1800);
  };

  const features = [
    { 
      icon: <Leaf className="w-8 h-8" />, 
      title: t('landing.features.aiCrop'), 
      description: t('landing.features.aiCropDesc'),
      badge: 'Gemini 2.5 Vision'
    },
    { 
      icon: <Globe className="w-8 h-8" />, 
      title: t('landing.features.satellite'), 
      description: t('landing.features.satelliteDesc'),
      badge: 'Multispectral'
    },
    { 
      icon: <Cloud className="w-8 h-8" />, 
      title: t('landing.features.weather'), 
      description: t('landing.features.weatherDesc'),
      badge: 'Hyperlocal Doppler'
    },
    { 
      icon: <TrendingUp className="w-8 h-8" />, 
      title: t('landing.features.market'), 
      description: t('landing.features.marketDesc'),
      badge: 'APMC Live Rates'
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground cyber-grid overflow-hidden">
      {/* Live Agritech Telemetry Marquee Bar */}
      <div className="w-full bg-emerald-950/80 border-b border-emerald-800/40 text-emerald-300 py-1.5 px-4 text-xs font-mono flex items-center justify-between overflow-x-auto whitespace-nowrap z-50 backdrop-blur-md">
        <div className="flex items-center gap-6 animate-pulse-soft">
          <span className="flex items-center gap-1.5 font-semibold text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            TELEMETRY FEED
          </span>
          <span>🛰️ Sentinel-2 & Cartosat: LIVE</span>
          <span>•</span>
          <span>🌾 APMC Mandi Rates: Wheat ₹2,450/q (+14%) • Cotton ₹7,210/q (+6.8%)</span>
          <span>•</span>
          <span>⚡ AI Engine: Google Gemini 2.5 Flash Online</span>
          <span>•</span>
          <span>🌧️ Monsoon Radar: 78% Soil Saturation Window Detected</span>
        </div>
        <div className="hidden md:flex items-center gap-2 text-emerald-400 font-sans font-medium text-xs">
          <ShieldCheck className="w-3.5 h-3.5" /> 100% Free For Indian Farmers
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/70 transition-all">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-amber-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-foreground flex items-center gap-1.5">
                {t('app.name')}
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  AI 3.0
                </span>
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <select
              value={i18n.language}
              onChange={(e) => i18n.changeLanguage(e.target.value)}
              className="h-10 px-3 rounded-xl border border-border/80 bg-card text-xs md:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
            >
              {supportedLangs.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.nativeName}
                </option>
              ))}
            </select>

            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setVoiceActive(!voiceActive)}
              className={`rounded-xl border border-emerald-500/40 font-medium transition-all ${
                voiceActive 
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' 
                  : 'hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
              }`}
            >
              <Mic className="w-4 h-4 mr-1.5" />
              <span className="hidden sm:inline">{voiceActive ? 'Listening...' : 'Voice AI'}</span>
            </Button>

            <Button variant="outline" onClick={onLogin} className="hidden sm:flex rounded-xl font-medium">
              <LogIn className="w-4 h-4 mr-2" />
              {t('nav.login')}
            </Button>

            <Button 
              onClick={onGetStarted} 
              className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-600/20 font-semibold"
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Voice Assistant Floating Audio Visualizer Bar */}
      {voiceActive && (
        <div className="bg-emerald-900/90 border-b border-emerald-500/30 text-white py-3 px-4 z-40 backdrop-blur-md animate-scale-in">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500/30 flex items-center justify-center text-emerald-300">
                <Volume2 className="w-4 h-4 animate-bounce" />
              </div>
              <div>
                <p className="text-sm font-medium flex items-center gap-2">
                  <span>{i18n.language === 'hi' ? 'एग्रीजीनी आवाज़ सहायक तैयार है:' : i18n.language === 'kn' ? 'ಅಗ್ರಿದೂತ ಧ್ವನಿ ಸಹಾಯಕ ಸಿದ್ಧವಾಗಿದೆ:' : 'AgriGenie Voice Assistant Active:'}</span>
                  <span className="text-xs text-emerald-300 font-mono">"फसल रोग जांचें" / "Check soil health"</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              {[4, 12, 8, 16, 24, 14, 20, 8, 18, 10].map((h, i) => (
                <div 
                  key={i} 
                  className="w-1 bg-emerald-400 rounded-full" 
                  style={{ 
                    height: `${h}px`, 
                    animation: `soundWave 0.8s ease-in-out infinite alternate ${i * 0.1}s` 
                  }} 
                />
              ))}
              <Button size="sm" variant="ghost" onClick={() => setVoiceActive(false)} className="text-xs text-white/80 hover:text-white ml-2">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="pt-10 pb-20 md:pt-16 md:pb-28 relative overflow-hidden">
        {/* Background Ambient Glow Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[450px] aurora-glow pointer-events-none -z-10" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Hero Text & Badges */}
            <div className="lg:col-span-7 text-left space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs md:text-sm font-semibold shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Next-Gen Autonomous Agritech Powered by Gemini 2.5</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[1.12]">
                Turn Soil & Crops into{' '}
                <span className="text-gradient-shimmer block mt-1">
                  High-Yield Harvests.
                </span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
                Empowering India's farmers with instant <strong>AI soil spectroscopy</strong>, <strong>sub-millimeter leaf disease diagnosis</strong>, and <strong>real-time APMC Mandi market arbitrage</strong>.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Button 
                  size="xl" 
                  onClick={onGetStarted}
                  className="rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:opacity-95 text-white font-bold text-lg shadow-xl shadow-emerald-600/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
                >
                  <Zap className="w-5 h-5 fill-amber-300 text-amber-300" />
                  <span>{t('landing.getStarted')}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>

                <Button 
                  variant="outline" 
                  size="xl"
                  onClick={triggerScanDemo}
                  className="rounded-2xl border-2 border-emerald-600/30 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-foreground font-semibold text-lg flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <Play className="w-5 h-5 text-emerald-600 dark:text-emerald-400 fill-emerald-600/20" />
                  <span>Simulate AI Scan</span>
                </Button>
              </div>

              {/* Live Farmer Social Proof Counters */}
              <div className="pt-6 border-t border-border/60 grid grid-cols-3 gap-4">
                <div>
                  <div className="text-2xl md:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">98.4%</div>
                  <div className="text-xs text-muted-foreground font-medium mt-0.5">Diagnostic Accuracy</div>
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-extrabold text-amber-600 dark:text-amber-400 font-mono">3.2x</div>
                  <div className="text-xs text-muted-foreground font-medium mt-0.5">Higher Farm Margins</div>
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-extrabold text-teal-600 dark:text-teal-400 font-mono">19 States</div>
                  <div className="text-xs text-muted-foreground font-medium mt-0.5">Indian Agro-Zones</div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Holographic AI Scanner Console */}
            <div className="lg:col-span-5 relative">
              {/* Floating Live Telemetry Badge 1 */}
              <div className="absolute -top-6 -left-6 z-20 glass-panel-glow px-4 py-2.5 rounded-2xl flex items-center gap-3 animate-float-slow shadow-xl">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-medium">Mandi Arbitrage</div>
                  <div className="text-sm font-bold text-foreground font-mono">+₹4,200/Acre Surplus</div>
                </div>
              </div>

              {/* Floating Live Telemetry Badge 2 */}
              <div className="absolute -bottom-6 -right-6 z-20 glass-panel-glow px-4 py-2.5 rounded-2xl flex items-center gap-3 animate-float-reverse shadow-xl">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-medium">Soil Health Matrix</div>
                  <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono">Optimal N-P-K (94%)</div>
                </div>
              </div>

              {/* The Holographic Scanner Console */}
              <div className="rounded-3xl glass-panel-glow p-5 relative overflow-hidden border-2 border-emerald-500/30 shadow-2xl">
                
                {/* Console Header / Switcher */}
                <div className="flex items-center justify-between pb-4 border-b border-border/60">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-mono text-xs tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold uppercase">
                      Holographic HUD 2.5
                    </span>
                  </div>

                  <div className="flex rounded-xl bg-muted/80 p-1 border border-border/50 text-xs font-semibold">
                    <button
                      onClick={() => setActiveDemoTab('disease')}
                      className={`px-3 py-1 rounded-lg transition-all ${
                        activeDemoTab === 'disease' 
                          ? 'bg-emerald-600 text-white shadow-sm' 
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      🌱 Leaf Scan
                    </button>
                    <button
                      onClick={() => setActiveDemoTab('soil')}
                      className={`px-3 py-1 rounded-lg transition-all ${
                        activeDemoTab === 'soil' 
                          ? 'bg-emerald-600 text-white shadow-sm' 
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      🧪 Soil Scan
                    </button>
                  </div>
                </div>

                {/* Viewfinder Display Screen */}
                <div className="relative mt-4 rounded-2xl overflow-hidden aspect-[4/3] bg-zinc-950 flex items-center justify-center border border-emerald-500/40">
                  <img 
                    src={heroImage} 
                    alt="Agricultural scan preview" 
                    loading="eager"
                    decoding="async"
                    className={`w-full h-full object-cover transition-transform duration-700 ${
                      isScanning ? 'scale-105 filter brightness-110' : 'scale-100'
                    }`}
                  />
                  
                  {/* Viewfinder Overlays & Crosshairs */}
                  <div className="absolute inset-0 bg-emerald-950/30 backdrop-contrast-125 pointer-events-none" />

                  {/* Corner Target Brackets */}
                  <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-emerald-400" />
                  <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-emerald-400" />
                  <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-emerald-400" />
                  <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-emerald-400" />
                  
                  {/* Center Target Reticle */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <Crosshair className={`w-12 h-12 text-emerald-400/70 transition-transform ${isScanning ? 'animate-spin' : ''}`} />
                  </div>

                  {/* The Laser Scan Line */}
                  <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#34d399] animate-laser pointer-events-none" />

                  {/* Status Overlay Badge */}
                  <div className="absolute bottom-3 left-3 right-3 bg-zinc-900/90 backdrop-blur-md rounded-xl p-3 border border-emerald-500/40 text-left">
                    {activeDemoTab === 'disease' ? (
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            DIAGNOSIS COMPLETE
                          </span>
                          <span className="text-xs font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                            97.8% Confidence
                          </span>
                        </div>
                        <div className="text-sm font-bold text-white mt-1">Tomato Leaf: Early Blight (Alternaria solani)</div>
                        <div className="text-xs text-zinc-300 mt-0.5 line-clamp-1">
                          Rx: Apply organic copper fungicide + neem foliar spray early morning.
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono text-amber-400 font-bold flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                            SOIL COMPOSITION VERIFIED
                          </span>
                          <span className="text-xs font-mono bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold">
                            pH 6.8 • Loamy Red
                          </span>
                        </div>
                        <div className="text-sm font-bold text-white mt-1">Top Recommendation: Groundnut & Cotton</div>
                        <div className="text-xs text-zinc-300 mt-0.5 line-clamp-1">
                          Moisture: 44% (Optimal) • Add 2t/acre FYM for nitrogen boost.
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Console Footer Action */}
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground font-mono">
                  <span className="flex items-center gap-1">
                    <Cpu className="w-3.5 h-3.5 text-emerald-500" />
                    Model: Gemini-2.5-Vision
                  </span>
                  <button 
                    onClick={triggerScanDemo}
                    className="text-emerald-600 dark:text-emerald-400 hover:underline font-bold"
                  >
                    {isScanning ? 'Scanning pixels...' : 'Re-run analysis ↺'}
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Futuristic Feature Matrix */}
      <section className="py-20 bg-muted/40 relative border-t border-border/70">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-3 uppercase tracking-wider">
              Autonomous Farm Intelligence
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-foreground mb-4 tracking-tight">
              Everything Your Farm Needs to Thrive
            </h2>
            <p className="text-muted-foreground text-lg">
              Replacing guesswork with real-time agronomic AI, satellite meteorological tracking, and direct marketplace pricing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="glass-panel p-7 rounded-3xl text-left relative group hover:border-emerald-500/60 hover:-translate-y-1.5 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-emerald-500/10"
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-600/20 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    {feature.badge}
                  </span>
                </div>
                
                <h3 className="font-bold text-xl text-foreground mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 p-10 md:p-16 text-center text-white relative shadow-2xl border border-emerald-500/30 overflow-hidden">
            <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: `url(${heroImage})` }} />
            
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <span className="px-3.5 py-1.5 rounded-full bg-emerald-400/20 text-emerald-300 font-bold text-xs uppercase tracking-wider border border-emerald-400/30">
                100% Free • Open to All Farmers
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
                {t('landing.readyTransform')}
              </h2>
              <p className="text-emerald-100 text-lg opacity-90">
                Join thousands of progressive farmers across India maximizing their crop harvest and soil vitality today.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="xl" 
                  onClick={onGetStarted}
                  className="rounded-2xl bg-white text-emerald-950 hover:bg-emerald-50 font-bold text-lg shadow-xl shadow-black/20"
                >
                  {t('landing.startFree')}
                </Button>
                <Button 
                  variant="outline" 
                  size="xl" 
                  onClick={onLogin}
                  className="rounded-2xl border-2 border-white/40 text-white hover:bg-white/10 font-semibold text-lg"
                >
                  {t('nav.login')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border/80 bg-background/50">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between text-muted-foreground text-xs gap-4">
          <div className="flex items-center gap-2">
            <Leaf className="w-4 h-4 text-emerald-500" />
            <span className="font-semibold text-foreground">AgriGenie</span> — Smart Farming Partner for India
          </div>
          <p>{t('app.copyright')}</p>
        </div>
      </footer>
    </div>
  );
}
