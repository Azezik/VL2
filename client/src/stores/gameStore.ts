import { create } from 'zustand';

// Types for pricing information
export type GolfCourseAddOn = {
  name: string;
  price: number;
};

export type GolfGameTypePrice = {
  name: string;
  price: number | { weekday: number; weekend: number };
};

// Enhanced golf course type with pricing
export type GolfCourse = {
  name: string;
  availableGameTypes: string[];
  pricing: {
    gameTypes: GolfGameTypePrice[];
    addOns: GolfCourseAddOn[];
  };
};

// Golf courses with pricing data
export const golfCourses: GolfCourse[] = [
  { 
    name: "Pine View Golf Course", 
    availableGameTypes: ["18-hole", "Executive"],
    pricing: {
      gameTypes: [
        { name: "18-hole", price: 45 },
        { name: "Executive", price: 36 }
      ],
      addOns: [
        { name: "Power Cart 18 Holes", price: 22 },
        { name: "Power Cart 9 Holes", price: 15 },
        { name: "Push Cart", price: 7 }
      ]
    }
  },
  { 
    name: "The Marshes Golf Club", 
    availableGameTypes: ["18-hole", "9-hole short course"],
    pricing: {
      gameTypes: [
        { name: "18-hole", price: 125 },
        { name: "9-hole short course", price: 15 }
      ],
      addOns: [
        { name: "Cart included in green fee", price: 0 }
      ]
    }
  },
  {
    name: "White Sands Golf",
    availableGameTypes: ["9 Holes", "18 Holes"],
    pricing: {
      gameTypes: [
        { name: "9 Holes", price: { weekday: 25.50, weekend: 27.50 } },
        { name: "18 Holes", price: { weekday: 37.50, weekend: 41.50 } }
      ],
      addOns: [
        { name: "Practice & Play", price: 28.75 },
        { name: "Practice + Chipping Area", price: 30.00 }
      ]
    }
  },
  {
    name: "Metcalfe Golf Club",
    availableGameTypes: ["18-hole", "9-hole"],
    pricing: {
      gameTypes: [
        { name: "18-hole", price: 61 },
        { name: "9-hole", price: 30.50 }
      ],
      addOns: [
        { name: "Optional Replay", price: 31 }
      ]
    }
  },
  {
    name: "Thunderbird Golf Course",
    availableGameTypes: ["9-hole", "18-hole"],
    pricing: {
      gameTypes: [
        { name: "9-hole", price: 23 },
        { name: "18-hole", price: 30.80 }
      ],
      addOns: []
    }
  },
  {
    name: "Emerald Links",
    availableGameTypes: ["18-hole", "9-hole"],
    pricing: {
      gameTypes: [
        { name: "18-hole", price: 47 },
        { name: "9-hole", price: 37 }
      ],
      addOns: [
        { name: "Power Cart 18", price: 30 },
        { name: "Power Cart 9", price: 25 },
        { name: "Push Cart", price: 9.95 }
      ]
    }
  },
  {
    name: "Anderson Links",
    availableGameTypes: ["18-hole"],
    pricing: {
      gameTypes: [
        { name: "18-hole", price: { weekday: 44, weekend: 50 } }
      ],
      addOns: [
        { name: "Power Cart 18", price: 30 },
        { name: "Power Cart 9", price: 25 }
      ]
    }
  },
  {
    name: "Cedarhill",
    availableGameTypes: ["18-hole", "9-hole"],
    pricing: {
      gameTypes: [
        { name: "18-hole", price: 73 },
        { name: "9-hole", price: 50 }
      ],
      addOns: [
        { name: "Power Cart 18 (per seat)", price: 22 },
        { name: "Power Cart 9 (per seat)", price: 15 },
        { name: "Push Cart", price: 7 }
      ]
    }
  },
  {
    name: "Stittsville",
    availableGameTypes: ["Weekday", "Weekend"],
    pricing: {
      gameTypes: [
        { name: "Weekday", price: 36 },
        { name: "Weekend", price: 40 }
      ],
      addOns: []
    }
  },
  {
    name: "Falcon Ridge",
    availableGameTypes: ["AM Weekday", "PM", "Twilight"],
    pricing: {
      gameTypes: [
        { name: "AM Weekday", price: 43.35 },
        { name: "PM", price: 35.40 },
        { name: "Twilight", price: 26.55 }
      ],
      addOns: []
    }
  }
];

// Skill level definitions with descriptions
export type SkillLevel = {
  name: string;
  description: string;
  handicap: string;
};

