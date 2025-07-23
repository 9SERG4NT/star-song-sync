import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { 
  Mic, 
  Music, 
  Users, 
  Trophy, 
  Star,
  Play,
  Heart,
  MessageCircle,
  TrendingUp,
  Crown,
  Zap
} from 'lucide-react';

const Home = () => {
  const { user } = useAuth();

  const featuredSongs = [
    {
      id: 1,
      title: "Bohemian Rhapsody",
      artist: "Queen",
      difficulty: 5,
      plays: "12.5K",
      image: "/song-covers/bohemian-rhapsody.jpg"
    },
    {
      id: 2, 
      title: "Shape of You",
      artist: "Ed Sheeran",
      difficulty: 2,
      plays: "8.9K",
      image: "/song-covers/shape-of-you.jpg"
    },
    {
      id: 3,
      title: "Perfect",
      artist: "Ed Sheeran", 
      difficulty: 2,
      plays: "6.7K",
      image: "/song-covers/perfect.jpg"
    }
  ];

  const topPerformances = [
    {
      id: 1,
      title: "Amazing Grace",
      artist: "Traditional",
      performer: "Sarah M.",
      score: 98,
      likes: 245,
      comments: 18
    },
    {
      id: 2,
      title: "Billie Jean", 
      artist: "Michael Jackson",
      performer: "Mike R.",
      score: 96,
      likes: 189,
      comments: 12
    },
    {
      id: 3,
      title: "Hotel California",
      artist: "Eagles",
      performer: "Alex K.",
      score: 94,
      likes: 167,
      comments: 8
    }
  ];

  const stats = [
    { label: "Active Singers", value: "50K+", icon: Users },
    { label: "Songs Available", value: "100K+", icon: Music },
    { label: "Performances", value: "2M+", icon: Mic },
    { label: "Daily Duets", value: "5K+", icon: Heart }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/10">
        <div className="absolute inset-0 bg-gradient-glow opacity-30"></div>
        <div className="container mx-auto px-4 py-16 lg:py-24 relative">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold">
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  Sing Your Heart Out
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
                The ultimate social karaoke platform. Sing solo, duet with friends, 
                and compete with singers worldwide.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {user ? (
                <>
                  <Button variant="neon" size="xl" asChild>
                    <Link to="/karaoke">
                      <Mic className="h-5 w-5" />
                      Start Singing Now
                    </Link>
                  </Button>
                  <Button variant="stage" size="xl" asChild>
                    <Link to="/discover">
                      <Music className="h-5 w-5" />
                      Discover Songs
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="neon" size="xl" asChild>
                    <Link to="/auth">
                      <Zap className="h-5 w-5" />
                      Get Started Free
                    </Link>
                  </Button>
                  <Button variant="stage" size="xl" asChild>
                    <Link to="/discover">
                      <Play className="h-5 w-5" />
                      Explore Now
                    </Link>
                  </Button>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto pt-8">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="flex justify-center mb-2">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Songs */}
      <section className="py-16 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Featured Songs
              </span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Popular tracks that everyone's singing
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {featuredSongs.map((song) => (
              <Card key={song.id} className="group hover:shadow-neon transition-all duration-300 cursor-pointer border-border/50">
                <CardContent className="p-6">
                  <div className="aspect-square bg-gradient-stage rounded-lg mb-4 flex items-center justify-center">
                    <Music className="h-12 w-12 text-white" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg line-clamp-1">{song.title}</h3>
                    <p className="text-muted-foreground">{song.artist}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">
                        {Array.from({ length: song.difficulty }).map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-current" />
                        ))}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{song.plays} plays</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" asChild>
              <Link to="/discover">
                View All Songs
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Top Performances */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Top Performances
              </span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Amazing covers from our community
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {topPerformances.map((performance, index) => (
              <Card key={performance.id} className="group hover:shadow-stage transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Crown className={`h-5 w-5 ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : 'text-yellow-600'}`} />
                      <span className="font-bold text-lg">#{index + 1}</span>
                    </div>
                    <Badge variant="secondary" className="bg-gradient-primary text-white">
                      {performance.score}%
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold">{performance.title}</h3>
                      <p className="text-sm text-muted-foreground">{performance.artist}</p>
                      <p className="text-sm text-primary">by {performance.performer}</p>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Heart className="h-4 w-4" />
                        <span>{performance.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="h-4 w-4" />
                        <span>{performance.comments}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" asChild>
              <Link to="/leaderboard">
                View Leaderboard
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Join the Stage?
            </h2>
            <p className="text-lg text-muted-foreground">
              Start your musical journey today. Sing, connect, and compete with 
              singers from around the world.
            </p>
            {!user && (
              <Button variant="neon" size="xl" asChild>
                <Link to="/auth">
                  <Mic className="h-5 w-5" />
                  Join StarSync Now
                </Link>
              </Button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;