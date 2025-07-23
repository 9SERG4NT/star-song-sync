import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, Trophy } from 'lucide-react';

const Leaderboard = () => {
  const leaders = [
    { rank: 1, user: "Sarah M.", score: 98, performances: 45 },
    { rank: 2, user: "Mike R.", score: 96, performances: 38 },
    { rank: 3, user: "Alex K.", score: 94, performances: 52 },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
          Leaderboard
        </h1>
        <p className="text-muted-foreground">Top performers this week</p>
      </div>
      
      <div className="max-w-2xl mx-auto space-y-4">
        {leaders.map((leader) => (
          <Card key={leader.rank} className="hover:shadow-stage transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {leader.rank === 1 && <Crown className="h-6 w-6 text-yellow-500" />}
                    {leader.rank === 2 && <Trophy className="h-6 w-6 text-gray-400" />}
                    {leader.rank === 3 && <Trophy className="h-6 w-6 text-yellow-600" />}
                    <span className="text-2xl font-bold">#{leader.rank}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">{leader.user}</h3>
                    <p className="text-sm text-muted-foreground">
                      {leader.performances} performances
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-gradient-primary text-white text-lg px-3 py-1">
                  {leader.score}%
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;