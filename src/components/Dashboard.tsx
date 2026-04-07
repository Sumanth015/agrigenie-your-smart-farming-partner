import { useState } from 'react';
import { SoilDataCard } from './dashboard/SoilDataCard';
import { WeatherCard } from './dashboard/WeatherCard';
import { MarketInsightsCard } from './dashboard/MarketInsightsCard';
import { CropHistoryCard } from './dashboard/CropHistoryCard';
import { CropRecommendations } from './dashboard/CropRecommendations';
import { SustainabilityCard } from './dashboard/SustainabilityCard';
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
import { 
  mockSoilData, 
  mockWeatherForecast, 
  mockCropHistory,
  mockNotifications 
} from '@/data/mockData';
import { Loader2 } from 'lucide-react';

export function Dashboard() {
  const { t } = useTranslation();
  const { user, signOut } = useAuth();
  const { profile } = useProfile(user?.id);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sideNavOpen, setSideNavOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const { data: marketPrices = [], isLoading: pricesLoading } = useMarketPrices(profile?.state ?? undefined);
  const { data: recommendations = [], isLoading: recsLoading } = useCropRecommendations(
    profile?.state ?? undefined,
    profile?.soil_type ?? undefined
  );

  const unreadCount = mockNotifications.filter(n => !n.read).length;

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="dashboard-grid">
            <SoilDataCard data={mockSoilData} />
            <WeatherCard forecasts={mockWeatherForecast} />
            {pricesLoading ? (
              <div className="card-agri p-5 flex items-center justify-center h-48">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : (
              <MarketInsightsCard prices={marketPrices} />
            )}
            <CropHistoryCard history={mockCropHistory} />
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
              <MarketInsightsCard prices={marketPrices} />
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
      {notificationsOpen && <NotificationsPanel notifications={mockNotifications} onClose={() => setNotificationsOpen(false)} />}
    </div>
  );
}
