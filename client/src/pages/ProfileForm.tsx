import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Layout from "@/components/Layout";
import { Helmet } from "react-helmet";
import { golfCourses, skillLevels, organizers, OrganizerProfile, useGameStore } from "../stores/gameStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectValue, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User, Flag, ThumbsUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Define form schema with Zod
const profileSchema = z.object({
  displayName: z.string().min(2, "Name must be at least 2 characters"),
  age: z.string().min(1, "Age is required"),
  location: z.string().min(1, "Location is required"),
  skillLevel: z.string().min(1, "Skill level is required"),
  personalBestScore: z.string().optional(),
  homeCourse: z.string().min(1, "Home course is required"),
  favoriteCourses: z.array(z.string()).min(1, "Select at least one favorite course"),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfileForm({ username, onLogout }: { username: string; onLogout: () => void }) {
  const [, setLocation] = useLocation();
  const [myProfileId, setMyProfileId] = useState<string | null>("6"); // Default ID for your profile
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const { toast } = useToast();

  // Check if user profile already exists
  useEffect(() => {
    // In a real app, this would be a check against the logged-in user's ID
    const existingProfile = organizers.find(org => org.id === "6");
    if (existingProfile) {
      setMyProfileId("6");
    }
  }, []);

  // Default values for the form
  const defaultValues: Partial<ProfileFormValues> = {
    displayName: "Your Name",
    age: "30-40",
    location: "Your Location",
    skillLevel: "Intermediate",
    personalBestScore: "82",
    homeCourse: golfCourses[0].name,
    favoriteCourses: [golfCourses[0].name, golfCourses[2].name],
    bio: "Share a bit about your golf journey and what you're looking for in playing partners.",
  };

  // Set up the form
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues,
  });

  // Load existing profile data if available
  useEffect(() => {
    if (myProfileId) {
      const existingProfile = organizers.find(org => org.id === myProfileId);
      if (existingProfile) {
        form.reset({
          displayName: existingProfile.name,
          age: existingProfile.age,
          location: existingProfile.location,
          skillLevel: existingProfile.skillLevel,
          personalBestScore: existingProfile.personalBestScore,
          homeCourse: existingProfile.homeCourse,
          favoriteCourses: existingProfile.favoriteCourses,
          bio: existingProfile.bio,
        });
        setSelectedFavoriteCourses(existingProfile.favoriteCourses);
      }
    }
  }, [myProfileId, form]);

  const [selectedFavoriteCourses, setSelectedFavoriteCourses] = useState<string[]>(
    defaultValues.favoriteCourses || []
  );

  const handleFavoriteCourseToggle = (courseName: string) => {
    setSelectedFavoriteCourses(prev => {
      if (prev.includes(courseName)) {
        const newSelected = prev.filter(c => c !== courseName);
        form.setValue("favoriteCourses", newSelected);
        return newSelected;
      } else {
        const newSelected = [...prev, courseName];
        form.setValue("favoriteCourses", newSelected);
        return newSelected;
      }
    });
  };

  const onSubmit = (data: ProfileFormValues) => {
    setSaveStatus('saving');
    
    try {
      // Create a new organizer profile
      const profileId = myProfileId || "6"; // Use existing ID or create new one
      
      const profileData: OrganizerProfile = {
        id: profileId,
        name: data.displayName,
        age: data.age,
        location: data.location,
        skillLevel: data.skillLevel,
        homeCourse: data.homeCourse,
        personalBestScore: data.personalBestScore || "N/A",
        bio: data.bio || "",
        favoriteCourses: data.favoriteCourses,
      };
      
      // Find if profile already exists
      const profileIndex = organizers.findIndex(org => org.id === profileId);
      
      if (profileIndex >= 0) {
        // Update existing profile
        organizers[profileIndex] = profileData;
      } else {
        // Add new profile
        organizers.push(profileData);
      }
      
      // Save the ID for future use
      setMyProfileId(profileId);
      
      // Update status
      setSaveStatus('success');
      
      // Show success message
      toast({
        title: "Profile saved successfully!",
        description: "Your golfer profile has been updated.",
      });
      
      // Redirect to profile page
      setTimeout(() => {
        setLocation(`/profile/${profileId}`);
      }, 500);
      
    } catch (error) {
      console.error('Failed to save profile:', error);
      setSaveStatus('error');
      
      toast({
        title: "Failed to save profile",
        description: "There was a problem saving your profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout title="My Profile">
      <Helmet>
        <title>My Profile - Virtual League Golf</title>
        <meta name="description" content="View and edit your golf player profile. Set your skill level, home course, and other details." />
      </Helmet>

      <div className="max-w-3xl mx-auto">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center mb-6 pb-4 border-b border-gray-100">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <User className="h-8 w-8 text-green-700" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-800">My Profile</h2>
              <p className="text-gray-500">Logged in as {username}. Manage your golf player information</p>
            </div>
            <Button onClick={onLogout} variant="outline" size="sm">Logout</Button>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Display Name */}
                <FormField
                  control={form.control}
                  name="displayName"
                  render={({ field }) => (
                    <FormItem className="col-span-2 sm:col-span-1">
                      <FormLabel>Display Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Age Range */}
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem className="col-span-2 sm:col-span-1">
                      <FormLabel>Age Range</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select age range" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Under 20">Under 20</SelectItem>
                          <SelectItem value="20-30">20-30</SelectItem>
                          <SelectItem value="30-40">30-40</SelectItem>
                          <SelectItem value="40-50">40-50</SelectItem>
                          <SelectItem value="50-60">50-60</SelectItem>
                          <SelectItem value="60+">60+</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Location */}
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem className="col-span-2 sm:col-span-1">
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="City or Neighborhood" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Skill Level */}
                <FormField
                  control={form.control}
                  name="skillLevel"
                  render={({ field }) => (
                    <FormItem className="col-span-2 sm:col-span-1">
                      <FormLabel>Skill Level</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select skill level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {skillLevels.map(level => (
                            <SelectItem 
                              key={level.name} 
                              value={level.name}
                            >
                              {level.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        {skillLevels.find(level => level.name === field.value)?.description || ''}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Personal Best Score */}
                <FormField
                  control={form.control}
                  name="personalBestScore"
                  render={({ field }) => (
                    <FormItem className="col-span-2 sm:col-span-1">
                      <FormLabel>Personal Best Score</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Your best score" {...field} />
                      </FormControl>
                      <FormDescription>
                        Your best 18-hole score
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Home Course */}
                <FormField
                  control={form.control}
                  name="homeCourse"
                  render={({ field }) => (
                    <FormItem className="col-span-2 sm:col-span-1">
                      <FormLabel>Home Course</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select home course" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {golfCourses.map(course => (
                            <SelectItem 
                              key={course.name} 
                              value={course.name}
                            >
                              {course.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Favorite Courses */}
                <FormField
                  control={form.control}
                  name="favoriteCourses"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Favorite Courses</FormLabel>
                      <FormDescription>
                        Select multiple courses you enjoy playing
                      </FormDescription>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1.5">
                        {golfCourses.map(course => (
                          <div
                            key={course.name}
                            className={`flex items-center p-2.5 rounded-md border cursor-pointer transition-colors ${
                              selectedFavoriteCourses.includes(course.name)
                                ? "bg-green-50 border-green-200"
                                : "bg-white border-gray-200 hover:bg-gray-50"
                            }`}
                            onClick={() => handleFavoriteCourseToggle(course.name)}
                          >
                            <Flag className={`h-4 w-4 mr-2 ${
                              selectedFavoriteCourses.includes(course.name)
                                ? "text-green-600"
                                : "text-gray-400"
                            }`} />
                            <span className={selectedFavoriteCourses.includes(course.name) ? "text-green-700" : "text-gray-700"}>
                              {course.name}
                            </span>
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Bio / Experience */}
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Bio / Experience</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Share a little about your golf experience and goals..."
                          className="resize-none h-32"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {field.value?.length || 0}/500 characters
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setLocation(`/profile/${myProfileId || '6'}`)}
                  disabled={saveStatus === 'saving'}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-green-600 hover:bg-green-700"
                  disabled={saveStatus === 'saving'}
                >
                  {saveStatus === 'saving' ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Saving...
                    </>
                  ) : 'Save Profile'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Layout>
  );
}
