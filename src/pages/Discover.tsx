import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Music, Star, Play } from 'lucide-react';

const Discover = () => {
  const songs = [
    { id: 1, title: "Bohemian Rhapsody", artist: "Queen", difficulty: 5, plays: "12.5K" },
    { id: 2, title: "Shape of You", artist: "Ed Sheeran", difficulty: 2, plays: "8.9K" },
    { id: 3, title: "Perfect", artist: "Ed Sheeran", difficulty: 2, plays: "6.7K" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 bg-gradient-primary bg-clip-text text-transparent">
        Discover Songs
      </h1>
      <div className="grid md:grid-cols-3 gap-6">
        {songs.map((song) => (
          <Card key={song.id} className="hover:shadow-neon transition-all">
            <CardContent className="p-6">
              <div className="aspect-square bg-gradient-stage rounded-lg mb-4 flex items-center justify-center">
                <Music className="h-12 w-12 text-white" />
              </div>
              <h3 className="font-semibold text-lg">{song.title}</h3>
              <p className="text-muted-foreground">{song.artist}</p>
              <div className="flex items-center justify-between mt-2">
                <Badge variant="secondary">
                  {Array.from({ length: song.difficulty }).map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-current" />
                  ))}
                </Badge>
                <Button variant="neon" size="sm">
                  <Play className="h-4 w-4" />
                  Sing
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Discover;