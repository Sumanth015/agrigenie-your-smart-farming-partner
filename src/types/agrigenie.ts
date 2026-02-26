export interface SoilData {
  ph: number;
  moisture: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  source: 'satellite' | 'iot' | 'manual';
  lastUpdated: Date;
}

export interface WeatherForecast {
  date: Date;
  temperature: { min: number; max: number };
  rainfall: number;
  humidity: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy';
  alert?: string;
}

export interface MarketPrice {
  crop: string;
  price: number;
  trend: 'up' | 'down' | 'stable';
  demand: 'high' | 'medium' | 'low';
  mandiName: string;
}

export interface CropRecommendation {
  name: string;
  suitabilityScore: number;
  expectedYield: number;
  profitMargin: number;
  sustainabilityScore: number;
  waterRequirement: 'low' | 'medium' | 'high';
  growthDuration: number;
  riskLevel: 'low' | 'medium' | 'high';
  reasoning: string;
  image?: string;
}

export interface CropHistory {
  crop: string;
  season: string;
  year: number;
  yield: number;
}

export interface DiseaseDetection {
  plantName: string;
  diseaseName: string;
  confidence: number;
  description: string;
  treatment: string;
  prevention: string[];
}

export interface Notification {
  id: string;
  type: 'weather' | 'market' | 'irrigation' | 'fertilizer';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export interface FarmerProfile {
  name: string;
  mobile: string;
  location: {
    village: string;
    district: string;
    state: string;
    coordinates?: { lat: number; lng: number };
  };
  farmSize: number;
  farmSizeUnit: 'acres' | 'hectares';
  soilType?: string;
  preferredLanguage: string;
  cropHistory: CropHistory[];
}
