import { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, Camera, Image as ImageIcon, AlertCircle, CheckCircle2, Loader2, Video, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DiseaseDetection } from '@/types/agrigenie';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function DiseaseDetector() {
  const { t, i18n } = useTranslation();
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<DiseaseDetection | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraOpen(false);
  }, []);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      setCameraOpen(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }, 100);
    } catch (err) {
      console.error('Camera error:', err);
      setCameraError(t('disease.cameraError'));
    }
  };

  const captureFrame = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setImage(dataUrl);
      setResult(null);
      stopCamera();
      analyzeImage(dataUrl);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setImage(dataUrl);
        setResult(null);
        analyzeImage(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async (imageData: string) => {
    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('detect-disease', {
        body: { imageBase64: imageData, language: i18n.language },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setResult(data as DiseaseDetection);
    } catch (err: any) {
      console.error('Disease detection error:', err);
      toast.error(err?.message || 'Failed to analyze image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="card-agri p-5">
      <div className="flex items-center gap-2 mb-4">
        <ImageIcon className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-lg text-foreground">{t('disease.title')}</h3>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleImageUpload}
        className="hidden"
      />

      {cameraError && (
        <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {cameraError}
        </div>
      )}

      {/* Live Camera View */}
      {cameraOpen && (
        <div className="space-y-3 mb-4">
          <div className="relative rounded-xl overflow-hidden bg-muted aspect-video">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-3">
              <Button variant="default" size="lg" onClick={captureFrame} className="rounded-full w-16 h-16">
                <Camera className="w-8 h-8" />
              </Button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 bg-background/60 hover:bg-background/80"
              onClick={stopCamera}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
      )}

      {!image && !cameraOpen ? (
        <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <Upload className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground mb-4">
            {t('disease.uploadPrompt')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              {t('disease.uploadImage')}
            </Button>
            <Button
              variant="default"
              onClick={startCamera}
            >
              <Video className="w-4 h-4 mr-2" />
              {t('disease.openCamera')}
            </Button>
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera className="w-4 h-4 mr-2" />
              {t('disease.takePhoto')}
            </Button>
          </div>
        </div>
      ) : image ? (
        <div className="space-y-4">
          {/* Preview Image */}
          <div className="relative rounded-xl overflow-hidden bg-muted aspect-video">
            <img
              src={image}
              alt="Uploaded crop"
              className="w-full h-full object-cover"
            />
            {isAnalyzing && (
              <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                <div className="text-center">
                  <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-3" />
                  <p className="text-sm text-foreground">{t('disease.analyzing')}</p>
                </div>
              </div>
            )}
          </div>

          {/* Results */}
          {result && (
            <div className="space-y-4 animate-fade-in">
              {/* Disease Name */}
               <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs text-muted-foreground mb-0.5">🌿 {t('disease.plantName')}</div>
                    <div className="font-semibold text-foreground">{result.plantName}</div>
                    <div className="text-xs text-muted-foreground mt-2 mb-0.5">🦠 {t('disease.diseaseName')}</div>
                    <div className="font-semibold text-destructive">{result.diseaseName}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      📊 {t('disease.confidence')}: {result.confidence}%
                    </div>
                    {result.description && (
                      <p className="text-sm text-foreground/80 mt-2">{result.description}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Treatment */}
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                <div className="font-medium text-primary mb-2">💊 {t('disease.treatment')}</div>
                <p className="text-sm text-foreground/80">{result.treatment}</p>
              </div>

              {/* Prevention */}
              <div className="p-4 rounded-xl bg-muted">
                <div className="font-medium text-foreground mb-2">{t('disease.prevention')}</div>
                <ul className="space-y-2">
                  {result.prevention.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              {/* New Scan Button */}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setImage(null);
                  setResult(null);
                }}
              >
                {t('disease.scanAnother')}
              </Button>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
