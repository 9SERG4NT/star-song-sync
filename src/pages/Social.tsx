import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Heart, MessageCircle, Share } from 'lucide-react';

const Social = () => {
  const posts = [
    { id: 1, user: "Sarah M.", song: "Amazing Grace", score: 98, likes: 245, comments: 18 },
    { id: 2, user: "Mike R.", song: "Billie Jean", score: 96, likes: 189, comments: 12 },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 bg-gradient-primary bg-clip-text text-transparent">
        Social Feed
      </h1>
      <div className="max-w-2xl mx-auto space-y-6">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarFallback>{post.user[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-sm">{post.user}</CardTitle>
                  <p className="text-sm text-muted-foreground">sang {post.song}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="font-bold text-primary">{post.score}% Score</span>
                <div className="flex items-center space-x-4">
                  <Button variant="ghost" size="sm">
                    <Heart className="h-4 w-4" />
                    {post.likes}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MessageCircle className="h-4 w-4" />
                    {post.comments}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Social;