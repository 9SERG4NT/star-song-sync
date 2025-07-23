import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { Mic, Users, Trophy, Settings } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-gradient-primary text-white text-2xl">
                  {user.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle className="text-2xl">{user.email}</CardTitle>
                <p className="text-muted-foreground">Karaoke Enthusiast</p>
              </div>
              <Button variant="outline">
                <Settings className="h-4 w-4" />
                Edit Profile
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">12</div>
                <div className="text-sm text-muted-foreground flex items-center justify-center">
                  <Mic className="h-4 w-4 mr-1" />
                  Performances
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">48</div>
                <div className="text-sm text-muted-foreground flex items-center justify-center">
                  <Users className="h-4 w-4 mr-1" />
                  Followers
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">92%</div>
                <div className="text-sm text-muted-foreground flex items-center justify-center">
                  <Trophy className="h-4 w-4 mr-1" />
                  Best Score
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;