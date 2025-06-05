import { useState } from "react";
import Layout from "@/components/Layout";
import GameCard from "@/components/GameCard";
import GameDetailsModal from "@/components/GameDetailsModal";
import { Helmet } from "react-helmet";
import { useGameStore, skillLevels, OrganizerProfile } from "../stores/gameStore";
import { Game } from "../stores/gameStore";
import { useToast } from "@/hooks/use-toast";

export default function JoinGame() {
  const [skillFilter, setSkillFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");
  const { games, getOrganizerById } = useGameStore();
  const { toast } = useToast();
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [selectedOrganizer, setSelectedOrganizer] = useState<OrganizerProfile | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Filter games based on selected filters
  const filteredGames = games.filter(game => {
    // Apply skill level filter
    if (skillFilter !== "all" && game.skillLevel !== skillFilter) {
      return false;
    }
    
    // Apply course filter
    if (courseFilter !== "all" && game.location !== courseFilter) {
      return false;
    }
    
    return true;
  });
  
  const handleGameClick = (game: Game) => {
    setSelectedGame(game);
    
    // Get the organizer profile if available
    if (game.organizerId) {
      const organizer = getOrganizerById(game.organizerId);
      setSelectedOrganizer(organizer);
    } else {
      setSelectedOrganizer(undefined);
    }
    
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleJoinGame = () => {
    toast({
      title: "Tee Time Booked!",
      description: `You've booked a tee time for ${selectedGame?.title}. Confirmation has been sent to your email.`,
    });
    setIsModalOpen(false);
  };
  
  // Get unique list of courses from the games data
  const courses = Array.from(new Set(games.map(game => game.location)));
  
  return (
    <Layout title="Available Tee Times">
      <Helmet>
        <title>Book Tee Times - Virtual League Golf</title>
        <meta name="description" content="Browse and book golf tee times at top courses. Filter by skill level, course, and more." />
      </Helmet>
      
      <div className="max-w-3xl mx-auto">
        <div className="bg-green-50 p-4 rounded-lg mb-6 border border-green-100">
          <h2 className="text-green-800 font-bold text-lg mb-2">Find Your Perfect Tee Time</h2>
          <p className="text-green-700 text-sm mb-4">Browse available tee times at top golf courses. Filter by skill level and course to find the perfect match.</p>
          
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
                  <option key={level.name} value={level.name}>{level.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="course-filter" className="block text-sm font-medium text-green-700 mb-1">Filter by Golf Course:</label>
              <select 
                id="course-filter" 
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                className="w-full border border-green-200 rounded p-2 text-green-800 bg-white"
              >
                <option value="all">All Courses</option>
                {courses.map(course => (
                  <option key={course} value={course}>{course}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        <div>
          {filteredGames.length > 0 ? (
            filteredGames.map((game) => {
              // Get organizer info for each game card
              const organizer = game.organizerId ? getOrganizerById(game.organizerId) : undefined;
              
              return (
                <GameCard 
                  key={game.id}
                  title={game.title}
                  skillLevel={game.skillLevel}
                  location={game.location}
                  gameTypes={game.gameTypes}
                  date={game.date}
                  teeTime={game.teeTime}
                  numberOfPlayers={game.numberOfPlayers}
                  cost={game.cost}
                  selectedAddOns={game.selectedAddOns}
                  onClick={() => handleGameClick(game)}
                  organizer={organizer ? {
                    id: organizer.id,
                    name: organizer.name,
                    skillLevel: organizer.skillLevel
                  } : undefined}
                />
              );
            })
          ) : (
            <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-500">No tee times match your filters. Try adjusting your criteria.</p>
            </div>
          )}
        </div>

        <GameDetailsModal
          game={selectedGame}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onJoin={handleJoinGame}
          organizer={selectedOrganizer ? {
            id: selectedOrganizer.id,
            name: selectedOrganizer.name,
            skillLevel: selectedOrganizer.skillLevel,
            homeCourse: selectedOrganizer.homeCourse
          } : undefined}
        />
      </div>
    </Layout>
  );
}
