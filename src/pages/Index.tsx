import { useState, useEffect, lazy, Suspense } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { LandingPage } from '@/components/LandingPage';
import { Loader2 } from 'lucide-react';

const Dashboard = lazy(() => import('@/components/Dashboard').then(m => ({ default: m.Dashboard })));
const AuthPage = lazy(() => import('@/components/AuthPage').then(m => ({ default: m.AuthPage })));

type AppView = 'landing' | 'register' | 'login' | 'dashboard';

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-3">
      <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      <span className="text-sm font-mono text-muted-foreground">Loading AgriGenie...</span>
    </div>
  </div>
);

const Index = () => {
  const { user, loading } = useAuth();
  const [view, setView] = useState<AppView>('landing');

  useEffect(() => {
    if (user) {
      setView('dashboard');
    }
  }, [user]);

  // Only show full-screen loader if we already know there's a cached user and we're validating
  if (loading && user) {
    return <PageLoader />;
  }

  const renderView = () => {
    if (user || view === 'dashboard') {
      return (
        <Suspense fallback={<PageLoader />}>
          <Dashboard />
        </Suspense>
      );
    }

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
          <Suspense fallback={<PageLoader />}>
            <AuthPage
              initialMode="signup"
              onSuccess={() => setView('dashboard')}
              onBack={() => setView('landing')}
            />
          </Suspense>
        );
      case 'login':
        return (
          <Suspense fallback={<PageLoader />}>
            <AuthPage
              initialMode="login"
              onSuccess={() => setView('dashboard')}
              onBack={() => setView('landing')}
            />
          </Suspense>
        );
      default:
        return (
          <LandingPage
            onGetStarted={() => setView('register')}
            onLogin={() => setView('login')}
          />
        );
    }
  };

  return <div className="min-h-screen">{renderView()}</div>;
};

export default Index;

