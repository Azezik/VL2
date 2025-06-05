import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock, Users, Info, BadgeAlert, DollarSign, User } from "lucide-react";
import { Game, skillLevels, getProgressPercentage } from "../stores/gameStore";
import GreenProgress from "./GreenProgress";
import { Link } from "wouter";

type GameDetailsModalProps = {
  game: Game | null;
  isOpen: boolean;
  onClose: () => void;
  onJoin: () => void;
  organizer?: {
    id: string;
    name: string;
    skillLevel: string;
    homeCourse?: string;
  };
};

export default function GameDetailsModal({
  game,
  isOpen,
  onClose,
  onJoin,
  organizer
}: GameDetailsModalProps) {
  if (!game) return null;

  // Format the date for display
  const formattedDate = game.date ? new Date(game.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : '';
  
  // Find skill level details
  const skillLevelDetail = skillLevels.find(s => s.name === game.skillLevel);
  
  // Calculate progress percentage
  const progressPercentage = getProgressPercentage(game.numberOfPlayers);

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-green-700">{game.title}</DialogTitle>
          <DialogDescription>
            View details and book this tee time at {game.location}
          </DialogDescription>
          {organizer && (
            <div className="mt-2 flex items-center text-sm text-gray-600">
              <User className="h-4 w-4 mr-1.5 text-green-600" />
              <Link 
                href={`/profile/${organizer.id}`} 
                onClick={(e) => e.stopPropagation()}
                className="text-blue-600 hover:underline font-medium mr-1.5"
              >
                {organizer.name}
              </Link>
              <span className="text-gray-400">|</span>
              <span className="ml-1.5">{organizer.skillLevel}</span>
              {organizer.homeCourse && (
                <>
                  <span className="text-gray-400 mx-1.5">|</span>
                  <span>{organizer.homeCourse}</span>
                </>
              )}
            </div>
          )}
          <div className="flex items-center flex-wrap gap-2 mt-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              {game.skillLevel}
            </Badge>
            {game.gameTypes.map((type) => (
              <Badge key={type} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {type}
              </Badge>
            ))}
          </div>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {skillLevelDetail && (
            <div className="bg-green-50 p-3 rounded-md border border-green-100">
              <div className="flex items-start gap-2">
                <BadgeAlert className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-green-700">Skill Level: {skillLevelDetail.name}</p>
                  <p className="text-green-600 text-sm">{skillLevelDetail.description}</p>
                  <p className="text-green-600 text-sm mt-1">Handicap: {skillLevelDetail.handicap}</p>
                </div>
              </div>
            </div>
          )}
        
          <div className="flex items-start gap-2">
            <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
            <div>
              <p className="font-medium">Golf Course</p>
              <p className="text-gray-600">{game.location}</p>
            </div>
          </div>
          
          {game.date && (
            <div className="flex items-start gap-2">
              <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium">Date</p>
                <p className="text-gray-600">{formattedDate}</p>
              </div>
            </div>
          )}
          
          {game.teeTime && (
            <div className="flex items-start gap-2">
              <Clock className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium">Tee Time</p>
                <p className="text-gray-600">{game.teeTime}</p>
              </div>
            </div>
          )}
          
          <div className="flex items-start gap-2">
            <Users className="h-5 w-5 text-gray-500 mt-0.5" />
            <div>
              <p className="font-medium">Number of Players</p>
              <p className="text-gray-600">{game.numberOfPlayers}</p>
            </div>
          </div>
          
          {/* Cost breakdown */}
          {game.cost && (
            <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
              <div className="flex items-start gap-2">
                <DollarSign className="h-5 w-5 text-green-600 mt-0.5" />
                <div className="w-full">
                  <p className="font-medium">Cost Breakdown</p>
                  
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Green Fee:</span>
                      <span className="text-gray-800">${game.cost.greenFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Booking Fee:</span>
                      <span className="text-gray-800">${game.cost.bookingFee.toFixed(2)}</span>
                    </div>
                    
                    {game.cost.addOns > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Add-ons:</span>
                        <span className="text-gray-800">${game.cost.addOns.toFixed(2)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between font-medium text-sm pt-1 border-t border-gray-200 mt-1">
                      <span>Total:</span>
                      <span className="text-green-700">${game.cost.total.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Per Player:</span>
                      <span className="text-green-700 font-medium">${game.cost.perPlayer.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  {/* Group progress bar */}
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600">Group Progress:</span>
                      <span className="text-gray-600">{Math.round(progressPercentage)}% filled</span>
                    </div>
                    <GreenProgress value={progressPercentage} />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Add-ons */}
          {game.selectedAddOns && game.selectedAddOns.length > 0 && (
            <div className="flex items-start gap-2">
              <Info className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium">Included Add-ons</p>
                <ul className="mt-1 space-y-1">
                  {game.selectedAddOns.map(addOn => (
                    <li key={addOn} className="text-gray-600 flex items-center">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                      {addOn}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          
          {/* Game details */}
          {game.details && (
            <div className="flex items-start gap-2">
              <Info className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium">Details</p>
                <p className="text-gray-600 whitespace-pre-wrap">{game.details}</p>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button className="bg-green-600 hover:bg-green-700" onClick={onJoin}>
            Book This Tee Time
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}