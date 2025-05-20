import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Level, Exercise } from "@shared/schema";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgeIcon } from "@/components/ui/badge-icon";
import { Button } from "@/components/ui/button";
import Abacus from "@/components/abacus/Abacus";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

const LearnPage = () => {
  const { isAuthenticated, user } = useAuth();
  const [location, setLocation] = useLocation();
  const [selectedLevelId, setSelectedLevelId] = useState<number | null>(null);
  
  // Parse level from URL
  useEffect(() => {
    const params = new URLSearchParams(location.split('?')[1]);
    const levelParam = params.get('level');
    if (levelParam) {
      setSelectedLevelId(parseInt(levelParam));
    }
  }, [location]);
  
  // Fetch levels
  const { data: levels, isLoading: isLoadingLevels } = useQuery<Level[]>({
    queryKey: ["/api/levels"],
  });
  
  // Fetch exercises for the selected level
  const { data: exercises, isLoading: isLoadingExercises } = useQuery<Exercise[]>({
    queryKey: ["/api/exercises", selectedLevelId],
    queryFn: async ({ queryKey }) => {
      const levelId = queryKey[1];
      if (!levelId) return [];
      const response = await fetch(`/api/exercises?levelId=${levelId}`);
      if (!response.ok) throw new Error("Failed to fetch exercises");
      return await response.json();
    },
    enabled: !!selectedLevelId,
  });
  
  // Fetch user progress if authenticated
  const { data: userProgress, isLoading: isLoadingProgress } = useQuery({
    queryKey: ["/api/progress"],
    enabled: isAuthenticated,
  });
  
  const selectedLevel = levels?.find(l => l.id === selectedLevelId);
  
  // Get progress for the current level
  const getLevelProgress = () => {
    if (!isAuthenticated || !userProgress || !selectedLevelId) return 0;
    const progress = userProgress.find((p: any) => p.levelId === selectedLevelId);
    return progress ? progress.score : 0;
  };
  
  // Check if level is locked
  const isLevelLocked = (level: Level) => {
    if (!isAuthenticated) return level.isLocked;
    
    // For beginner level, never locked
    if (level.difficulty === "beginner") return false;
    
    // For other levels, check if the previous level is completed
    const levelIndex = levels?.findIndex(l => l.id === level.id) || 0;
    if (levelIndex <= 0) return false;
    
    const previousLevel = levels?.[levelIndex - 1];
    if (!previousLevel) return false;
    
    const previousLevelProgress = userProgress?.find((p: any) => p.levelId === previousLevel.id);
    return !(previousLevelProgress?.isCompleted);
  };
  
  if (isLoadingLevels) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col gap-8">
          <Skeleton className="h-10 w-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-40" />
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  if (!selectedLevelId && levels?.length) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Choose a Level to Start Learning</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {levels.map(level => {
            const locked = isLevelLocked(level);
            return (
              <Card 
                key={level.id} 
                className={`cursor-pointer transition-transform hover:scale-105 ${locked ? 'opacity-70' : ''}`}
                onClick={() => {
                  if (!locked) {
                    setSelectedLevelId(level.id);
                    setLocation(`/learn?level=${level.id}`);
                  }
                }}
              >
                <CardHeader className={`${level.difficulty === 'beginner' ? 'bg-green-500' : level.difficulty === 'intermediate' ? 'bg-yellow-500' : level.difficulty === 'advanced' ? 'bg-orange-500' : 'bg-red-500'} text-white`}>
                  <CardTitle>{level.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <p className="mb-4">{level.description}</p>
                  {locked && (
                    <div className="flex items-center text-[#9e9e9e]">
                      <span className="material-icons mr-2">lock</span>
                      <span>Complete previous level first</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      {selectedLevel && (
        <>
          <div className="flex justify-between items-center mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <BadgeIcon 
                  icon={selectedLevel.difficulty === 'beginner' ? 'school' : selectedLevel.difficulty === 'intermediate' ? 'trending_up' : 'psychology'} 
                  variant={selectedLevel.difficulty === 'beginner' ? 'success' : selectedLevel.difficulty === 'intermediate' ? 'secondary' : 'default'}
                />
                <h1 className="text-3xl font-bold">{selectedLevel.name}</h1>
              </div>
              <p className="text-[#9e9e9e]">{selectedLevel.description}</p>
            </div>
            
            {isAuthenticated && (
              <div className="flex flex-col items-end">
                <div className="text-sm mb-1">Progress: {getLevelProgress()}%</div>
                <div className="progress-bar w-40">
                  <div className="progress-fill" style={{ width: `${getLevelProgress()}%` }}></div>
                </div>
              </div>
            )}
          </div>
          
          <Tabs defaultValue="learn">
            <TabsList className="mb-6">
              <TabsTrigger value="learn">Learn</TabsTrigger>
              <TabsTrigger value="practice">Practice</TabsTrigger>
            </TabsList>
            
            <TabsContent value="learn" className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Understanding the Abacus</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div>
                      <p className="mb-4">
                        The abacus is a calculation tool used for arithmetic processes. Each rod represents a place value (ones, tens, hundreds, etc.), 
                        and the beads represent numbers.
                      </p>
                      <ul className="list-disc list-inside space-y-2 mb-4">
                        <li>The <strong>upper beads</strong> (heaven beads) are worth 5 each</li>
                        <li>The <strong>lower beads</strong> (earth beads) are worth 1 each</li>
                        <li>Move beads toward the divider to count them</li>
                        <li>Read from left to right, like normal numbers</li>
                      </ul>
                      <p>Try moving the beads on the interactive abacus to create different numbers.</p>
                    </div>
                    <Abacus height={250} />
                  </div>
                </CardContent>
              </Card>
              
              {selectedLevel.difficulty === 'beginner' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Addition</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">
                      To add numbers on the abacus, you simply represent the first number, then add the second number by moving more beads toward the divider.
                    </p>
                    <p className="mb-4">
                      <strong>Example:</strong> Let's add 3 + 2
                    </p>
                    <ol className="list-decimal list-inside space-y-2 mb-4">
                      <li>First, represent 3 by moving 3 earth beads toward the divider</li>
                      <li>Next, add 2 by moving 2 more earth beads</li>
                      <li>The result is 5, represented by 5 earth beads (or 1 heaven bead)</li>
                    </ol>
                    <p>
                      When you run out of earth beads, move them back and move one heaven bead toward the divider, which is worth 5.
                    </p>
                  </CardContent>
                </Card>
              )}
              
              {/* More learning content would go here based on the selected level */}
              
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setLocation('/learn')}
                >
                  <span className="material-icons mr-2">arrow_back</span>
                  Back to Levels
                </Button>
                
                <Button onClick={() => setLocation('/practice')}>
                  Practice Now
                  <span className="material-icons ml-2">arrow_forward</span>
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="practice">
              {isLoadingExercises ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[1, 2, 3].map(i => (
                    <Skeleton key={i} className="h-60" />
                  ))}
                </div>
              ) : exercises && exercises.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {exercises.map(exercise => (
                    <Card key={exercise.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardHeader>
                        <CardTitle>{exercise.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="mb-4">{exercise.description}</p>
                        <Button 
                          className="w-full"
                          onClick={() => setLocation(`/practice?exercise=${exercise.id}`)}
                        >
                          Start Exercise
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-[#9e9e9e] mb-4">No exercises found for this level yet.</p>
                    <Button variant="outline" onClick={() => setLocation('/learn')}>
                      Back to Levels
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default LearnPage;
