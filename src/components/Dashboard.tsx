import { useState } from 'react';
import { SoilDataCard } from './dashboard/SoilDataCard';
import { WeatherCard } from './dashboard/WeatherCard';
import { MarketInsightsCard } from './dashboard/MarketInsightsCard';
import { CropHistoryCard } from './dashboard/CropHistoryCard';
import { CropRecommendations } from './dashboard/CropRecommendations';
import { SustainabilityCard } from './dashboard/SustainabilityCard';
import { FarmDataInput } from './dashboard/FarmDataInput';
import { SoilScanner } from './SoilScanner';
import { ChatAssistant } from './ChatAssistant';
import { DiseaseDetector } from './DiseaseDetector';
import { NotificationsPanel } from './NotificationsPanel';
import { BottomNav, SideNav, TopBar } from './Navigation';
import { LocationCropAdvisor } from './dashboard/LocationCropAdvisor';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useMarketPrices } from '@/hooks/useMarketPrices';
import { useCropRecommendations } from '@/hooks/useCropRecommendations';
import { useLocation } from '@/hooks/useLocation';
import { useSoilData } from '@/hooks/useSoilData';
import { useCropHistory } from '@/hooks/useCropHistory';
import { useWeather } from '@/hooks/useWeather';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { mockSoilData, mockWeatherForecast, mockCropHistory } from '@/data/mockData';
import { Loader2 } from 'lucide-react';

export function Dashboard() {
  const { t } = useTranslation();
  const { user, signOut } = useAuth();
  const { profile } = useProfile(user?.id);
  const { location } = useLocation();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sideNavOpen, setSideNavOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Use GPS-detected location, fallback to profile
  const userState = location?.state || profile?.state || undefined;
  const userDistrict = location?.district || profile?.district || undefined;

  // Real data hooks
  const { data: soilData, isLoading: soilLoading } = useSoilData(user?.id);
  const { data: cropHistory = [], isLoading: historyLoading } = useCropHistory(user?.id);
  const { data: weatherData, isLoading: weatherLoading } = useWeather(location?.lat, location?.lng);

  const { data: marketPrices = [], isLoading: pricesLoading } = useMarketPrices(userState, userDistrict);
  const { data: recommendations = [], isLoading: recsLoading } = useCropRecommendations(
    userState,
    profile?.soil_type ?? undefined
  );

  // Real-time unread notification count
  const { data: unreadCount = 0 } = useQuery({
    queryKey: ['notifications_count', user?.id],
    queryFn: async () => {
      if (!user) return 0;
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('read', false);
      if (error) return 0;
      return count || 0;
    },
    enabled: !!user,
    refetchInterval: 10000,
  });

  // Use real data, fallback to mock if no data yet
  const displaySoilData = soilData || mockSoilData;
  const displayWeather = weatherData || mockWeatherForecast;
  const displayCropHistory = cropHistory.length > 0 ? cropHistory : mockCropHistory;

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="dashboard-grid">
            {soilLoading ? (
              <div className="card-agri p-5 flex items-center justify-center h-48">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : (
              <SoilDataCard data={displaySoilData} />
            )}
            {weatherLoading ? (
              <div className="card-agri p-5 flex items-center justify-center h-48">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : (
              <WeatherCard forecasts={displayWeather} />
            )}
            {pricesLoading ? (
              <div className="card-agri p-5 flex items-center justify-center h-48">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : (
              <MarketInsightsCard prices={marketPrices} detectedLocation={location?.state ? `${location.district}, ${location.state}` : undefined} />
            )}
            {historyLoading ? (
              <div className="card-agri p-5 flex items-center justify-center h-48">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : (
              <CropHistoryCard history={displayCropHistory} />
            )}
          </div>
        );
      case 'recommendations':
        return recsLoading ? (
          <div className="card-agri p-5 flex items-center justify-center h-48">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          <CropRecommendations recommendations={recommendations} />
        );
      case 'chat':
        return <ChatAssistant />;
      case 'disease':
        return <DiseaseDetector />;
      case 'sustainability':
        return <SustainabilityCard />;
      case 'farmdata':
        return <FarmDataInput />;
      case 'soilscan':
        return <SoilScanner />;
      case 'location':
        return <LocationCropAdvisor />;
      case 'market':
        return (
          <div className="space-y-6">
            {pricesLoading ? (
              <div className="card-agri p-5 flex items-center justify-center h-48">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : (
              <MarketInsightsCard prices={marketPrices} detectedLocation={location?.state ? `${location.district}, ${location.state}` : undefined} />
            )}
            <div className="card-agri p-5">
              <h3 className="font-semibold text-lg text-foreground mb-4">{t('dashboard.priceTrends')}</h3>
              <div className="h-64 bg-muted rounded-xl flex items-center justify-center text-muted-foreground">
                {t('dashboard.chartPlaceholder')}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SideNav activeTab={activeTab} onTabChange={setActiveTab} notificationCount={unreadCount} isOpen={sideNavOpen} onClose={() => setSideNavOpen(false)} />
      <TopBar onMenuClick={() => setSideNavOpen(true)} onNotificationClick={() => setNotificationsOpen(true)} notificationCount={unreadCount} />
      <main className="lg:ml-64 pt-20 pb-24 lg:pb-8 px-4 lg:px-6">
        <div className="max-w-6xl mx-auto">{renderContent()}</div>
      </main>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} notificationCount={unreadCount} />
      {notificationsOpen && <NotificationsPanel onClose={() => setNotificationsOpen(false)} />}
    </div>
  );
}
