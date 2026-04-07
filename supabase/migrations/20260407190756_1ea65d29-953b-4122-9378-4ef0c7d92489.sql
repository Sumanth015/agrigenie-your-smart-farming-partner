
-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  mobile TEXT,
  village TEXT,
  district TEXT,
  state TEXT,
  farm_size NUMERIC,
  farm_size_unit TEXT DEFAULT 'acres',
  soil_type TEXT,
  preferred_language TEXT DEFAULT 'en',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', 'Farmer'));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Market prices table
CREATE TABLE public.market_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  crop TEXT NOT NULL,
  price NUMERIC NOT NULL,
  trend TEXT NOT NULL DEFAULT 'stable',
  demand TEXT NOT NULL DEFAULT 'medium',
  mandi_name TEXT NOT NULL,
  location_state TEXT,
  location_district TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.market_prices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read market prices" ON public.market_prices FOR SELECT TO authenticated USING (true);

-- Crop history table
CREATE TABLE public.crop_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  crop TEXT NOT NULL,
  season TEXT NOT NULL,
  year INTEGER NOT NULL,
  yield NUMERIC,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.crop_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own crop history" ON public.crop_history FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own crop history" ON public.crop_history FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Crop recommendations table
CREATE TABLE public.crop_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  crop_name TEXT NOT NULL,
  suitability_score INTEGER NOT NULL,
  expected_yield NUMERIC,
  profit_margin NUMERIC,
  sustainability_score INTEGER,
  water_requirement TEXT DEFAULT 'medium',
  growth_duration INTEGER,
  risk_level TEXT DEFAULT 'medium',
  reasoning TEXT,
  suitable_states TEXT[],
  suitable_soil_types TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.crop_recommendations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read crop recommendations" ON public.crop_recommendations FOR SELECT TO authenticated USING (true);
