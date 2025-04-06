
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Trophy, TrendingUp, TrendingDown } from "lucide-react";

type UserRank = {
  id: string;
  rank: number;
  name: string;
  points: number;
  division: "gold" | "silver" | "bronze";
  winRate: number;
  change: "up" | "down" | "stable";
};

const getDivisionClass = (division: string) => {
  switch (division) {
    case "gold":
      return "rank-gold";
    case "silver":
      return "rank-silver";
    case "bronze":
      return "rank-bronze";
    default:
      return "bg-muted";
  }
};

const LeaderboardCard = ({ user }: { user: UserRank }) => {
  return (
    <Card className="hover-scale">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getDivisionClass(user.division)}`}>
              {user.rank}
            </div>
            <CardTitle className="text-lg">{user.name}</CardTitle>
          </div>
          <Badge variant="outline" className={getDivisionClass(user.division)}>
            {user.division.charAt(0).toUpperCase() + user.division.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between text-sm">
          <div className="flex items-center">
            <Trophy className="h-4 w-4 mr-1 text-arena-gold" />
            <span>{user.points} points</span>
          </div>
          <div className="flex items-center">
            <User className="h-4 w-4 mr-1" />
            <span>{user.winRate}% win rate</span>
          </div>
          <div className="flex items-center">
            {user.change === "up" ? (
              <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
            ) : user.change === "down" ? (
              <TrendingDown className="h-4 w-4 mr-1 text-red-500" />
            ) : (
              <span className="h-4 w-4 mr-1">-</span>
            )}
            <span>{user.change}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeaderboardCard;
