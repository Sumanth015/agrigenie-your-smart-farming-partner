import { useState } from 'react';
import { ArrowLeft, ArrowRight, MapPin, Leaf, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { languages } from '@/data/mockData';

interface RegistrationPageProps {
  onComplete: () => void;
  onBack: () => void;
}

export function RegistrationPage({ onComplete, onBack }: RegistrationPageProps) {
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
    language: 'en',
    pastCrops: [] as string[],
  });

  const soilTypes = ['Clay', 'Sandy', 'Loamy', 'Silty', 'Peaty', 'Chalky', 'Black Cotton'];
  const commonCrops = ['Rice', 'Wheat', 'Cotton', 'Sugarcane', 'Maize', 'Groundnut', 'Soybean', 'Pulses'];

  const updateField = (field: string, value: string | string[]) => {
    setFormData({ ...formData, [field]: value });
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
              <label className="block text-sm font-medium text-foreground mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="Enter your name"
                className="w-full h-12 px-4 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Mobile Number
              </label>
              <input
                type="tel"
                value={formData.mobile}
                onChange={(e) => updateField('mobile', e.target.value)}
                placeholder="+91 XXXXX XXXXX"
                className="w-full h-12 px-4 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Preferred Language
              </label>
              <select
                value={formData.language}
                onChange={(e) => updateField('language', e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.nativeName} ({lang.name})
                  </option>
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
                <span className="font-medium">Farm Location</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Enter your farm location for accurate satellite data
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Village
              </label>
              <input
                type="text"
                value={formData.village}
                onChange={(e) => updateField('village', e.target.value)}
                placeholder="Enter village name"
                className="w-full h-12 px-4 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  District
                </label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) => updateField('district', e.target.value)}
                  placeholder="District"
                  className="w-full h-12 px-4 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  State
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => updateField('state', e.target.value)}
                  placeholder="State"
                  className="w-full h-12 px-4 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Farm Size
                </label>
                <input
                  type="number"
                  value={formData.farmSize}
                  onChange={(e) => updateField('farmSize', e.target.value)}
                  placeholder="Size"
                  className="w-full h-12 px-4 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Unit
                </label>
                <select
                  value={formData.farmUnit}
                  onChange={(e) => updateField('farmUnit', e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="acres">Acres</option>
                  <option value="hectares">Hectares</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Soil Type (if known)
              </label>
              <div className="flex flex-wrap gap-2">
                {soilTypes.map((soil) => (
                  <button
                    key={soil}
                    onClick={() => updateField('soilType', soil)}
                    className={`px-4 py-2 rounded-full text-sm transition-colors ${
                      formData.soilType === soil
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {soil}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Past Crops Grown (Select all that apply)
              </label>
              <div className="flex flex-wrap gap-2">
                {commonCrops.map((crop) => (
                  <button
                    key={crop}
                    onClick={() => toggleCrop(crop)}
                    className={`px-4 py-2 rounded-full text-sm transition-colors flex items-center gap-1 ${
                      formData.pastCrops.includes(crop)
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
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
      {/* Header */}
      <header className="h-16 flex items-center px-4 border-b border-border">
        <button
          onClick={step > 1 ? () => setStep(step - 1) : onBack}
          className="w-10 h-10 rounded-xl hover:bg-muted flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div className="flex-1 text-center">
          <span className="font-semibold text-foreground">Register</span>
        </div>
        <div className="w-10" />
      </header>

      {/* Progress */}
      <div className="px-4 pt-6">
        <div className="flex items-center gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex-1 flex items-center gap-2">
              <div className={`w-full h-2 rounded-full transition-colors ${
                s <= step ? 'bg-primary' : 'bg-muted'
              }`} />
            </div>
          ))}
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {step === 1 && 'Personal Details'}
          {step === 2 && 'Farm Location'}
          {step === 3 && 'Farm Details'}
        </h2>
        <p className="text-muted-foreground mb-6">
          {step === 1 && 'Tell us about yourself'}
          {step === 2 && 'Where is your farm located?'}
          {step === 3 && 'Help us understand your farm better'}
        </p>
      </div>

      {/* Form */}
      <div className="flex-1 px-4 pb-4 overflow-y-auto">
        {renderStep()}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <Button
          variant="farmer"
          className="w-full"
          onClick={() => {
            if (step < 3) {
              setStep(step + 1);
            } else {
              onComplete();
            }
          }}
        >
          {step < 3 ? (
            <>
              Continue
              <ArrowRight className="w-5 h-5 ml-2" />
            </>
          ) : (
            <>
              <Leaf className="w-5 h-5 mr-2" />
              Complete Registration
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
