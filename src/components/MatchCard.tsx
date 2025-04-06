
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Award } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export type Match = {
  id: string;
  title: string;
  subject: string;
  difficulty: "easy" | "medium" | "hard";
  timeLimit: number; // in minutes
  participants: {
    current: number;
    max: number;
  };
  startTime: Date;
  pointsAvailable: number;
};

const difficultyColor = {
  easy: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  hard: "bg-red-100 text-red-800",
};

const MatchCard = ({ match }: { match: Match }) => {
  return (
    <Card className="hover-scale">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{match.title}</CardTitle>
            <p className="text-sm text-muted-foreground">{match.subject}</p>
          </div>
          <Badge className={difficultyColor[match.difficulty]}>
            {match.difficulty.charAt(0).toUpperCase() + match.difficulty.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
            <span>{match.timeLimit} minutes</span>
          </div>
          <div className="flex items-center">
            <Award className="h-4 w-4 mr-1 text-arena-gold" />
            <span>{match.pointsAvailable} points</span>
          </div>
          <div className="col-span-2 flex items-center justify-between mt-2">
            <span className="text-sm text-muted-foreground">
              Starts {formatDistanceToNow(match.startTime, { addSuffix: true })}
            </span>
            <span className="text-sm font-medium">
              {match.participants.current}/{match.participants.max} joined
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Join Match</Button>
      </CardFooter>
    </Card>
  );
};

export default MatchCard;
