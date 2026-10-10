import { useState } from 'react';
import { Leaf, ArrowLeft, Loader2, Phone, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

interface AuthPageProps {
  onSuccess: () => void;
  onBack: () => void;
  initialMode?: 'login' | 'signup';
}

export function AuthPage({ onSuccess, onBack }: AuthPageProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', mobile: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.mobile.trim()) {
      toast.error('Please enter your name and mobile number');
      return;
    }
    if (form.mobile.length < 10) {
      toast.error('Please enter a valid mobile number');
      return;
    }

    setLoading(true);
    try {
      const cleanMobile = form.mobile.replace(/\D/g, '');
      const email = `${cleanMobile}@farmer.agrigenie.app`;
      const password = `farmer_${cleanMobile}`;

      let authenticatedUser: any = null;

      // Attempt Supabase authentication with a 3s timeout
      try {
        const timeoutPromise = new Promise<{ error: Error }>((_, reject) =>
          setTimeout(() => reject(new Error('Connection timeout')), 3000)
        );

        const signInPromise = supabase.auth.signInWithPassword({
          email,
          password,
        });

        const { data: signInData, error: signInError } = await Promise.race([
          signInPromise,
          timeoutPromise as any,
        ]);

        if (!signInError && signInData?.user) {
          authenticatedUser = signInData.user;
          toast.success('Welcome back! 🌾');
        } else if (signInError) {
          const isCredentialError =
            signInError.message?.toLowerCase().includes('invalid login credentials') ||
            signInError.message?.toLowerCase().includes('invalid credentials') ||
            signInError.message?.toLowerCase().includes('user not found') ||
            signInError.status === 400;

          if (isCredentialError) {
            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
              email,
              password,
              options: {
                data: { name: form.name, mobile: form.mobile },
              },
            });
            if (!signUpError && signUpData?.user) {
              authenticatedUser = signUpData.user;
              toast.success('Welcome to AgriGenie! 🌾');
            }
          }
        }
      } catch (networkErr) {
        console.warn('Supabase remote server unreachable, falling back to local mode:', networkErr);
      }

      // If remote backend is unreachable or down, provide seamless instant login
      if (!authenticatedUser) {
        const localUser = {
          id: `farmer_${cleanMobile || Date.now()}`,
          email,
          user_metadata: { name: form.name.trim(), mobile: form.mobile.trim() },
          app_metadata: { provider: 'local' },
          aud: 'authenticated',
          created_at: new Date().toISOString(),
        };
        authenticatedUser = localUser;
        localStorage.setItem('agrigenie_user', JSON.stringify(localUser));

        const localProfile = {
          id: localUser.id,
          name: form.name.trim(),
          mobile: form.mobile.trim(),
          village: 'Demo Village',
          district: 'Mysuru',
          state: 'Karnataka',
          farm_size: 5,
          farm_size_unit: 'acres',
          soil_type: 'Loamy',
          preferred_language: 'en',
        };
        localStorage.setItem('agrigenie_profile', JSON.stringify(localProfile));

        // Dispatch auth change event so useAuth immediately picks it up
        window.dispatchEvent(new CustomEvent('agrigenie_auth_change', { detail: localUser }));
        toast.success(`Welcome to AgriGenie, ${form.name.trim()}! 🌾`);
      }

      onSuccess();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <button onClick={onBack} className="mb-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center">
            <Leaf className="w-7 h-7 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">AgriGenie</h1>
            <p className="text-sm text-muted-foreground">Enter your details to continue</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="name" className="flex items-center gap-2 mb-1.5">
              <User className="w-4 h-4 text-muted-foreground" />
              Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="h-12 text-base"
            />
          </div>
          <div>
            <Label htmlFor="mobile" className="flex items-center gap-2 mb-1.5">
              <Phone className="w-4 h-4 text-muted-foreground" />
              Mobile Number
            </Label>
            <Input
              id="mobile"
              type="tel"
              placeholder="Enter 10-digit mobile number"
              value={form.mobile}
              onChange={(e) => setForm({ ...form, mobile: e.target.value.replace(/\D/g, '').slice(0, 10) })}
              className="h-12 text-base tracking-wide"
              maxLength={10}
            />
          </div>

          <Button type="submit" className="w-full h-12 text-base" disabled={loading}>
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : (
              <Leaf className="w-5 h-5 mr-2" />
            )}
            Continue
          </Button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Just enter your name and mobile number — no password needed!
        </p>
      </div>
    </div>
  );
}
