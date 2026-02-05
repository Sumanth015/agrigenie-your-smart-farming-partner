import { SoilData, WeatherForecast, MarketPrice, CropRecommendation, CropHistory, Notification } from '@/types/agrigenie';

export const mockSoilData: SoilData = {
  ph: 6.8,
  moisture: 42,
  nitrogen: 280,
  phosphorus: 45,
  potassium: 210,
  source: 'satellite',
  lastUpdated: new Date(),
};

export const mockWeatherForecast: WeatherForecast[] = [
  { date: new Date(), temperature: { min: 24, max: 32 }, rainfall: 0, humidity: 65, condition: 'sunny' },
  { date: new Date(Date.now() + 86400000), temperature: { min: 23, max: 31 }, rainfall: 5, humidity: 70, condition: 'cloudy' },
  { date: new Date(Date.now() + 86400000 * 2), temperature: { min: 22, max: 28 }, rainfall: 15, humidity: 80, condition: 'rainy' },
  { date: new Date(Date.now() + 86400000 * 3), temperature: { min: 21, max: 27 }, rainfall: 25, humidity: 85, condition: 'rainy', alert: 'Heavy rainfall expected' },
  { date: new Date(Date.now() + 86400000 * 4), temperature: { min: 23, max: 30 }, rainfall: 2, humidity: 72, condition: 'cloudy' },
  { date: new Date(Date.now() + 86400000 * 5), temperature: { min: 24, max: 33 }, rainfall: 0, humidity: 60, condition: 'sunny' },
  { date: new Date(Date.now() + 86400000 * 6), temperature: { min: 25, max: 34 }, rainfall: 0, humidity: 55, condition: 'sunny' },
];

export const mockMarketPrices: MarketPrice[] = [
  { crop: 'Rice', price: 2150, trend: 'up', demand: 'high', mandiName: 'Guntur Mandi' },
  { crop: 'Wheat', price: 2250, trend: 'stable', demand: 'medium', mandiName: 'Hapur Mandi' },
  { crop: 'Cotton', price: 6800, trend: 'up', demand: 'high', mandiName: 'Rajkot Mandi' },
  { crop: 'Sugarcane', price: 350, trend: 'down', demand: 'medium', mandiName: 'Kolhapur Mandi' },
  { crop: 'Maize', price: 1950, trend: 'up', demand: 'high', mandiName: 'Davangere Mandi' },
];

export const mockCropRecommendations: CropRecommendation[] = [
  {
    name: 'Rice (Paddy)',
    suitabilityScore: 92,
    expectedYield: 4.5,
    profitMargin: 45000,
    sustainabilityScore: 78,
    waterRequirement: 'high',
    growthDuration: 120,
    riskLevel: 'low',
    reasoning: 'Your soil has ideal pH (6.8) and high moisture content. Current market demand is high with prices trending upward. Weather forecast shows adequate rainfall in the coming weeks.',
  },
  {
    name: 'Cotton',
    suitabilityScore: 88,
    expectedYield: 2.8,
    profitMargin: 52000,
    sustainabilityScore: 65,
    waterRequirement: 'medium',
    growthDuration: 150,
    riskLevel: 'medium',
    reasoning: 'Excellent profit margins with current market prices. Your soil potassium levels support cotton growth. Consider drip irrigation to optimize water usage.',
  },
  {
    name: 'Maize',
    suitabilityScore: 85,
    expectedYield: 5.2,
    profitMargin: 38000,
    sustainabilityScore: 82,
    waterRequirement: 'medium',
    growthDuration: 100,
    riskLevel: 'low',
    reasoning: 'Good nitrogen levels in your soil. Shorter growth duration allows for crop rotation. High demand in local markets for animal feed.',
  },
  {
    name: 'Groundnut',
    suitabilityScore: 79,
    expectedYield: 2.1,
    profitMargin: 42000,
    sustainabilityScore: 88,
    waterRequirement: 'low',
    growthDuration: 110,
    riskLevel: 'low',
    reasoning: 'Excellent for soil health - fixes nitrogen naturally. Lower water requirement suits the forecasted weather. Good market stability.',
  },
  {
    name: 'Sugarcane',
    suitabilityScore: 72,
    expectedYield: 65,
    profitMargin: 55000,
    sustainabilityScore: 55,
    waterRequirement: 'high',
    growthDuration: 365,
    riskLevel: 'medium',
    reasoning: 'High yield potential but requires significant water investment. Long growth cycle locks the land for a year. Consider if water availability is guaranteed.',
  },
];

export const mockCropHistory: CropHistory[] = [
  { crop: 'Rice', season: 'Kharif', year: 2024, yield: 4.2 },
  { crop: 'Wheat', season: 'Rabi', year: 2024, yield: 3.8 },
  { crop: 'Cotton', season: 'Kharif', year: 2023, yield: 2.5 },
  { crop: 'Groundnut', season: 'Rabi', year: 2023, yield: 1.9 },
];

export const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'weather',
    title: 'Heavy Rainfall Alert',
    message: 'Heavy rainfall expected in 3 days. Consider postponing irrigation.',
    timestamp: new Date(),
    read: false,
  },
  {
    id: '2',
    type: 'market',
    title: 'Cotton Price Surge',
    message: 'Cotton prices increased by 8% in Rajkot Mandi. Good time to sell.',
    timestamp: new Date(Date.now() - 3600000),
    read: false,
  },
  {
    id: '3',
    type: 'irrigation',
    title: 'Irrigation Reminder',
    message: 'Soil moisture dropping. Schedule irrigation in next 2 days.',
    timestamp: new Date(Date.now() - 7200000),
    read: true,
  },
  {
    id: '4',
    type: 'fertilizer',
    title: 'Fertilizer Schedule',
    message: 'Time to apply second round of nitrogen fertilizer for optimal growth.',
    timestamp: new Date(Date.now() - 86400000),
    read: true,
  },
];

export const languages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
];
