
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Trophy, User, Home, Award, BookOpen, Book } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const NavBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { toast } = useToast();

  const handleLogin = () => {
    setIsLoggedIn(true);
    toast({
      title: "Logged in successfully",
      description: "Welcome to Academic Arena!",
    });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    toast({
      title: "Logged out",
      description: "Come back soon!",
    });
  };

  return (
    <nav className="bg-card shadow-md py-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Trophy className="h-8 w-8 text-arena-gold" />
          <Link to="/" className="text-2xl font-bold text-primary">
            Academic Arena
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-6">
          <Link 
            to="/" 
            className="flex items-center space-x-1 hover:text-primary transition-colors"
          >
            <Home className="h-4 w-4" />
            <span>Home</span>
          </Link>
          <Link 
            to="/leaderboard" 
            className="flex items-center space-x-1 hover:text-primary transition-colors"
          >
            <Trophy className="h-4 w-4" />
            <span>Leaderboard</span>
          </Link>
          <Link 
            to="/matches" 
            className="flex items-center space-x-1 hover:text-primary transition-colors"
          >
            <BookOpen className="h-4 w-4" />
            <span>Matches</span>
          </Link>
          <Link 
            to="/achievements" 
            className="flex items-center space-x-1 hover:text-primary transition-colors"
          >
            <Award className="h-4 w-4" />
            <span>Achievements</span>
          </Link>
          <Link 
            to="/books" 
            className="flex items-center space-x-1 hover:text-primary transition-colors"
          >
            <Book className="h-4 w-4" />
            <span>Books</span>
          </Link>
        </div>

        <div className="flex items-center space-x-2">
          {isLoggedIn ? (
            <>
              <Link to="/profile">
                <Button variant="outline" size="sm" className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </Button>
              </Link>
              <Button onClick={handleLogout} variant="destructive" size="sm">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button onClick={handleLogin} variant="default" size="sm">
                Login
              </Button>
              <Link to="/register">
                <Button variant="outline" size="sm">
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
