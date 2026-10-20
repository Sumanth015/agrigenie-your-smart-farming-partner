import { useState } from 'react';
import { 
  Star, MapPin, TrendingUp, Droplets, Award, CheckCircle2, 
  Heart, Quote, Plus, Sparkles, Filter, X, ThumbsUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

export interface FarmerStory {
  id: string;
  name: string;
  location: string;
  state: string;
  crop: string;
  image: string;
  rating: number;
  yieldIncrease: string;
  profitGain: string;
  waterSaved: string;
  quote: string;
  story: string;
  tags: string[];
  likes: number;
  verified: boolean;
}

const initialFarmers: FarmerStory[] = [
  {
    id: '1',
    name: 'Ramesh Gowda',
    location: 'Mandya',
    state: 'Karnataka',
    crop: 'Paddy (Basmati & Sona Masoori)',
    image: '/images/farmers/farmer_ramesh.jpg',
    rating: 5,
    yieldIncrease: '+48% Yield',
    profitGain: '+₹54,000 / Acre',
    waterSaved: '35% Water Saved',
    quote: 'AgriGenie’s weather alert and soil testing saved my crop just before an unseasonal downpour. My yield was the highest in 15 years!',
    story: 'Ramesh adopted AgriGenie’s AI crop recommendation and customized NPK schedule for his 6-acre paddy fields. By following real-time rain forecasting and nutrient balance recommendations, he avoided nitrogen over-fertilization and drastically reduced stem borer infestation.',
    tags: ['Soil Health Champion', 'Highest Yield 2025', 'Organic Inputs'],
    likes: 142,
    verified: true,
  },
  {
    id: '2',
    name: 'Sunita Patil',
    location: 'Nashik',
    state: 'Maharashtra',
    crop: 'Organic Tomatoes & Vegetables',
    image: '/images/farmers/farmer_sunita.jpg',
    rating: 5,
    yieldIncrease: '+42% Yield',
    profitGain: '+₹68,500 / Acre',
    waterSaved: '40% Water Saved',
    quote: 'The AI disease detector detected early leaf blight within seconds of uploading a photo. The organic neem and copper remedy saved my harvest!',
    story: 'Managing 4 acres of multi-crop vegetables, Sunita uses AgriGenie’s disease scanner weekly. Immediate remedies prevented crop loss across her entire nursery, and market price trends helped her time mandi supply to get premium rates.',
    tags: ['Disease Prevention Hero', 'Women in Agri', 'Organic Certified'],
    likes: 198,
    verified: true,
  },
  {
    id: '3',
    name: 'Rajesh Kumar',
    location: 'Ludhiana',
    state: 'Punjab',
    crop: 'Wheat & Mustard',
    image: '/images/farmers/farmer_rajesh.jpg',
    rating: 5,
    yieldIncrease: '+36% Yield',
    profitGain: '+₹46,000 / Acre',
    waterSaved: '30% Water Saved',
    quote: 'Live mandi price trends gave me the clarity to sell at Khanna Mandi when rates peaked. It’s like having an agricultural expert in your pocket.',
    story: 'Rajesh transformed his traditional farming using AgriGenie’s mobile advisor. By monitoring real-time mandi prices and soil moisture levels, he timed both irrigation cycles and harvest sales with surgical precision.',
    tags: ['Smart Market Seller', 'Precision Irrigation', 'Tech Pioneer'],
    likes: 115,
    verified: true,
  },
  {
    id: '4',
    name: 'Anand & Meena Murugan',
    location: 'Coimbatore',
    state: 'Tamil Nadu',
    crop: 'Red Chilli & Sugarcane',
    image: '/images/farmers/farmer_couple.jpg',
    rating: 5,
    yieldIncrease: '+52% Yield',
    profitGain: '+₹75,000 / Acre',
    waterSaved: '45% Water Saved',
    quote: 'Smart drip scheduling reduced our electricity pump hours by half and doubled the quality and vibrant red color of our chilli harvest.',
    story: 'Facing persistent ground water shortages, Anand and Meena utilized AgriGenie’s sustainability irrigation scheduler. Their drip efficiency surged by 45%, qualifying them for state precision agriculture recognition.',
    tags: ['Water Conservation Award', 'Top Chilli Exporter', 'Family Farm'],
    likes: 230,
    verified: true,
  },
];

export function HappyFarmers() {
  const { t } = useTranslation();
  const [farmers, setFarmers] = useState<FarmerStory[]>(() => {
    try {
      const saved = localStorage.getItem('agrigenie_farmer_stories');
      if (saved) {
        const parsed = JSON.parse(saved);
        return [...initialFarmers, ...parsed];
      }
    } catch {}
    return initialFarmers;
  });

  const [selectedState, setSelectedState] = useState<string>('All');
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [newStory, setNewStory] = useState({
    name: '',
    location: '',
    state: 'Karnataka',
    crop: '',
    yieldIncrease: '+30% Yield',
    profitGain: '+₹40,000 / Acre',
    quote: '',
    story: '',
  });

  const states = ['All', 'Karnataka', 'Maharashtra', 'Punjab', 'Tamil Nadu'];

  const filteredFarmers = selectedState === 'All'
    ? farmers
    : farmers.filter((f) => f.state.toLowerCase() === selectedState.toLowerCase());

  const handleLike = (id: string) => {
    if (likedMap[id]) return;
    setLikedMap((prev) => ({ ...prev, [id]: true }));
    setFarmers((prev) =>
      prev.map((f) => (f.id === id ? { ...f, likes: f.likes + 1 } : f))
    );
    toast.success('Thank you for showing appreciation! ❤️');
  };

  const handleShareStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStory.name.trim() || !newStory.crop.trim() || !newStory.quote.trim()) {
      toast.error('Please fill in your name, crop, and success experience.');
      return;
    }

    const createdStory: FarmerStory = {
      id: `user_story_${Date.now()}`,
      name: newStory.name.trim(),
      location: newStory.location.trim() || 'Rural Farm',
      state: newStory.state,
      crop: newStory.crop.trim(),
      image: '/images/farmers/farmer_ramesh.jpg', // Default high-res avatar
      rating: 5,
      yieldIncrease: newStory.yieldIncrease,
      profitGain: newStory.profitGain,
      waterSaved: '30% Water Saved',
      quote: newStory.quote.trim(),
      story: newStory.story.trim() || newStory.quote.trim(),
      tags: ['Community Verified', 'AgriGenie Farmer'],
      likes: 1,
      verified: true,
    };

    const updated = [createdStory, ...farmers];
    setFarmers(updated);

    try {
      const customOnly = updated.filter((s) => s.id.startsWith('user_story_'));
      localStorage.setItem('agrigenie_farmer_stories', JSON.stringify(customOnly));
    } catch {}

    toast.success('Your farm success story has been published! 🌾');
    setShowStoryModal(false);
    setNewStory({
      name: '',
      location: '',
      state: 'Karnataka',
      crop: '',
      yieldIncrease: '+30% Yield',
      profitGain: '+₹40,000 / Acre',
      quote: '',
      story: '',
    });
  };

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-emerald-700 to-teal-800 text-primary-foreground p-6 md:p-10 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold uppercase tracking-wider text-emerald-100">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            Farmer Success Stories & Impact
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Happy Farmers, Bountiful Harvests 🌾
          </h1>
          <p className="text-base md:text-lg text-emerald-50/90 leading-relaxed max-w-2xl">
            See how thousands of growers across India are multiplying crop yields, slashing water costs, and building generational wealth with AgriGenie’s AI guidance.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <Button 
              onClick={() => setShowStoryModal(true)}
              className="bg-yellow-400 hover:bg-yellow-300 text-yellow-950 font-bold shadow-lg shadow-black/10 text-sm md:text-base px-6 h-11 rounded-xl"
            >
              <Plus className="w-4 h-4 mr-2" />
              Share Your Harvest Story
            </Button>
          </div>
        </div>
      </div>

      {/* Impact Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card-agri p-5 border-l-4 border-l-primary flex flex-col justify-between">
          <p className="text-xs md:text-sm font-medium text-muted-foreground">Average Yield Increase</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl md:text-4xl font-extrabold text-foreground">+44%</span>
            <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="text-xs text-muted-foreground mt-1">Across 12,000+ crop cycles</p>
        </div>

        <div className="card-agri p-5 border-l-4 border-l-blue-500 flex flex-col justify-between">
          <p className="text-xs md:text-sm font-medium text-muted-foreground">Water Conserved</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl md:text-4xl font-extrabold text-foreground">3.8B L</span>
            <Droplets className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-xs text-muted-foreground mt-1">With AI smart drip schedules</p>
        </div>

        <div className="card-agri p-5 border-l-4 border-l-amber-500 flex flex-col justify-between">
          <p className="text-xs md:text-sm font-medium text-muted-foreground">Avg. Profit Increase</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl md:text-4xl font-extrabold text-foreground">₹52,000</span>
            <span className="text-xs font-semibold text-emerald-600">/ Acre</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">From timely mandi selling</p>
        </div>

        <div className="card-agri p-5 border-l-4 border-l-emerald-500 flex flex-col justify-between">
          <p className="text-xs md:text-sm font-medium text-muted-foreground">Farmer Satisfaction</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl md:text-4xl font-extrabold text-foreground">99.4%</span>
            <Award className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-xs text-muted-foreground mt-1">Over 25,000 registered growers</p>
        </div>
      </div>

      {/* Filter by Region */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-semibold text-foreground">Filter by Region:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {states.map((st) => (
            <Button
              key={st}
              size="sm"
              variant={selectedState === st ? 'default' : 'outline'}
              onClick={() => setSelectedState(st)}
              className="rounded-full text-xs font-medium px-4 h-8"
            >
              {st}
            </Button>
          ))}
        </div>
      </div>

      {/* Farmer Gallery Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredFarmers.map((farmer) => (
          <div
            key={farmer.id}
            className="card-agri overflow-hidden rounded-2xl flex flex-col border border-border/80 hover:shadow-2xl hover:border-primary/40 transition-all duration-300 group"
          >
            {/* Image Banner */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
              <img
                src={farmer.image}
                alt={farmer.name}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* State & Verification Badges on Image */}
              <div className="absolute top-4 left-4 flex gap-2">
                <Badge className="bg-background/90 text-foreground backdrop-blur-md shadow-md text-xs font-semibold px-2.5 py-1">
                  <MapPin className="w-3.5 h-3.5 text-primary mr-1" />
                  {farmer.location}, {farmer.state}
                </Badge>
                {farmer.verified && (
                  <Badge className="bg-emerald-600 text-white shadow-md text-xs font-semibold px-2.5 py-1">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    Verified Farmer
                  </Badge>
                )}
              </div>

              {/* Key Metric Pill */}
              <div className="absolute top-4 right-4">
                <Badge className="bg-amber-500 text-amber-950 font-bold px-3 py-1 text-xs shadow-lg">
                  {farmer.yieldIncrease}
                </Badge>
              </div>

              {/* Name & Crop Info on Image bottom */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="text-2xl font-bold tracking-tight drop-shadow-md flex items-center gap-2">
                  {farmer.name}
                </h3>
                <p className="text-sm text-white/90 drop-shadow flex items-center gap-2 font-medium">
                  🌾 {farmer.crop}
                </p>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
              {/* Stat Highlights */}
              <div className="grid grid-cols-3 gap-2 p-3.5 rounded-xl bg-secondary/50 border border-border text-center">
                <div>
                  <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Yield</p>
                  <p className="text-sm md:text-base font-bold text-emerald-600 dark:text-emerald-400">
                    {farmer.yieldIncrease}
                  </p>
                </div>
                <div className="border-x border-border">
                  <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Profit</p>
                  <p className="text-sm md:text-base font-bold text-primary">
                    {farmer.profitGain}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Water</p>
                  <p className="text-sm md:text-base font-bold text-blue-600 dark:text-blue-400">
                    {farmer.waterSaved}
                  </p>
                </div>
              </div>

              {/* Farmer Quote */}
              <div className="relative pl-7 italic text-foreground/90 text-sm leading-relaxed border-l-2 border-primary/60">
                <Quote className="w-4 h-4 text-primary absolute left-1 top-0 opacity-75" />
                "{farmer.quote}"
              </div>

              {/* Story Details */}
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                {farmer.story}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {farmer.tags.map((tag, idx) => (
                  <Badge key={idx} variant="secondary" className="text-[11px] font-normal py-0.5">
                    #{tag}
                  </Badge>
                ))}
              </div>

              {/* Footer Interaction */}
              <div className="pt-3 border-t border-border flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {[...Array(farmer.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-xs font-semibold text-muted-foreground ml-1.5">5.0 Star Story</span>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLike(farmer.id)}
                  className={`gap-1.5 text-xs h-8 px-3 rounded-full transition-colors ${
                    likedMap[farmer.id] ? 'text-red-500 bg-red-50 dark:bg-red-950/30' : 'text-muted-foreground'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${likedMap[farmer.id] ? 'fill-red-500' : ''}`} />
                  <span>{farmer.likes} Likes</span>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Share Your Story Modal */}
      {showStoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-card text-card-foreground border border-border w-full max-w-lg rounded-2xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowStoryModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold">Share Your Success Story</h2>
            </div>
            <p className="text-xs text-muted-foreground mb-6">
              Inspire farmers across India by sharing how AgriGenie helped your farm flourish.
            </p>

            <form onSubmit={handleShareStory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Basavaraj Patil"
                  value={newStory.name}
                  onChange={(e) => setNewStory({ ...newStory, name: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Village / District</label>
                  <input
                    type="text"
                    placeholder="e.g. Hassan"
                    value={newStory.location}
                    onChange={(e) => setNewStory({ ...newStory, location: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">State</label>
                  <select
                    value={newStory.state}
                    onChange={(e) => setNewStory({ ...newStory, state: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Karnataka">Karnataka</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Crop Grown *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maize, Cotton, Sugarcane"
                  value={newStory.crop}
                  onChange={(e) => setNewStory({ ...newStory, crop: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Yield Increase</label>
                  <input
                    type="text"
                    placeholder="e.g. +35% Yield"
                    value={newStory.yieldIncrease}
                    onChange={(e) => setNewStory({ ...newStory, yieldIncrease: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Profit Gain</label>
                  <input
                    type="text"
                    placeholder="e.g. +₹45,000 / Acre"
                    value={newStory.profitGain}
                    onChange={(e) => setNewStory({ ...newStory, profitGain: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Your Quote / Experience *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Tell us what AgriGenie feature helped you the most..."
                  value={newStory.quote}
                  onChange={(e) => setNewStory({ ...newStory, quote: e.target.value })}
                  className="w-full p-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowStoryModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="font-semibold">
                  Publish Story
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
