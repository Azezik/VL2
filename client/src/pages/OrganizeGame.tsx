import { useState, useEffect, useMemo } from "react";
import Layout from "@/components/Layout";
import { Helmet } from "react-helmet";
import { 
  useGameStore, 
  golfCourses, 
  skillLevels, 
  calculateGreenFee,
  calculateAddOnsCost,
  calculateTotalCost,
  getProgressPercentage,
  GolfCourseAddOn 
} from "../stores/gameStore";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import GreenProgress from "@/components/GreenProgress";
import { Info, DollarSign, Users } from "lucide-react";

export default function OrganizeGame() {
  const [formData, setFormData] = useState({
    title: "",
    skillLevel: skillLevels[0].name,
    location: golfCourses[0].name,
    gameTypes: [] as string[],
    date: new Date().toISOString().split('T')[0], // Today as default
    teeTime: "10:00",
    numberOfPlayers: "4",
    details: "",
    selectedAddOns: [] as string[]
  });
  
  const [availableGameTypes, setAvailableGameTypes] = useState<string[]>([]);
  const [availableAddOns, setAvailableAddOns] = useState<GolfCourseAddOn[]>([]);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  const { addGame, getGameTypesByLocation, getAddOnsByLocation } = useGameStore();
  const [, setLocation] = useLocation();

  // Update available game types when location changes
  useEffect(() => {
    const gameTypes = getGameTypesByLocation(formData.location);
    setAvailableGameTypes(gameTypes);
    
    // If no game types are selected or the selected ones are not available, select the first available
    if (!formData.gameTypes.length || !formData.gameTypes.every(type => gameTypes.includes(type))) {
      setFormData(prev => ({
        ...prev,
        gameTypes: gameTypes.length > 0 ? [gameTypes[0]] : []
      }));
    }
    
    // Get available add-ons for this course
    const addOns = getAddOnsByLocation(formData.location);
    setAvailableAddOns(addOns);
    
    // Reset selected add-ons if the current selections aren't available at this course
    setFormData(prev => ({
      ...prev,
      selectedAddOns: prev.selectedAddOns.filter(
        addOn => addOns.some(ao => ao.name === addOn)
      )
    }));
  }, [formData.location, getGameTypesByLocation, getAddOnsByLocation]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is changed
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const handleGameTypeChange = (type: string) => {
    // For golf booking, we'll only allow one game type at a time
    setFormData(prev => ({
      ...prev,
      gameTypes: [type]
    }));
    
    // Clear error when field is changed
    if (formErrors.gameTypes) {
      setFormErrors(prev => {
        const newErrors = {...prev};
        delete newErrors.gameTypes;
        return newErrors;
      });
    }
  };
  
  const handleAddOnChange = (addOn: string, checked: boolean) => {
    setFormData(prev => {
      const currentAddOns = [...prev.selectedAddOns];
      
      if (checked) {
        return {
          ...prev,
          selectedAddOns: [...currentAddOns, addOn]
        };
      } else {
        return {
          ...prev,
          selectedAddOns: currentAddOns.filter(ao => ao !== addOn)
        };
      }
    });
  };
  
  // Calculate pricing information based on current form data
  const pricing = useMemo(() => {
    if (!formData.gameTypes.length || !formData.date) {
      return {
        greenFee: 0,
        bookingFee: 3, // Fixed booking fee
        addOns: 0,
        total: 3,
        perPlayer: 3 / parseInt(formData.numberOfPlayers || "1", 10)
      };
    }
    
    const greenFee = calculateGreenFee(
      formData.location,
      formData.gameTypes[0],
      formData.date
    );
    
    const addOnsCost = calculateAddOnsCost(
      formData.location,
      formData.selectedAddOns
    );
    
    const { total, perPlayer } = calculateTotalCost(
      greenFee,
      addOnsCost,
      formData.numberOfPlayers
    );
    
    return {
      greenFee,
      bookingFee: 3, // Fixed booking fee
      addOns: addOnsCost,
      total,
      perPlayer
    };
  }, [
    formData.location,
    formData.gameTypes,
    formData.date,
    formData.selectedAddOns,
    formData.numberOfPlayers
  ]);
  
  // Calculate progress percentage based on number of players
  const progressPercentage = useMemo(() => {
    return getProgressPercentage(formData.numberOfPlayers);
  }, [formData.numberOfPlayers]);
  
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.date) {
      errors.date = "Date is required";
    }
    
    if (!formData.teeTime) {
      errors.teeTime = "Tee time is required";
    }
    
    if (formData.gameTypes.length === 0) {
      errors.gameTypes = "At least one game type must be selected";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Generate a descriptive title if one isn't provided
    const submissionData = {...formData};
    if (!submissionData.title.trim()) {
      const date = new Date(submissionData.date);
      const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      submissionData.title = `${formattedDate} Tee Time at ${submissionData.location}`;
    }
    
    // Add cost information to the game
    const gameWithCost = {
      ...submissionData,
      cost: pricing
    };
    
    // Add the new tee time to the store
    addGame(gameWithCost);
    
    console.log("Tee time added:", gameWithCost);
    alert("Tee time created successfully! You can view it in the Available Tee Times page.");
    
    // Reset form
    setFormData({
      title: "",
      skillLevel: skillLevels[0].name,
      location: golfCourses[0].name,
      gameTypes: availableGameTypes.length > 0 ? [availableGameTypes[0]] : [],
      date: new Date().toISOString().split('T')[0],
      teeTime: "10:00",
      numberOfPlayers: "4",
      details: "",
      selectedAddOns: []
    });
    
    // Redirect to the Join a Game page
    setLocation("/join-a-game");
  };

  return (
    <Layout title="Create a Tee Time">
      <Helmet>
        <title>Create a Tee Time - Virtual League Golf</title>
        <meta name="description" content="Create and organize golf tee times. Specify skill level, course, and game details." />
      </Helmet>
      
      <div className="max-w-3xl mx-auto">
        <div className="bg-green-50 p-5 rounded-lg mb-6 border border-green-100">
          <h2 className="text-green-800 font-bold text-lg mb-2">Create a Tee Time</h2>
          <p className="text-green-700 text-sm">Fill out the form below to create a new tee time. Fields marked with an asterisk (*) are required.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Title */}
            <div className="col-span-2">
              <label htmlFor="title" className="block font-medium mb-1 text-gray-700">
                Ad Title <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input 
                type="text" 
                id="title" 
                name="title" 
                value={formData.title}
                onChange={handleChange}
                className={`w-full p-2.5 border ${formErrors.title ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50`}
                placeholder="Leave blank for auto-generated title"
              />
              {formErrors.title && <p className="mt-1 text-sm text-red-500">{formErrors.title}</p>}
            </div>
            
            {/* Skill Level */}
            <div>
              <label htmlFor="skillLevel" className="block font-medium mb-1 text-gray-700">
                Skill Level *
              </label>
              <select 
                id="skillLevel" 
                name="skillLevel"
                value={formData.skillLevel}
                onChange={handleChange}
                className="w-full p-2.5 border border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                required
              >
                {skillLevels.map(level => (
                  <option key={level.name} value={level.name} title={level.description}>
                    {level.name}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">
                {skillLevels.find(s => s.name === formData.skillLevel)?.description || ''}
              </p>
            </div>
            
            {/* Location */}
            <div>
              <label htmlFor="location" className="block font-medium mb-1 text-gray-700">
                Location *
              </label>
              <select 
                id="location" 
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full p-2.5 border border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                required
              >
                {golfCourses.map(course => (
                  <option key={course.name} value={course.name}>
                    {course.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Game Type */}
            <div className="col-span-2">
              <label className="block font-medium mb-2 text-gray-700">
                Game Type *
              </label>
              <div className="flex flex-wrap gap-2">
                {availableGameTypes.map(type => (
                  <Button
                    key={type}
                    type="button"
                    variant={formData.gameTypes.includes(type) ? "default" : "outline"}
                    onClick={() => handleGameTypeChange(type)}
                    className={formData.gameTypes.includes(type) ? "bg-green-600 hover:bg-green-700" : ""}
                  >
                    {type}
                  </Button>
                ))}
              </div>
              {formErrors.gameTypes && <p className="mt-1 text-sm text-red-500">{formErrors.gameTypes}</p>}
              {availableGameTypes.length === 0 && (
                <p className="mt-1 text-sm text-amber-600">No game types available for the selected course.</p>
              )}
            </div>
            
            {/* Date */}
            <div>
              <label htmlFor="date" className="block font-medium mb-1 text-gray-700">
                Date *
              </label>
              <input 
                type="date" 
                id="date" 
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={`w-full p-2.5 border ${formErrors.date ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50`}
                min={new Date().toISOString().split('T')[0]} // Today or later
                required
              />
              {formErrors.date && <p className="mt-1 text-sm text-red-500">{formErrors.date}</p>}
            </div>
            
            {/* Tee Time */}
            <div>
              <label htmlFor="teeTime" className="block font-medium mb-1 text-gray-700">
                Tee Time *
              </label>
              <input 
                type="time" 
                id="teeTime" 
                name="teeTime"
                value={formData.teeTime}
                onChange={handleChange}
                className={`w-full p-2.5 border ${formErrors.teeTime ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50`}
                min="06:30"
                max="19:00"
                step="900" // 15-minute intervals
                required
              />
              {formErrors.teeTime && <p className="mt-1 text-sm text-red-500">{formErrors.teeTime}</p>}
              <p className="mt-1 text-xs text-gray-500">Tee times available from 6:30 AM to 7:00 PM</p>
            </div>
            
            {/* Number of Players */}
            <div>
              <label htmlFor="numberOfPlayers" className="block font-medium mb-1 text-gray-700">
                Number of Players *
              </label>
              <select 
                id="numberOfPlayers" 
                name="numberOfPlayers"
                value={formData.numberOfPlayers}
                onChange={handleChange}
                className="w-full p-2.5 border border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                required
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </div>
            
            {/* Cost Breakdown & Progress */}
            <div className="col-span-2 mt-2 bg-green-50 p-4 rounded-lg border border-green-100">
              <h3 className="text-green-800 font-semibold text-md mb-3 flex items-center">
                <DollarSign className="h-5 w-5 mr-1 text-green-600" />
                Cost Breakdown
              </h3>
              
              <div className="space-y-2 mb-4 pb-4 border-b border-green-100">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Green Fee:</span>
                  <span className="text-gray-800 font-medium">${pricing.greenFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Booking Fee:</span>
                  <span className="text-gray-800 font-medium">${pricing.bookingFee.toFixed(2)}</span>
                </div>
                {pricing.addOns > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Add-Ons:</span>
                    <span className="text-gray-800 font-medium">${pricing.addOns.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-medium pt-2 border-t border-green-100">
                  <span className="text-gray-700">Total Cost:</span>
                  <span className="text-green-700">${pricing.total.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="mb-2 flex justify-between items-center">
                <div className="flex items-center text-gray-700">
                  <Users className="h-4 w-4 mr-1 text-green-600" />
                  <span className="text-sm font-medium">Group Progress:</span>
                </div>
                <span className="text-sm text-gray-600">
                  {Math.round(progressPercentage)}% (You + {parseInt(formData.numberOfPlayers) - 1} more)
                </span>
              </div>
              
              <GreenProgress value={progressPercentage} />
              
              <div className="flex justify-between items-center mt-2 text-sm">
                <span className="text-gray-500">Per Player Cost:</span>
                <span className="text-green-700 font-medium">${pricing.perPlayer.toFixed(2)}</span>
              </div>
            </div>
            
            {/* Add-ons */}
            {availableAddOns.length > 0 && (
              <div className="col-span-2 space-y-4">
                <h3 className="text-gray-700 font-medium">Add-ons (Optional)</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {availableAddOns.map(addOn => (
                    <label
                      key={addOn.name}
                      className="flex items-center space-x-2 border rounded-md p-3 hover:bg-gray-50 cursor-pointer"
                    >
                      <Checkbox
                        id={`addon-${addOn.name}`}
                        checked={formData.selectedAddOns.includes(addOn.name)}
                        onCheckedChange={(checked) => handleAddOnChange(addOn.name, checked as boolean)}
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-700">{addOn.name}</div>
                        <div className="text-green-600 text-sm">
                          ${addOn.price.toFixed(2)}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}
            
            {/* Details */}
            <div className="col-span-2">
              <label htmlFor="details" className="block font-medium mb-1 text-gray-700">
                Details <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea 
                id="details" 
                name="details"
                value={formData.details}
                onChange={handleChange}
                className="w-full p-2.5 border border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 h-32 resize-vertical"
                placeholder="Add any special requests or notes about your tee time"
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 mt-8 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setLocation("/join-a-game")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700"
            >
              Create Tee Time
            </Button>
          </div>
          
          <div className="mt-4 flex items-start gap-2 text-sm text-gray-500 bg-gray-50 p-3 rounded-md border border-gray-200">
            <Info className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
            <p>
              After creating a tee time, it will be visible to other users with matching skill levels.
              You'll receive confirmation via email and can manage your tee times from your account dashboard.
            </p>
          </div>
        </form>
      </div>
    </Layout>
  );
}
