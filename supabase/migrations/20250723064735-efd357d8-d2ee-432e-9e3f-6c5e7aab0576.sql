-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  location TEXT,
  total_score INTEGER DEFAULT 0,
  total_performances INTEGER DEFAULT 0,
  followers_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user roles system
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'verified_artist', 'user');

CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Create songs catalog
CREATE TABLE public.songs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  album TEXT,
  genre TEXT,
  duration INTEGER NOT NULL, -- in seconds
  difficulty_level INTEGER DEFAULT 1 CHECK (difficulty_level BETWEEN 1 AND 5),
  audio_url TEXT NOT NULL, -- backing track URL
  lyrics TEXT,
  cover_image_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  play_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create performances table
CREATE TABLE public.performances (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  song_id UUID NOT NULL REFERENCES public.songs(id) ON DELETE CASCADE,
  title TEXT,
  audio_url TEXT NOT NULL,
  thumbnail_url TEXT,
  score INTEGER DEFAULT 0 CHECK (score BETWEEN 0 AND 100),
  pitch_accuracy DECIMAL(5,2) DEFAULT 0,
  timing_accuracy DECIMAL(5,2) DEFAULT 0,
  is_duet BOOLEAN DEFAULT false,
  duet_partner_id UUID REFERENCES auth.users(id),
  is_public BOOLEAN DEFAULT true,
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create follows/social graph
CREATE TABLE public.follows (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- Create likes table
CREATE TABLE public.likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  performance_id UUID NOT NULL REFERENCES public.performances(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, performance_id)
);

-- Create comments table
CREATE TABLE public.comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  performance_id UUID NOT NULL REFERENCES public.performances(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create leaderboards table
CREATE TABLE public.leaderboards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL, -- 'daily', 'weekly', 'monthly', 'all_time', 'genre_specific'
  score INTEGER NOT NULL DEFAULT 0,
  rank INTEGER,
  period_start DATE,
  period_end DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create duet requests table
CREATE TABLE public.duet_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  song_id UUID NOT NULL REFERENCES public.songs(id) ON DELETE CASCADE,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create live rooms for real-time karaoke
CREATE TABLE public.live_rooms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  host_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT true,
  max_participants INTEGER DEFAULT 10,
  current_participants INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  room_code TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create room participants
CREATE TABLE public.room_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES public.live_rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_host BOOLEAN DEFAULT false,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(room_id, user_id)
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.duet_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_participants ENABLE ROW LEVEL SECURITY;

-- Create security function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create RLS policies for profiles
CREATE POLICY "Profiles are viewable by everyone" 
ON public.profiles 
FOR SELECT 
USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for user_roles
CREATE POLICY "User roles are viewable by everyone"
ON public.user_roles
FOR SELECT
USING (true);

CREATE POLICY "Only admins can manage user roles"
ON public.user_roles
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Create RLS policies for songs
CREATE POLICY "Songs are viewable by everyone" 
ON public.songs 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins and moderators can manage songs"
ON public.songs
FOR ALL
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'));

-- Create RLS policies for performances
CREATE POLICY "Public performances are viewable by everyone" 
ON public.performances 
FOR SELECT 
USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Users can create their own performances" 
ON public.performances 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own performances" 
ON public.performances 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own performances" 
ON public.performances 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for follows
CREATE POLICY "Follows are viewable by everyone" 
ON public.follows 
FOR SELECT 
USING (true);

CREATE POLICY "Users can manage their own follows" 
ON public.follows 
FOR ALL 
USING (auth.uid() = follower_id);

-- Create RLS policies for likes
CREATE POLICY "Likes are viewable by everyone" 
ON public.likes 
FOR SELECT 
USING (true);

CREATE POLICY "Users can manage their own likes" 
ON public.likes 
FOR ALL 
USING (auth.uid() = user_id);

-- Create RLS policies for comments
CREATE POLICY "Comments are viewable by everyone" 
ON public.comments 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create comments" 
ON public.comments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" 
ON public.comments 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" 
ON public.comments 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for leaderboards
CREATE POLICY "Leaderboards are viewable by everyone" 
ON public.leaderboards 
FOR SELECT 
USING (true);

CREATE POLICY "System can manage leaderboards"
ON public.leaderboards
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Create RLS policies for duet requests
CREATE POLICY "Users can view their duet requests" 
ON public.duet_requests 
FOR SELECT 
USING (auth.uid() = requester_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can create duet requests" 
ON public.duet_requests 
FOR INSERT 
WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Users can update duet requests they're involved in" 
ON public.duet_requests 
FOR UPDATE 
USING (auth.uid() = requester_id OR auth.uid() = recipient_id);

-- Create RLS policies for live rooms
CREATE POLICY "Public live rooms are viewable by everyone" 
ON public.live_rooms 
FOR SELECT 
USING (is_public = true OR auth.uid() = host_id);

CREATE POLICY "Users can create live rooms" 
ON public.live_rooms 
FOR INSERT 
WITH CHECK (auth.uid() = host_id);

CREATE POLICY "Hosts can update their rooms" 
ON public.live_rooms 
FOR UPDATE 
USING (auth.uid() = host_id);

CREATE POLICY "Hosts can delete their rooms" 
ON public.live_rooms 
FOR DELETE 
USING (auth.uid() = host_id);

-- Create RLS policies for room participants
CREATE POLICY "Room participants are viewable by room members" 
ON public.room_participants 
FOR SELECT 
USING (
  auth.uid() = user_id OR 
  EXISTS (
    SELECT 1 FROM public.room_participants rp 
    WHERE rp.room_id = room_participants.room_id 
    AND rp.user_id = auth.uid()
  )
);

CREATE POLICY "Users can join rooms" 
ON public.room_participants 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave rooms" 
ON public.room_participants 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_songs_updated_at
  BEFORE UPDATE ON public.songs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_performances_updated_at
  BEFORE UPDATE ON public.performances
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON public.comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_leaderboards_updated_at
  BEFORE UPDATE ON public.leaderboards
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_duet_requests_updated_at
  BEFORE UPDATE ON public.duet_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_live_rooms_updated_at
  BEFORE UPDATE ON public.live_rooms
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, username, display_name)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email)
  );
  
  -- Assign default user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

