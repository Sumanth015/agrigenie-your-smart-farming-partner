import { useState, useRef } from 'react';
import { Upload, Camera, Image as ImageIcon, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DiseaseDetection } from '@/types/agrigenie';

export function DiseaseDetector() {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<DiseaseDetection | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
        analyzeImage();
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      setResult({
        diseaseName: 'Bacterial Leaf Blight',
        confidence: 87,
        treatment: 'Apply copper-based bactericide (3g/L). Remove and destroy infected leaves. Ensure proper field drainage.',
        prevention: [
          'Use disease-free seeds',
          'Avoid excess nitrogen fertilizer',
          'Maintain proper plant spacing',
          'Avoid overhead irrigation',
        ],
      });
      setIsAnalyzing(false);
    }, 2500);
  };

  return (
    <div className="card-agri p-5">
      <div className="flex items-center gap-2 mb-4">
        <ImageIcon className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-lg text-foreground">Disease Detection</h3>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleImageUpload}
        className="hidden"
      />

      {!image ? (
        <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <Upload className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground mb-4">
            Upload or capture a photo of your crop to detect diseases
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Image
            </Button>
            <Button
              variant="default"
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera className="w-4 h-4 mr-2" />
              Take Photo
            </Button>
          </div>
        </div>
      ) : (
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
                  <p className="text-sm text-foreground">Analyzing image...</p>
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
                    <div className="font-semibold text-destructive">{result.diseaseName}</div>
                    <div className="text-sm text-muted-foreground mt-0.5">
                      Confidence: {result.confidence}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Treatment */}
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                <div className="font-medium text-primary mb-2">Recommended Treatment</div>
                <p className="text-sm text-foreground/80">{result.treatment}</p>
              </div>

              {/* Prevention */}
              <div className="p-4 rounded-xl bg-muted">
                <div className="font-medium text-foreground mb-2">Prevention Tips</div>
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
                Scan Another Image
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