export const skillLevels: SkillLevel[] = [
  { 
    name: "Never Played / First-Timer",
    description: "Never swung a club or only been to the driving range. No course experience.",
    handicap: "N/A"
  },
  { 
    name: "Beginner",
    description: "Played a few rounds. Learning how to swing, chip, and putt. Not yet scoring consistently.",
    handicap: "N/A"
  },
  { 
    name: "Casual / Recreational Golfer",
    description: "Play a few times per season. Comfortable on a course but rarely keep score seriously.",
    handicap: "~28–36+"
  },
  { 
    name: "Intermediate",
    description: "Play semi-regularly. Understand pace, etiquette, and keep score. Some consistency off the tee.",
    handicap: "~18–28"
  },
  { 
    name: "Experienced",
    description: "Solid swing fundamentals. Manage most holes well, shoot under 100 consistently.",
    handicap: "~10–18"
  },
  { 
    name: "Advanced / Competitive",
    description: "Play regularly, break 85 often, manage course strategy. Comfortable in amateur events.",
    handicap: "~4–10"
  },
  { 
    name: "Scratch / Tournament-Level",
    description: "Consistently shoot par or better. May compete in high-level amateur or pro qualifiers.",
    handicap: "0 or better (Scratch / + Index)"
  }
];

// Define our tee time booking type with cost information
export type Game = {
  id: string;
  title: string;
  skillLevel: string;
  location: string;
  gameTypes: string[];
  date: string;
  teeTime: string;
  numberOfPlayers: string;
  details: string;
  selectedAddOns?: string[];
  cost?: {
    greenFee: number;
    bookingFee: number;
    addOns: number;
    total: number;
    perPlayer: number;
  };
  organizerId?: string;
};

// Helper function to determine if it's a weekend
export const isWeekend = (dateString: string): boolean => {
  const date = new Date(dateString);
  return date.getDay() === 0 || date.getDay() === 6; // 0 is Sunday, 6 is Saturday
};

// Calculate green fee based on course, game type, and date
export const calculateGreenFee = (
  courseName: string,
  gameType: string,
  date: string
): number => {
  const course = golfCourses.find(c => c.name === courseName);
  if (!course) return 0;

  const gameTypePrice = course.pricing.gameTypes.find(gt => gt.name === gameType);
  if (!gameTypePrice) return 0;

  // Check if price is an object with weekday/weekend pricing or a fixed number
  if (typeof gameTypePrice.price === 'object') {
    return isWeekend(date) ? gameTypePrice.price.weekend : gameTypePrice.price.weekday;
  } else {
    return gameTypePrice.price;
  }
};

// Calculate add-on cost based on selected add-ons
export const calculateAddOnsCost = (
  courseName: string,
  selectedAddOns: string[]
): number => {
  const course = golfCourses.find(c => c.name === courseName);
  if (!course) return 0;

  return selectedAddOns.reduce((total, addOnName) => {
    const addOn = course.pricing.addOns.find(ao => ao.name === addOnName);
    return total + (addOn ? addOn.price : 0);
  }, 0);
};

// Calculate total cost and per player cost
export const calculateTotalCost = (
  greenFee: number,
  addOnsCost: number,
  numberOfPlayers: string
): { total: number, perPlayer: number } => {
  const bookingFee = 3.00; // Fixed booking fee
  const total = greenFee + bookingFee + addOnsCost;
  const perPlayer = total / parseInt(numberOfPlayers, 10);

  return {
    total,
    perPlayer
  };
};

// Get progress percentage based on number of players
export const getProgressPercentage = (numberOfPlayers: string): number => {
  const players = parseInt(numberOfPlayers, 10);
  if (players <= 0) return 0;
  return (1 / players) * 100;
};

// Sample organizer profiles
export type OrganizerProfile = {
  id: string;
  name: string;
  skillLevel: string;
  age: string;
  location: string;
  homeCourse: string;
  personalBestScore: string;
  bio: string;
  favoriteCourses: string[];
};

export const organizers: OrganizerProfile[] = [
  {
    id: "1",
    name: "John Doe",
    skillLevel: "Intermediate",
    age: "30-40",
    location: "Pine Valley",
    homeCourse: "Pine View Golf Course",
    personalBestScore: "82",
    bio: "I've been playing golf for about 5 years now. I enjoy weekend rounds with friends and am always looking to improve my game.",
    favoriteCourses: ["Pine View Golf Course", "White Sands Golf"]
  },
  {
    id: "2",
    name: "Jane Smith",
    skillLevel: "Beginner",
    age: "20-30",
    location: "Riverside",
    homeCourse: "White Sands Golf",
    personalBestScore: "95",
    bio: "New to golf but loving it! Looking for patient playing partners to learn with.",
    favoriteCourses: ["White Sands Golf", "Stittsville"]
  },
  {
    id: "3",
    name: "Michael Johnson",
    skillLevel: "Advanced / Competitive",
    age: "40-50",
    location: "Greenwood",
    homeCourse: "The Marshes Golf Club",
    personalBestScore: "75",
    bio: "Competitive golfer with 10+ years experience. Looking for challenging games with skilled players.",
    favoriteCourses: ["The Marshes Golf Club", "Cedarhill"]
  },
  {
    id: "4",
    name: "Emily Wilson",
    skillLevel: "Experienced",
    age: "30-40",
    location: "Lakeside",
    homeCourse: "Falcon Ridge",
    personalBestScore: "78",
    bio: "Playing for 8 years. Enjoy competitive yet friendly rounds. Always up for an evening game after work.",
    favoriteCourses: ["Falcon Ridge", "Emerald Links"]
  },
  {
    id: "5",
    name: "Robert Brown",
    skillLevel: "Casual / Recreational Golfer",
    age: "50-60",
    location: "Meadowvale",
    homeCourse: "Stittsville",
    personalBestScore: "88",
    bio: "Weekend golfer who plays for fun and relaxation. Not too serious about scores but enjoy the game.",
    favoriteCourses: ["Stittsville", "Anderson Links"]
  }
];