-- Create trigger for automatic profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_profiles_username ON public.profiles(username);
CREATE INDEX idx_performances_user_id ON public.performances(user_id);
CREATE INDEX idx_performances_song_id ON public.performances(song_id);
CREATE INDEX idx_performances_created_at ON public.performances(created_at DESC);
CREATE INDEX idx_follows_follower_id ON public.follows(follower_id);
CREATE INDEX idx_follows_following_id ON public.follows(following_id);
CREATE INDEX idx_likes_user_id ON public.likes(user_id);
CREATE INDEX idx_likes_performance_id ON public.likes(performance_id);
CREATE INDEX idx_comments_performance_id ON public.comments(performance_id);
CREATE INDEX idx_songs_genre ON public.songs(genre);
CREATE INDEX idx_songs_featured ON public.songs(is_featured);
CREATE INDEX idx_leaderboards_category ON public.leaderboards(category);
CREATE INDEX idx_leaderboards_period ON public.leaderboards(period_start, period_end);

-- Insert some sample songs
INSERT INTO public.songs (title, artist, album, genre, duration, difficulty_level, audio_url, lyrics, cover_image_url, is_featured) VALUES
('Bohemian Rhapsody', 'Queen', 'A Night at the Opera', 'Rock', 355, 5, 'https://example.com/audio/bohemian-rhapsody.mp3', 'Is this the real life? Is this just fantasy...', 'https://example.com/covers/bohemian-rhapsody.jpg', true),
('Shape of You', 'Ed Sheeran', '÷ (Divide)', 'Pop', 233, 2, 'https://example.com/audio/shape-of-you.mp3', 'The club isn''t the best place to find a lover...', 'https://example.com/covers/shape-of-you.jpg', true),
('Billie Jean', 'Michael Jackson', 'Thriller', 'Pop', 294, 3, 'https://example.com/audio/billie-jean.mp3', 'Billie Jean is not my lover...', 'https://example.com/covers/billie-jean.jpg', false),
('Hotel California', 'Eagles', 'Hotel California', 'Rock', 391, 4, 'https://example.com/audio/hotel-california.mp3', 'On a dark desert highway...', 'https://example.com/covers/hotel-california.jpg', true),
('Perfect', 'Ed Sheeran', '÷ (Divide)', 'Pop', 263, 2, 'https://example.com/audio/perfect.mp3', 'I found a love for me...', 'https://example.com/covers/perfect.jpg', false);