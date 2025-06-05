import { useState } from "react";
import { Link } from "wouter";
import Layout from "@/components/Layout";
import { Helmet } from "react-helmet";
import { organizers } from "../stores/gameStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Trophy, Heart, Calendar, Flag, TrendingUp } from "lucide-react";

export default function FindPlayers() {
  const [skillFilter, setSkillFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  
  // Filter players by skill level
  const filteredPlayers = skillFilter === "all" 
    ? organizers 
    : organizers.filter(player => player.skillLevel === skillFilter);
    
  // Sort players based on the selected criteria
  const sortedPlayers = [...filteredPlayers].sort((a, b) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    } else if (sortBy === "skill") {
      return a.skillLevel.localeCompare(b.skillLevel);
    } else if (sortBy === "score") {
      return parseInt(a.personalBestScore) - parseInt(b.personalBestScore);
    }
    return 0;
  });
  
  // Get unique skill levels for filter options
  const skillLevels = Array.from(new Set(organizers.map(player => player.skillLevel)));
  
  return (
    <Layout title="Find Golf Players">
      <Helmet>
        <title>Find Golf Players - Virtual League Golf</title>
        <meta name="description" content="Browse our database of golfers by skill level. Find players for your next round of golf." />
      </Helmet>
      
      <div className="max-w-4xl mx-auto">
        <div className="bg-green-50 p-4 rounded-lg mb-6 border border-green-100">
          <h2 className="text-green-800 font-bold text-lg mb-2">Find Players for Your Next Round</h2>
          <p className="text-green-700 text-sm mb-4">Connect with fellow golfers to join your tee time or find someone to play with.</p>
          
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="skill-filter" className="block text-sm font-medium text-green-700 mb-1">Filter by Skill Level:</label>
              <select 
                id="skill-filter" 
                value={skillFilter}
                onChange={(e) => setSkillFilter(e.target.value)}
                className="w-full border border-green-200 rounded p-2 text-green-800 bg-white"
              >
                <option value="all">All Skill Levels</option>
                {skillLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="sort-by" className="block text-sm font-medium text-green-700 mb-1">Sort By:</label>
              <select 
                id="sort-by" 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full border border-green-200 rounded p-2 text-green-800 bg-white"
              >
                <option value="name">Name (A-Z)</option>
                <option value="skill">Skill Level</option>
                <option value="score">Best Score</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="grid sm:grid-cols-2 gap-4">
          {sortedPlayers.map((player) => (
            <Card key={player.id} className="overflow-hidden border border-gray-200 hover:border-green-300 hover:shadow-md transition-all">
              <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      <Link href={`/profile/${player.id}`} className="text-green-700 hover:text-green-500 hover:underline">
                        {player.name}
                      </Link>
                    </CardTitle>
                    <CardDescription className="text-gray-600">{player.age} • {player.location}</CardDescription>
                  </div>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                    {player.skillLevel}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-3">
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Flag className="h-4 w-4 mr-2 text-green-600" />
                    <span className="text-gray-700">Home Course: {player.homeCourse}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Trophy className="h-4 w-4 mr-2 text-amber-600" />
                    <span className="text-gray-700">Best Score: {player.personalBestScore}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Heart className="h-4 w-4 mr-2 text-red-500" />
                    <span className="text-gray-700">Favorite: {player.favoriteCourses[0]}</span>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-sm text-gray-600 line-clamp-2">{player.bio}</p>
                  </div>
                  
                  <div className="pt-2">
                    <Link href={`/profile/${player.id}`}>
                      <Button variant="outline" size="sm" className="w-full border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800">
                        View Full Profile
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