// Initial tee time data
const initialGames: Game[] = [
  { 
    id: '1', 
    title: "Morning Round at Pine View", 
    skillLevel: "Intermediate", 
    location: "Pine View Golf Course", 
    gameTypes: ["18-hole"], 
    date: "2025-05-20", 
    teeTime: "08:00", 
    numberOfPlayers: "4", 
    details: "Looking for a relaxed round with some friendly competition.",
    selectedAddOns: ["Power Cart 18 Holes"],
    cost: {
      greenFee: 45,
      bookingFee: 3,
      addOns: 22,
      total: 70,
      perPlayer: 17.5
    },
    organizerId: "1"
  },
  { 
    id: '2', 
    title: "Quick 9 at White Sands", 
    skillLevel: "Beginner", 
    location: "White Sands Golf", 
    gameTypes: ["9 Holes"], 
    date: "2025-05-18", 
    teeTime: "16:30", 
    numberOfPlayers: "3", 
    details: "Perfect for beginners, no pressure!",
    selectedAddOns: ["Practice & Play"],
    cost: {
      greenFee: 25.50,
      bookingFee: 3,
      addOns: 28.75,
      total: 57.25,
      perPlayer: 19.08
    },
    organizerId: "2"
  },
  { 
    id: '3', 
    title: "Full 18 at Marshes", 
    skillLevel: "Advanced / Competitive", 
    location: "The Marshes Golf Club", 
    gameTypes: ["18-hole"], 
    date: "2025-05-25", 
    teeTime: "07:15", 
    numberOfPlayers: "3", 
    details: "Looking for skilled players for a competitive round.",
    selectedAddOns: [],
    cost: {
      greenFee: 125,
      bookingFee: 3,
      addOns: 0,
      total: 128,
      perPlayer: 42.67
    },
    organizerId: "3"
  },
  { 
    id: '4', 
    title: "After-work Golf at Falcon Ridge", 
    skillLevel: "Experienced", 
    location: "Falcon Ridge", 
    gameTypes: ["PM"], 
    date: "2025-05-22", 
    teeTime: "17:00", 
    numberOfPlayers: "2", 
    details: "Quick evening round.",
    selectedAddOns: [],
    cost: {
      greenFee: 35.40,
      bookingFee: 3,
      addOns: 0,
      total: 38.40,
      perPlayer: 19.20
    },
    organizerId: "4"
  },
  { 
    id: '5', 
    title: "Casual Weekend Round", 
    skillLevel: "Casual / Recreational Golfer", 
    location: "Stittsville", 
    gameTypes: ["Weekend"], 
    date: "2025-05-24", 
    teeTime: "10:45", 
    numberOfPlayers: "4", 
    details: "Relaxed weekend golf with no pressure.",
    selectedAddOns: [],
    cost: {
      greenFee: 40,
      bookingFee: 3,
      addOns: 0,
      total: 43,
      perPlayer: 10.75
    },
    organizerId: "5"
  }
];

// Store interface
interface GameStore {
  games: Game[];
  addGame: (game: Omit<Game, 'id'>) => void;
  getGameTypesByLocation: (location: string) => string[];
  getAddOnsByLocation: (location: string) => GolfCourseAddOn[];
  getOrganizerById: (id: string) => OrganizerProfile | undefined;
}

// Create the store
export const useGameStore = create<GameStore>((set, get) => ({
  games: initialGames,
  addGame: (game) => set((state) => ({
    games: [...state.games, { ...game, id: Date.now().toString() }]
  })),
  getGameTypesByLocation: (location) => {
    const course = golfCourses.find(c => c.name === location);
    return course ? course.availableGameTypes : [];
  },
  getAddOnsByLocation: (location) => {
    const course = golfCourses.find(c => c.name === location);
    return course ? course.pricing.addOns : [];
  },
  
  getOrganizerById: (id) => {
    return organizers.find(organizer => organizer.id === id);
  }
}));