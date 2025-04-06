
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trophy, Award, Star, CircleCheck } from "lucide-react";

type UserStats = {
  id: string;
  name: string;
  division: "gold" | "silver" | "bronze";
  points: number;
  rank: number;
  matches: {
    total: number;
    won: number;
    lost: number;
    draw: number;
  };
  subjects: {
    name: string;
    proficiency: number;
  }[];
  achievements: {
    id: string;
    name: string;
    description: string;
    unlocked: boolean;
  }[];
};

const ProfileStats = ({ user }: { user: UserStats }) => {
  const winRate = user.matches.total > 0 
    ? Math.round((user.matches.won / user.matches.total) * 100) 
    : 0;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Trophy className="h-5 w-5 mr-2 text-arena-gold" />
            Ranking Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Division</span>
              <Badge className={`rank-${user.division}`}>
                {user.division.charAt(0).toUpperCase() + user.division.slice(1)}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Current Rank</span>
              <span>#{user.rank}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Total Points</span>
              <span>{user.points}</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span>Next Division Progress</span>
                <span>75%</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Star className="h-5 w-5 mr-2 text-arena-gold" />
            Match History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-2 text-center">
              <div>
                <div className="text-2xl font-bold">{user.matches.total}</div>
                <div className="text-xs text-muted-foreground">Matches</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-500">{user.matches.won}</div>
                <div className="text-xs text-muted-foreground">Won</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-500">{user.matches.lost}</div>
                <div className="text-xs text-muted-foreground">Lost</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-500">{user.matches.draw}</div>
                <div className="text-xs text-muted-foreground">Draw</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span>Win Rate</span>
                <span>{winRate}%</span>
              </div>
              <Progress value={winRate} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <CircleCheck className="h-5 w-5 mr-2 text-green-500" />
            Subject Proficiency
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {user.subjects.map((subject) => (
              <div key={subject.name} className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span>{subject.name}</span>
                  <span>{subject.proficiency}%</span>
                </div>
                <Progress value={subject.proficiency} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Award className="h-5 w-5 mr-2 text-arena-gold" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
            {user.achievements.map((achievement) => (
              <div 
                key={achievement.id} 
                className={`p-3 rounded-md border ${achievement.unlocked ? 'bg-secondary' : 'bg-muted opacity-60'}`}
              >
                <div className="flex items-center space-x-2">
                  {achievement.unlocked ? (
                    <Award className="h-4 w-4 text-arena-gold" />
                  ) : (
                    <Award className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className={`font-medium ${achievement.unlocked ? '' : 'text-muted-foreground'}`}>
                    {achievement.name}
                  </span>
                </div>
                <p className="text-xs mt-1 text-muted-foreground">{achievement.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileStats;
