import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { LandingPage } from '@/components/LandingPage';
import { RegistrationPage } from '@/components/RegistrationPage';
import { AuthPage } from '@/components/AuthPage';
import { Dashboard } from '@/components/Dashboard';
import { Loader2 } from 'lucide-react';

type AppView = 'landing' | 'register' | 'login' | 'dashboard';

const Index = () => {
  const { user, loading } = useAuth();
  const [view, setView] = useState<AppView>('landing');

  useEffect(() => {
    if (user) setView('dashboard');
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const renderView = () => {
    if (user) return <Dashboard />;

    switch (view) {
      case 'landing':
        return (
          <LandingPage
            onGetStarted={() => setView('register')}
            onLogin={() => setView('login')}
          />
        );
      case 'register':
        return (
          <AuthPage
            initialMode="signup"
            onSuccess={() => setView('dashboard')}
            onBack={() => setView('landing')}
          />
        );
      case 'login':
        return (
          <AuthPage
            initialMode="login"
            onSuccess={() => setView('dashboard')}
            onBack={() => setView('landing')}
          />
        );
      default:
        return null;
    }
  };

  return <div className="min-h-screen">{renderView()}</div>;
};

export default Index;
