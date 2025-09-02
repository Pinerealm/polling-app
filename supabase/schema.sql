-- Create custom types
CREATE TYPE poll_status AS ENUM ('active', 'inactive', 'expired');

-- Create users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create polls table
CREATE TABLE public.polls (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  created_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  status poll_status DEFAULT 'active',
  allow_multiple_votes BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create poll options table
CREATE TABLE public.poll_options (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id UUID REFERENCES public.polls(id) ON DELETE CASCADE NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create votes table
CREATE TABLE public.votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id UUID REFERENCES public.polls(id) ON DELETE CASCADE NOT NULL,
  option_id UUID REFERENCES public.poll_options(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(poll_id, option_id, user_id)
);

-- Create indexes for better performance
CREATE INDEX idx_polls_created_by ON public.polls(created_by);
CREATE INDEX idx_polls_status ON public.polls(status);
CREATE INDEX idx_poll_options_poll_id ON public.poll_options(poll_id);
CREATE INDEX idx_votes_poll_id ON public.votes(poll_id);
CREATE INDEX idx_votes_user_id ON public.votes(user_id);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for polls
CREATE POLICY "Anyone can view active polls" ON public.polls
  FOR SELECT USING (status = 'active');

CREATE POLICY "Users can view their own polls" ON public.polls
  FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "Users can create polls" ON public.polls
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own polls" ON public.polls
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own polls" ON public.polls
  FOR DELETE USING (auth.uid() = created_by);

-- RLS Policies for poll options
CREATE POLICY "Anyone can view poll options" ON public.poll_options
  FOR SELECT USING (true);

CREATE POLICY "Users can create options for their polls" ON public.poll_options
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.polls 
      WHERE id = poll_id AND created_by = auth.uid()
    )
  );

CREATE POLICY "Users can update options for their polls" ON public.poll_options
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.polls 
      WHERE id = poll_id AND created_by = auth.uid()
    )
  );

CREATE POLICY "Users can delete options for their polls" ON public.poll_options
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.polls 
      WHERE id = poll_id AND created_by = auth.uid()
    )
  );

-- RLS Policies for votes
CREATE POLICY "Users can view votes" ON public.votes
  FOR SELECT USING (true);

CREATE POLICY "Users can vote once per option per poll" ON public.votes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only delete their own votes" ON public.votes
  FOR DELETE USING (auth.uid() = user_id);

-- Functions and triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_polls_updated_at BEFORE UPDATE ON public.polls
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to get poll results
CREATE OR REPLACE FUNCTION get_poll_results(poll_uuid UUID)
RETURNS TABLE (
  option_id UUID,
  option_text TEXT,
  vote_count BIGINT,
  percentage NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    po.id,
    po.text,
    COUNT(v.id)::BIGINT as vote_count,
    CASE 
      WHEN (SELECT COUNT(*) FROM public.votes WHERE poll_id = poll_uuid) > 0 
      THEN ROUND((COUNT(v.id)::NUMERIC / (SELECT COUNT(*) FROM public.votes WHERE poll_id = poll_uuid)::NUMERIC) * 100, 2)
      ELSE 0 
    END as percentage
  FROM public.poll_options po
  LEFT JOIN public.votes v ON po.id = v.option_id
  WHERE po.poll_id = poll_uuid
  GROUP BY po.id, po.text
  ORDER BY vote_count DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
