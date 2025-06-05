import { CalendarIcon, Clock, MapPin, Users, DollarSign, User } from "lucide-react";
import { Game, getProgressPercentage } from "../stores/gameStore";
import GreenProgress from "./GreenProgress";
import { Link } from "wouter";

type GameCardProps = {
  title: string;
  skillLevel: string;
  location: string;
  gameTypes: string[];
  date: string;
  teeTime: string;
  numberOfPlayers: string;
  onClick: () => void;
  cost?: Game['cost'];
  selectedAddOns?: string[];
  organizer?: {
    id: string;
    name: string;
    skillLevel: string;
  };
};

export default function GameCard({ 
  title, 
  skillLevel, 
  location, 
  gameTypes, 
  date, 
  teeTime, 
  numberOfPlayers, 
  onClick,
  cost,
  selectedAddOns = [],
  organizer
}: GameCardProps) {
  // Format the date for display
  const formattedDate = date ? new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  }) : '';
  
  // Calculate progress percentage based on number of players
  const progressPercentage = getProgressPercentage(numberOfPlayers);

  return (
    <div 
      className="bg-white border border-gray-200 p-4 rounded-md mb-4 cursor-pointer hover:border-green-500 transition-colors shadow-sm" 
      data-skill={skillLevel}
      onClick={onClick}
    >
      <div className="font-bold text-lg text-green-700">{title}</div>
      
      {/* Organizer profile info with link */}
      {organizer && (
        <div className="mt-2 flex items-center text-sm text-gray-600 hover:text-green-700">
          <User className="h-3.5 w-3.5 mr-1" />
          <Link 
            href={`/profile/${organizer.id}`} 
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-blue-600 hover:underline cursor-pointer">
              {organizer.name}
            </span>
          </Link>
          <span className="mx-1">•</span>
          <span>{organizer.skillLevel}</span>
        </div>
      )}
      
      <div className="mt-3 flex items-center gap-2 flex-wrap">
        <div className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
          {skillLevel}
        </div>
        {gameTypes.map((type) => (
          <div key={type} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
            {type}
          </div>
        ))}
      </div>
      
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="flex items-center gap-1 text-gray-600">
          <MapPin className="h-4 w-4 text-gray-400" />
          <span className="text-sm">{location}</span>
        </div>
        
        <div className="flex items-center gap-1 text-gray-600">
          <Users className="h-4 w-4 text-gray-400" />
          <span className="text-sm">{numberOfPlayers} {parseInt(numberOfPlayers) === 1 ? 'Player' : 'Players'}</span>
        </div>
        
        <div className="flex items-center gap-1 text-gray-600">
          <CalendarIcon className="h-4 w-4 text-gray-400" />
          <span className="text-sm">{formattedDate}</span>
        </div>
        
        <div className="flex items-center gap-1 text-gray-600">
          <Clock className="h-4 w-4 text-gray-400" />
          <span className="text-sm">{teeTime}</span>
        </div>
      </div>
      
      {/* Cost breakdown and progress */}
      {cost && (
        <div className="mt-4 pt-3 border-t">
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center text-gray-700">
              <DollarSign className="h-4 w-4 mr-1 text-green-600" />
              <span className="text-sm font-medium">Total: ${cost.total.toFixed(2)}</span>
            </div>
            <span className="text-green-600 font-medium">${cost.perPlayer.toFixed(2)}/player</span>
          </div>
          
          {/* Progress bar showing group completion percentage */}
          <div className="mb-1 flex justify-between items-center">
            <span className="text-xs text-gray-500">Group progress:</span>
            <span className="text-xs text-gray-500">
              {Math.round(progressPercentage)}% filled
            </span>
          </div>
          <GreenProgress value={progressPercentage} />
          
          {/* Add-ons */}
          {selectedAddOns && selectedAddOns.length > 0 && (
            <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
              <div className="col-span-2 text-xs text-gray-500 mt-1">Includes:</div>
              {selectedAddOns.map(addOn => (
                <div key={addOn} className="text-xs text-gray-600 flex items-center">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                  {addOn}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      <div className="text-blue-500 text-sm mt-3 flex justify-end">
        Click for details →
      </div>
    </div>
  );
}
