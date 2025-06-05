import { useEffect, useState } from "react";
import { useRoute, Link } from "wouter";
import Layout from "@/components/Layout";
import { Helmet } from "react-helmet";
import { organizers, OrganizerProfile, Game, useGameStore } from "../stores/gameStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flag, Trophy, Heart, MapPin, Calendar, Clock, User, Star, MessageSquare, AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Import for useToast
import { useToast } from "@/hooks/use-toast";

export default function PlayerProfile() {
  const [, params] = useRoute("/profile/:id");
  const [profile, setProfile] = useState<OrganizerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const { games } = useGameStore();
  const [upcomingGames, setUpcomingGames] = useState<Game[]>([]);
  const [isMyProfile, setIsMyProfile] = useState(false);
  const { toast } = useToast();
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [replyText, setReplyText] = useState("");
  const [messageText, setMessageText] = useState("");
  
  // Mock messages for the inbox feature
  const [messages, setMessages] = useState([
    { 
      id: '1', 
      from: {id: '2', name: 'Jane Smith'}, 
      subject: 'Join my golf round?', 
      message: 'Hi! Saw you were available this weekend. Would you like to join us for a round at White Sands on Saturday?',
      date: '2025-05-10',
      read: false
    },
    { 
      id: '2', 
      from: {id: '3', name: 'Michael Johnson'}, 
      subject: 'Thanks for the game', 
      message: 'Great playing with you last week! Let me know if you want to join us again sometime.',
      date: '2025-05-02',
      read: true
    }
  ]);

  // Load profile data
  useEffect(() => {
    const loadProfile = () => {
      setLoading(true);
      
      if (params?.id) {
        // Find the profile with the matching ID
        const foundProfile = organizers.find(p => p.id === params.id);
        setProfile(foundProfile || null);
        
        // Check if this is the user's own profile (ID 6 in our mock data)
        setIsMyProfile(params.id === "6");
      }
      
      setLoading(false);
    };
    
    loadProfile();
  }, [params?.id]);
  
  // Load games data in a separate effect
  useEffect(() => {
    if (!profile) return;
    
    // Find upcoming games organized by this player
    const playerGames = games.filter(game => game.organizerId === profile.id);
    
    // Sort by date (ascending)
    const sortedGames = [...playerGames].sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
    
    // Only show future games (after today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const futureGames = sortedGames.filter(game => {
      const gameDate = new Date(game.date);
      return gameDate >= today;
    });
    
    setUpcomingGames(futureGames);
  }, [profile, games]);

  const handleReply = (message: any) => {
    setSelectedMessage(message);
    setReplyText("");
    setShowReplyModal(true);
  };

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    
    toast({
      title: "Reply sent!",
      description: `Your reply to ${selectedMessage?.from.name} has been sent.`,
    });
    
    setShowReplyModal(false);
    setReplyText("");
    setSelectedMessage(null);
  };

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    
    toast({
      title: "Message sent!",
      description: `Your message to ${profile?.name} has been sent.`,
    });
    
    setMessageText("");
  };

  const markAsRead = (messageId: string) => {
    setMessages(prevMessages => 
      prevMessages.map(msg => 
        msg.id === messageId ? { ...msg, read: true } : msg
      )
    );
  };

  if (loading) {
    return (
      <Layout title="Loading Profile...">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-32 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 w-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout title="Profile Not Found">
        <Helmet>
          <title>Profile Not Found - Virtual League Golf</title>
        </Helmet>
        <div className="max-w-2xl mx-auto text-center py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8">
            <h2 className="text-xl font-bold text-red-700 mb-4">Profile Not Found</h2>
            <p className="text-gray-600 mb-6">
              Sorry, we couldn't find the golfer profile you're looking for. The profile may have been removed or the ID is incorrect.
            </p>
            <div className="flex justify-center">
              <a href="/find-players" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                Browse Other Players
              </a>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`${profile.name}'s Profile`}>
      <Helmet>
        <title>{profile.name} - Golfer Profile - Virtual League Golf</title>
        <meta name="description" content={`View ${profile.name}'s golf profile. Skill level: ${profile.skillLevel}. Home course: ${profile.homeCourse}.`} />
      </Helmet>
      
      <div className="max-w-4xl mx-auto">
        <Card className="border-2 border-green-100 overflow-hidden mb-6">
          <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 pb-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
              <div>
                <CardTitle className="text-2xl font-bold text-green-800">
                  {profile.name}
                  {isMyProfile && <span className="ml-2 text-sm text-green-600">(You)</span>}
                </CardTitle>
                <CardDescription className="text-gray-600 text-lg">
                  {profile.age} • {profile.location}
                </CardDescription>
              </div>
              <Badge className="bg-green-100 text-green-800 hover:bg-green-200 py-1 px-3 text-sm">
                {profile.skillLevel}
              </Badge>
            </div>
          </CardHeader>
        </Card>
        
        <Tabs defaultValue="profile" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="ratings">Ratings</TabsTrigger>
            <TabsTrigger value="games">
              Upcoming Games
              {upcomingGames.length > 0 && (
                <Badge className="ml-2 bg-green-500 text-white">{upcomingGames.length}</Badge>
              )}
            </TabsTrigger>
            {isMyProfile && (
              <TabsTrigger value="inbox">
                Inbox
                {messages.filter(m => !m.read).length > 0 && (
                  <Badge className="ml-2 bg-red-500 text-white">{messages.filter(m => !m.read).length}</Badge>
                )}
              </TabsTrigger>
            )}
          </TabsList>
        
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardContent className="pt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Flag className="h-5 w-5 mr-3 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Home Course</p>
                      <p className="text-base font-medium text-gray-900">{profile.homeCourse}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Trophy className="h-5 w-5 mr-3 text-amber-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Personal Best Score</p>
                      <p className="text-base font-medium text-gray-900">{profile.personalBestScore}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center col-span-1 md:col-span-2">
                    <Heart className="h-5 w-5 mr-3 text-red-500 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Favorite Courses</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {profile.favoriteCourses.map((course) => (
                          <Badge key={course} variant="outline" className="bg-blue-50 text-blue-700">
                            {course}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-100 pt-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">About Me</h3>
                  <p className="text-gray-700 whitespace-pre-line">{profile.bio}</p>
                </div>
              </CardContent>
            </Card>
            
            {!isMyProfile && (
              <div className="mt-4">
                <h3 className="text-xl font-medium text-gray-900 mb-4">Contact {profile.name}</h3>
                <Card className="border border-gray-200">
                  <CardContent className="pt-6">
                    <p className="text-gray-600 mb-4">
                      Interested in playing a round with {profile.name}? You can send a message to coordinate a tee time.
                    </p>
                    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}>
                      <div>
                        <Label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</Label>
                        <Textarea
                          id="message"
                          rows={4}
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          placeholder={`Hi ${profile.name}, I'd like to join you for a round of golf...`}
                          className="w-full border border-gray-300 rounded-md p-3 text-gray-700 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                      <div>
                        <Button
                          type="submit"
                          disabled={!messageText.trim()}
                          className="w-full md:w-auto px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium disabled:opacity-50"
                        >
                          Send Message
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="ratings">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Player Ratings</CardTitle>
                <CardDescription>
                  Ratings are based on feedback from other golfers who have played with {isMyProfile ? 'you' : profile.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex flex-col space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Vibe</span>
                        <div className="flex text-amber-400">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              className={`h-5 w-5 ${star <= 4 ? 'fill-current' : ''}`} 
                            />
                          ))}
                          <span className="ml-2 text-gray-700">4.0</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Punctuality</span>
                        <div className="flex text-amber-400">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              className={`h-5 w-5 ${star <= 5 ? 'fill-current' : ''}`} 
                            />
                          ))}
                          <span className="ml-2 text-gray-700">5.0</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Skill Rating Accuracy</span>
                        <div className="flex text-amber-400">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              className={`h-5 w-5 ${star <= 4 ? 'fill-current' : ''}`} 
                            />
                          ))}
                          <span className="ml-2 text-gray-700">4.0</span>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="pt-2">
                      <h4 className="font-medium text-lg mb-4">Recent Reviews</h4>
                      
                      <div className="space-y-4">
                        <div className="p-4 border border-gray-100 rounded-md">
                          <div className="flex justify-between">
                            <div className="font-medium">Emily Wilson</div>
                            <div className="flex text-amber-400">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                  key={star} 
                                  className={`h-4 w-4 ${star <= 5 ? 'fill-current' : ''}`} 
                                />
                              ))}
                            </div>
                          </div>
                          <div className="text-gray-500 text-sm">May 2, 2025</div>
                          <p className="mt-2 text-gray-700">
                            Great playing partner! Very punctual and fun to be around.
                          </p>
                        </div>
                        
                        <div className="p-4 border border-gray-100 rounded-md">
                          <div className="flex justify-between">
                            <div className="font-medium">Robert Brown</div>
                            <div className="flex text-amber-400">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                  key={star} 
                                  className={`h-4 w-4 ${star <= 4 ? 'fill-current' : ''}`} 
                                />
                              ))}
                            </div>
                          </div>
                          <div className="text-gray-500 text-sm">April 15, 2025</div>
                          <p className="mt-2 text-gray-700">
                            Enjoyed our round together. Skill level was pretty accurate.
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-center mt-6 text-sm text-gray-500">
                        <AlertCircle className="h-4 w-4 inline mr-1" />
                        <span>Rating system is for display purposes only and will be implemented in a future update.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="games">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Upcoming Games</CardTitle>
                <CardDescription>
                  {isMyProfile 
                    ? "Tee times you've organized or joined" 
                    : `Tee times organized by ${profile.name}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingGames.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingGames.map((game) => (
                      <div key={game.id} className="p-4 border border-gray-100 rounded-md hover:border-green-200 transition-colors">
                        <div className="flex flex-col md:flex-row justify-between gap-2">
                          <div>
                            <h4 className="font-medium text-lg text-green-700">{game.title}</h4>
                            <div className="flex items-center text-gray-600 mt-1">
                              <MapPin className="h-4 w-4 mr-1" />
                              <span>{game.location}</span>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                            <div className="flex items-center text-gray-600">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>{new Date(game.date).toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric'
                              })}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>{game.teeTime}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-2 flex flex-wrap gap-2">
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            {game.skillLevel}
                          </Badge>
                          {game.gameTypes.map((type) => (
                            <Badge key={type} variant="outline" className="bg-blue-50 text-blue-700">
                              {type}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="mt-3 text-sm text-gray-600">
                          <p className="line-clamp-2">{game.details}</p>
                        </div>
                        
                        <div className="mt-3 pt-2 flex justify-end">
                          <Link href={`/join-a-game`}>
                            <Button variant="outline" size="sm" className="text-green-700">
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    {isMyProfile 
                      ? "You don't have any upcoming games. Join a tee time or organize your own!" 
                      : `${profile.name} doesn't have any upcoming games.`}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {isMyProfile && (
            <TabsContent value="inbox">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">Your Messages</CardTitle>
                  <CardDescription>
                    Messages from other golfers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {messages.length > 0 ? (
                    <div className="space-y-3">
                      {messages.map((message) => (
                        <div 
                          key={message.id} 
                          className={`p-4 border rounded-md transition-colors ${
                            message.read 
                              ? 'border-gray-100 bg-white' 
                              : 'border-blue-100 bg-blue-50'
                          }`}
                          onClick={() => !message.read && markAsRead(message.id)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center">
                                <Link href={`/profile/${message.from.id}`} className="font-medium text-blue-600 hover:underline">
                                  {message.from.name}
                                </Link>
                                {!message.read && (
                                  <Badge className="ml-2 bg-blue-500 text-white text-xs">New</Badge>
                                )}
                              </div>
                              <div className="text-gray-500 text-sm">
                                {new Date(message.date).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </div>
                            </div>
                            <div>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleReply(message);
                                }}
                              >
                                <MessageSquare className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="mt-2">
                            <h4 className="font-medium">{message.subject}</h4>
                            <p className="mt-1 text-gray-700">{message.message}</p>
                          </div>
                          <div className="mt-3 pt-2 flex justify-end">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-blue-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleReply(message);
                              }}
                            >
                              Reply
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      You don't have any messages.
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>

        {/* Reply Modal */}
        <Dialog open={showReplyModal} onOpenChange={setShowReplyModal}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Reply to {selectedMessage?.from.name}</DialogTitle>
              <DialogDescription>
                Replying to: "{selectedMessage?.subject}"
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="reply" className="text-right">
                  Message
                </Label>
                <Textarea
                  id="reply"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply here..."
                  className="col-span-3"
                  rows={4}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowReplyModal(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSendReply}
                disabled={!replyText.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Send Reply
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}