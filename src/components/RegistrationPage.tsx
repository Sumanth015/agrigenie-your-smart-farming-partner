import { useState } from 'react';
import { ArrowLeft, ArrowRight, MapPin, Leaf, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

interface RegistrationPageProps {
  onComplete: () => void;
  onBack: () => void;
}

const supportedLangs = [
  { code: 'en', nativeName: 'English', name: 'English' },
  { code: 'hi', nativeName: 'हिंदी', name: 'Hindi' },
  { code: 'kn', nativeName: 'ಕನ್ನಡ', name: 'Kannada' },
];

export function RegistrationPage({ onComplete, onBack }: RegistrationPageProps) {
  const { t, i18n } = useTranslation();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    village: '',
    district: '',
    state: '',
    farmSize: '',
    farmUnit: 'acres',
    soilType: '',
    language: i18n.language,
    pastCrops: [] as string[],
  });

  const soilTypes = ['Clay', 'Sandy', 'Loamy', 'Silty', 'Peaty', 'Chalky', 'Black Cotton'];
  const commonCrops = ['Rice', 'Wheat', 'Cotton', 'Sugarcane', 'Maize', 'Groundnut', 'Soybean', 'Pulses'];

  const updateField = (field: string, value: string | string[]) => {
    setFormData({ ...formData, [field]: value });
    if (field === 'language' && typeof value === 'string') {
      i18n.changeLanguage(value);
    }
  };

  const toggleCrop = (crop: string) => {
    const crops = formData.pastCrops.includes(crop)
      ? formData.pastCrops.filter(c => c !== crop)
      : [...formData.pastCrops, crop];
    updateField('pastCrops', crops);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">{t('register.fullName')}</label>
              <input type="text" value={formData.name} onChange={(e) => updateField('name', e.target.value)} placeholder={t('register.enterName')} className="w-full h-12 px-4 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">{t('register.mobile')}</label>
              <input type="tel" value={formData.mobile} onChange={(e) => updateField('mobile', e.target.value)} placeholder="+91 XXXXX XXXXX" className="w-full h-12 px-4 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">{t('register.preferredLanguage')}</label>
              <select value={formData.language} onChange={(e) => updateField('language', e.target.value)} className="w-full h-12 px-4 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                {supportedLangs.map((lang) => (
                  <option key={lang.code} value={lang.code}>{lang.nativeName} ({lang.name})</option>
                ))}
              </select>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-muted mb-4">
              <div className="flex items-center gap-2 text-primary mb-2">
                <MapPin className="w-5 h-5" />
                <span className="font-medium">{t('register.farmLocation')}</span>
              </div>
              <p className="text-sm text-muted-foreground">{t('register.locationNote')}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">{t('register.village')}</label>
              <input type="text" value={formData.village} onChange={(e) => updateField('village', e.target.value)} placeholder={t('register.enterVillage')} className="w-full h-12 px-4 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">{t('register.district')}</label>
                <input type="text" value={formData.district} onChange={(e) => updateField('district', e.target.value)} placeholder={t('register.district')} className="w-full h-12 px-4 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">{t('register.state')}</label>
                <input type="text" value={formData.state} onChange={(e) => updateField('state', e.target.value)} placeholder={t('register.state')} className="w-full h-12 px-4 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">{t('register.farmSize')}</label>
                <input type="number" value={formData.farmSize} onChange={(e) => updateField('farmSize', e.target.value)} placeholder={t('register.farmSize')} className="w-full h-12 px-4 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">{t('register.unit')}</label>
                <select value={formData.farmUnit} onChange={(e) => updateField('farmUnit', e.target.value)} className="w-full h-12 px-4 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="acres">{t('register.acres')}</option>
                  <option value="hectares">{t('register.hectares')}</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">{t('register.soilType')}</label>
              <div className="flex flex-wrap gap-2">
                {soilTypes.map((soil) => (
                  <button key={soil} onClick={() => updateField('soilType', soil)} className={`px-4 py-2 rounded-full text-sm transition-colors ${formData.soilType === soil ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
                    {soil}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">{t('register.pastCrops')}</label>
              <div className="flex flex-wrap gap-2">
                {commonCrops.map((crop) => (
                  <button key={crop} onClick={() => toggleCrop(crop)} className={`px-4 py-2 rounded-full text-sm transition-colors flex items-center gap-1 ${formData.pastCrops.includes(crop) ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
                    {formData.pastCrops.includes(crop) && <Check className="w-3 h-3" />}
                    {crop}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="h-16 flex items-center px-4 border-b border-border">
        <button onClick={step > 1 ? () => setStep(step - 1) : onBack} className="w-10 h-10 rounded-xl hover:bg-muted flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div className="flex-1 text-center">
          <span className="font-semibold text-foreground">{t('register.title')}</span>
        </div>
        <div className="w-10" />
      </header>
      <div className="px-4 pt-6">
        <div className="flex items-center gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex-1"><div className={`w-full h-2 rounded-full transition-colors ${s <= step ? 'bg-primary' : 'bg-muted'}`} /></div>
          ))}
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {step === 1 && t('register.personalDetails')}
          {step === 2 && t('register.farmLocation')}
          {step === 3 && t('register.farmDetails')}
        </h2>
        <p className="text-muted-foreground mb-6">
          {step === 1 && t('register.personalSub')}
          {step === 2 && t('register.locationSub')}
          {step === 3 && t('register.detailsSub')}
        </p>
      </div>
      <div className="flex-1 px-4 pb-4 overflow-y-auto">{renderStep()}</div>
      <div className="p-4 border-t border-border">
        <Button variant="farmer" className="w-full" onClick={() => { if (step < 3) setStep(step + 1); else onComplete(); }}>
          {step < 3 ? (<>{t('register.continue')}<ArrowRight className="w-5 h-5 ml-2" /></>) : (<><Leaf className="w-5 h-5 mr-2" />{t('register.complete')}</>)}
        </Button>
      </div>
    </div>
  );
}
