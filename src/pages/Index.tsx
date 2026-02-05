import { useState } from 'react';
import { LandingPage } from '@/components/LandingPage';
import { RegistrationPage } from '@/components/RegistrationPage';
import { Dashboard } from '@/components/Dashboard';

type AppView = 'landing' | 'register' | 'login' | 'dashboard';

const Index = () => {
  const [view, setView] = useState<AppView>('landing');

  const renderView = () => {
    switch (view) {
      case 'landing':
        return (
          <LandingPage
            onGetStarted={() => setView('register')}
            onLogin={() => setView('dashboard')}
          />
        );
      case 'register':
        return (
          <RegistrationPage
            onComplete={() => setView('dashboard')}
            onBack={() => setView('landing')}
          />
        );
      case 'login':
      case 'dashboard':
        return <Dashboard />;
      default:
        return null;
    }
  };

  return <div className="min-h-screen">{renderView()}</div>;
};

export default Index;
