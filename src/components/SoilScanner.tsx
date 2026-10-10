import { useRef, useState } from 'react';
import {
  Camera, Upload, Loader2, Sparkles, Droplets, FlaskConical, Leaf,
  Sprout, RefreshCw, AlertCircle, CheckCircle2, TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { useLocation } from '@/hooks/useLocation';
import { useAuth } from '@/hooks/useAuth';

interface RecommendedCrop {
  name: string;
  suitability: number;
  reason: string;
  season: string;
}

interface SoilScanResult {
  soilType: string;
  moistureLevel: 'Dry' | 'Low' | 'Moderate' | 'Wet';
  moisturePercent: number;
  estimatedPH: string;
  color: string;
  texture: string;
  organicMatter: 'Low' | 'Medium' | 'High';
  fertility: 'Poor' | 'Moderate' | 'Good' | 'Excellent';
  confidence: number;
  observations: string;
  recommendedCrops: RecommendedCrop[];
  improvementTips: string[];
}

export function SoilScanner() {
  const { i18n } = useTranslation();
  const { location } = useLocation();
  const { user } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<SoilScanResult | null>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image too large (max 10MB)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
      setResult(null);
    };
    reader.readAsDataURL(file);
  };

  const scanSoil = async () => {
    if (!imagePreview) {
      toast.error('Please capture or upload a soil image first');
      return;
    }
    setScanning(true);
    try {
      const functionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/scan-soil`;
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({
          imageBase64: imagePreview,
          language: i18n.language,
          location: { state: location?.state, district: location?.district },
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Soil scan failed');
      if (data.error) throw new Error(data.error);

      setResult(data);
      toast.success('Soil analysis complete!');

      // Save to soil_data table for use across the dashboard
      if (user) {
        const phMatch = data.estimatedPH?.match(/(\d+\.?\d*)/);
        const ph = phMatch ? parseFloat(phMatch[1]) : null;
        const { error: soilError } = await supabase.from('soil_data').insert({
          user_id: user.id,
          ph,
          moisture: data.moisturePercent,
          soil_type: data.soilType,
          source: 'scan',
        });
        const { error: notificationError } = await supabase.from('notifications').insert({
          user_id: user.id,
          type: 'fertilizer',
          title: 'Soil Scan Complete',
          message: `Detected ${data.soilType} soil with ${data.moistureLevel.toLowerCase()} moisture. Top crop: ${data.recommendedCrops[0]?.name}.`,
        });
        if (soilError || notificationError) {
          console.warn('Soil scan analyzed, but dashboard sync failed:', soilError || notificationError);
        }
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Soil scan failed');
    } finally {
      setScanning(false);
    }
  };

  const reset = () => {
    setImagePreview(null);
    setResult(null);
  };

  const moistureColor = {
    Dry: 'text-orange-500',
    Low: 'text-yellow-500',
    Moderate: 'text-primary',
    Wet: 'text-blue-500',
  };

  const fertilityBadge = {
    Poor: 'score-low',
    Moderate: 'score-medium',
    Good: 'score-high',
    Excellent: 'score-high',
  };

  return (
    <div className="space-y-6">
      <div className="card-agri p-5">
        <div className="flex items-center gap-2 mb-2">
          <Sprout className="w-6 h-6 text-primary" />
          <h2 className="font-bold text-xl text-foreground">Soil Scanner</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-5">
          Capture or upload a clear photo of your soil. AI will identify soil type, moisture, and recommend the best crops in real time.
        </p>

        {!imagePreview ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => cameraRef.current?.click()}
              className="border-2 border-dashed border-border hover:border-primary rounded-xl p-8 flex flex-col items-center justify-center gap-2 transition-colors hover:bg-primary/5"
            >
              <Camera className="w-10 h-10 text-primary" />
              <span className="font-medium text-foreground">Take Photo</span>
              <span className="text-xs text-muted-foreground">Use device camera</span>
            </button>
            <button
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-border hover:border-primary rounded-xl p-8 flex flex-col items-center justify-center gap-2 transition-colors hover:bg-primary/5"
            >
              <Upload className="w-10 h-10 text-primary" />
              <span className="font-medium text-foreground">Upload Image</span>
              <span className="text-xs text-muted-foreground">Choose from gallery</span>
            </button>
            <input
              ref={cameraRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative rounded-xl overflow-hidden bg-muted">
              <img src={imagePreview} alt="Soil sample" className="w-full max-h-80 object-cover" />
            </div>
            <div className="flex gap-3">
              <Button onClick={scanSoil} disabled={scanning} className="flex-1">
                {scanning ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Analyzing soil...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Scan & Recommend
                  </>
                )}
              </Button>
              <Button onClick={reset} variant="outline" disabled={scanning}>
                <RefreshCw className="w-4 h-4 mr-2" />
                New
              </Button>
            </div>
          </div>
        )}
      </div>

      {result && (
        <>
          {/* Soil properties */}
          <div className="card-agri p-5 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-lg text-foreground">Soil Properties</h3>
              </div>
              <span className="score-badge score-high text-xs">
                {result.confidence}% confidence
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              <div className="p-3 rounded-xl bg-muted text-center">
                <Leaf className="w-5 h-5 mx-auto text-primary mb-1" />
                <div className="text-sm font-bold text-foreground">{result.soilType}</div>
                <div className="text-xs text-muted-foreground">Soil Type</div>
              </div>
              <div className="p-3 rounded-xl bg-muted text-center">
                <Droplets className={`w-5 h-5 mx-auto mb-1 ${moistureColor[result.moistureLevel]}`} />
                <div className="text-sm font-bold text-foreground">{result.moisturePercent}%</div>
                <div className="text-xs text-muted-foreground">{result.moistureLevel} Moisture</div>
              </div>
              <div className="p-3 rounded-xl bg-muted text-center">
                <FlaskConical className="w-5 h-5 mx-auto text-primary mb-1" />
                <div className="text-sm font-bold text-foreground">{result.estimatedPH}</div>
                <div className="text-xs text-muted-foreground">pH Range</div>
              </div>
              <div className="p-3 rounded-xl bg-muted text-center">
                <CheckCircle2 className="w-5 h-5 mx-auto text-accent mb-1" />
                <div className={`score-badge text-xs ${fertilityBadge[result.fertility]}`}>{result.fertility}</div>
                <div className="text-xs text-muted-foreground mt-1">Fertility</div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm mb-4">
              <div><span className="text-muted-foreground">Color:</span> <span className="text-foreground font-medium">{result.color}</span></div>
              <div><span className="text-muted-foreground">Texture:</span> <span className="text-foreground font-medium">{result.texture}</span></div>
              <div><span className="text-muted-foreground">Organic Matter:</span> <span className="text-foreground font-medium">{result.organicMatter}</span></div>
            </div>

            <div className="p-3 rounded-xl bg-primary/5 border border-primary/20">
              <p className="text-sm text-foreground/80 leading-relaxed">{result.observations}</p>
            </div>
          </div>

          {/* Recommended crops */}
          <div className="card-agri p-5 animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-accent" />
              <h3 className="font-semibold text-lg text-foreground">Recommended Crops</h3>
            </div>
            <div className="space-y-3">
              {result.recommendedCrops.map((crop, idx) => (
                <div key={crop.name} className="p-4 rounded-xl border border-border hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full gradient-hero flex items-center justify-center text-primary-foreground font-bold text-sm flex-shrink-0">
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                        <span className="font-semibold text-foreground">{crop.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">{crop.season}</span>
                          <span className="score-badge score-high text-xs">
                            <TrendingUp className="w-3 h-3 inline mr-1" />
                            {crop.suitability}%
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{crop.reason}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Improvement tips */}
          {result.improvementTips.length > 0 && (
            <div className="card-agri p-5 animate-fade-in">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-5 h-5 text-accent" />
                <h3 className="font-semibold text-lg text-foreground">Soil Improvement Tips</h3>
              </div>
              <ul className="space-y-2">
                {result.improvementTips.map((tip, i) => (
                  <li key={i} className="flex gap-2 text-sm text-foreground/80">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}
