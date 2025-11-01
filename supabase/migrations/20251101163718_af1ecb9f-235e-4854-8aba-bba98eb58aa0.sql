-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone_number TEXT,
  full_name TEXT,
  total_plays INTEGER DEFAULT 0,
  total_wins INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create prizes table
CREATE TABLE public.prizes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  value_mt DECIMAL(10, 2),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for prizes
ALTER TABLE public.prizes ENABLE ROW LEVEL SECURITY;

-- Anyone can view active prizes
CREATE POLICY "Anyone can view active prizes"
  ON public.prizes FOR SELECT
  USING (is_active = true);

-- Create lottery draws table
CREATE TABLE public.lottery_draws (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  draw_number INTEGER NOT NULL UNIQUE,
  winning_numbers INTEGER[] NOT NULL,
  draw_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  total_winners INTEGER DEFAULT 0,
  prize_id UUID REFERENCES public.prizes(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.lottery_draws ENABLE ROW LEVEL SECURITY;

-- Anyone can view completed draws
CREATE POLICY "Anyone can view completed draws"
  ON public.lottery_draws FOR SELECT
  USING (status = 'completed');

-- Create lottery plays table
CREATE TABLE public.lottery_plays (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  draw_id UUID REFERENCES public.lottery_draws(id),
  selected_numbers INTEGER[] NOT NULL,
  amount_mt DECIMAL(10, 2) NOT NULL DEFAULT 100.00,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed')),
  payment_reference TEXT,
  mpesa_transaction_id TEXT,
  is_winner BOOLEAN DEFAULT false,
  matched_numbers INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.lottery_plays ENABLE ROW LEVEL SECURITY;

-- Users can view their own plays
CREATE POLICY "Users can view their own plays"
  ON public.lottery_plays FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own plays
CREATE POLICY "Users can insert their own plays"
  ON public.lottery_plays FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create function to update profile stats
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Create trigger for profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, phone_number, full_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'phone_number',
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Insert initial prizes
INSERT INTO public.prizes (name, description, value_mt) VALUES
  ('Mini Bus', 'Toyota Hiace - Veículo completo e pronto para uso', 1500000.00),
  ('Mesa de Jantar com 6 Cadeiras', 'Mesa de jantar moderna com 6 cadeiras confortáveis', 25000.00),
  ('TV 42 Polegadas', 'Smart TV 42" Full HD com controle remoto', 25000.00),
  ('Jogo de Sofá', 'Conjunto completo de sofá para sala de estar', 35000.00),
  ('Cama de Casal', 'Cama de casal confortável com colchão', 20000.00);