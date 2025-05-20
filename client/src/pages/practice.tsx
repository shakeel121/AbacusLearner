import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Exercise } from "@shared/schema";
import Abacus from "@/components/abacus/Abacus";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import ExerciseCard from "@/components/exercises/ExerciseCard";

const PracticePage = () => {
  const { isAuthenticated } = useAuth();
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Parse exercise from URL
  const [selectedExerciseId, setSelectedExerciseId] = useState<number | null>(null);
  const [exerciseValue, setExerciseValue] = useState<number | null>(null);
  const [userAnswer, setUserAnswer] = useState<number>(0);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [exerciseStarted, setExerciseStarted] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Fetch all exercises or filter by level
  const { data: exercises, isLoading: isLoadingExercises } = useQuery<Exercise[]>({
    queryKey: ["/api/exercises"],
  });
  
  // Fetch the selected exercise
  const { data: selectedExercise, isLoading: isLoadingExercise } = useQuery<Exercise>({
    queryKey: ["/api/exercises", selectedExerciseId],
    queryFn: async ({ queryKey }) => {
      const exerciseId = queryKey[1];
      if (!exerciseId) throw new Error("No exercise ID provided");
      const response = await fetch(`/api/exercises/${exerciseId}`);
      if (!response.ok) throw new Error("Failed to fetch exercise");
      return await response.json();
    },
    enabled: !!selectedExerciseId,
  });
  
  // Mutation for submitting exercise attempts
  const submitAttemptMutation = useMutation({
    mutationFn: async (data: { 
      exerciseId: number; 
      score: number; 
      isCorrect: boolean; 
      timeSpent: number;
    }) => {
      return await apiRequest("POST", "/api/attempts", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/progress"] });
      toast({
        title: "Progress saved",
        description: "Your attempt has been recorded successfully.",
        variant: "success",
      });
    },
    onError: (error) => {
      toast({
        title: "Error saving progress",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  // Handle URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.split('?')[1]);
    const exerciseParam = params.get('exercise');
    if (exerciseParam) {
      setSelectedExerciseId(parseInt(exerciseParam));
    }
  }, [location]);
  
  // Start exercise timer
  useEffect(() => {
    if (selectedExercise && exerciseStarted && timeLeft === null) {
      setTimeLeft(selectedExercise.timeLimit || 60);
      setExerciseValue(selectedExercise.targetNumber || Math.floor(Math.random() * 100));
      setIsAnswerCorrect(null);
    }
    
    if (timeLeft !== null && timeLeft > 0 && exerciseStarted) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => (prev !== null ? prev - 1 : null));
      }, 1000);
      
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    } else if (timeLeft === 0) {
      // Time's up, check answer
      checkAnswer();
    }
  }, [selectedExercise, timeLeft, exerciseStarted]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);
  
  const startExercise = () => {
    setExerciseStarted(true);
    setTimeLeft(selectedExercise?.timeLimit || 60);
    setExerciseValue(selectedExercise?.targetNumber || Math.floor(Math.random() * 100));
    setScore(0);
    setIsAnswerCorrect(null);
  };
  
  const checkAnswer = () => {
    if (exerciseValue === null) return;
    
    const correct = userAnswer === exerciseValue;
    setIsAnswerCorrect(correct);
    
    // Calculate score based on correctness and time
    let calculatedScore = 0;
    if (correct) {
      // Base score for correct answer
      calculatedScore = 100;
      
      // Bonus points for speed if there was a time limit
      if (selectedExercise?.timeLimit && timeLeft !== null) {
        const timeBonus = Math.floor((timeLeft / selectedExercise.timeLimit) * 50);
        calculatedScore += timeBonus;
      }
    }
    
    setScore(calculatedScore);
    
    // Save attempt if authenticated
    if (isAuthenticated && selectedExerciseId) {
      submitAttemptMutation.mutate({
        exerciseId: selectedExerciseId,
        score: calculatedScore,
        isCorrect: correct,
        timeSpent: selectedExercise?.timeLimit 
          ? selectedExercise.timeLimit - (timeLeft || 0) 
          : 0
      });
    }
    
    // Clear timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };
  
  const resetExercise = () => {
    setExerciseStarted(false);
    setTimeLeft(null);
    setExerciseValue(null);
    setUserAnswer(0);
    setIsAnswerCorrect(null);
    setScore(0);
    
    // Reset abacus
    const event = new CustomEvent('resetAbacus');
    window.dispatchEvent(event);
  };
  
  const nextExercise = () => {
    resetExercise();
    startExercise();
  };
  
  if (isLoadingExercises) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Practice</h1>
        <Card>
          <CardContent className="p-8">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (!selectedExerciseId && exercises) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Practice Exercises</h1>
        
        <Tabs defaultValue="all">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Exercises</TabsTrigger>
            <TabsTrigger value="beginner">Beginner</TabsTrigger>
            <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {exercises.map(exercise => (
                <div key={exercise.id} onClick={() => setLocation(`/practice?exercise=${exercise.id}`)}>
                  <ExerciseCard exercise={exercise} />
                </div>
              ))}
            </div>
          </TabsContent>
          
          {/* Filtered tabs would have similar structure */}
          {["beginner", "intermediate", "advanced"].map(difficulty => (
            <TabsContent key={difficulty} value={difficulty}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {exercises
                  .filter(ex => {
                    // Match exercises to difficulty levels
                    if (difficulty === "beginner" && ex.difficulty <= 3) return true;
                    if (difficulty === "intermediate" && ex.difficulty > 3 && ex.difficulty <= 7) return true;
                    if (difficulty === "advanced" && ex.difficulty > 7) return true;
                    return false;
                  })
                  .map(exercise => (
                    <div key={exercise.id} onClick={() => setLocation(`/practice?exercise=${exercise.id}`)}>
                      <ExerciseCard exercise={exercise} />
                    </div>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    );
  }
  
  if (isLoadingExercise || !selectedExercise) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardContent className="p-8">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-4">
        <Button 
          variant="outline" 
          className="mb-6"
          onClick={() => setLocation('/practice')}
        >
          <span className="material-icons mr-2">arrow_back</span>
          All Exercises
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{selectedExercise.title}</CardTitle>
            <Badge className="capitalize">
              {selectedExercise.problemType}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="mb-6">{selectedExercise.description}</p>
          
          {!exerciseStarted ? (
            <div className="text-center py-8">
              <p className="mb-6">Click start when you're ready to begin the exercise.</p>
              <Button onClick={startExercise}>Start Exercise</Button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Timer bar if there's a time limit */}
              {selectedExercise.timeLimit && timeLeft !== null && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Time remaining:</span>
                    <span>{timeLeft} seconds</span>
                  </div>
                  <Progress value={(timeLeft / selectedExercise.timeLimit) * 100} />
                </div>
              )}
              
              {/* Exercise task */}
              {selectedExercise.problemType === "representation" ? (
                <div className="text-center mb-4">
                  <p className="text-lg">Represent this number on the abacus:</p>
                  <div className="text-4xl font-bold my-4">{exerciseValue}</div>
                </div>
              ) : (
                <div className="text-center mb-4">
                  <p className="text-lg">Calculate the result:</p>
                  <div className="text-4xl font-bold my-4">
                    {/* Dynamic exercise generation based on problem type */}
                    {(() => {
                      if (!exerciseValue) return "";
                      
                      const num1 = Math.floor(exerciseValue / 2);
                      const num2 = exerciseValue - num1;
                      
                      switch (selectedExercise.problemType) {
                        case "addition":
                          return `${num1} + ${num2} = ?`;
                        case "subtraction":
                          return `${exerciseValue} - ${num2} = ?`;
                        case "multiplication":
                          return `${num1} × ${2} = ?`;
                        case "division":
                          return `${exerciseValue} ÷ ${1} = ?`;
                        default:
                          return exerciseValue;
                      }
                    })()}
                  </div>
                </div>
              )}
              
              {/* Abacus component */}
              <div className="my-8">
                <Abacus
                  onChange={(value) => setUserAnswer(value)}
                  height={250}
                />
              </div>
              
              {/* Current value display */}
              <div className="text-center mb-6">
                <p>Current value on abacus:</p>
                <div className="text-3xl font-bold">{userAnswer}</div>
              </div>
              
              {/* Actions */}
              <div className="flex justify-center space-x-4">
                {isAnswerCorrect === null ? (
                  <Button onClick={checkAnswer}>Check Answer</Button>
                ) : (
                  <div className="text-center space-y-4">
                    <div className={`text-xl font-bold ${isAnswerCorrect ? 'text-green-500' : 'text-red-500'}`}>
                      {isAnswerCorrect ? 'Correct!' : 'Incorrect!'}
                    </div>
                    
                    <div className="text-lg">
                      {isAnswerCorrect ? (
                        <div>
                          <p>Score: {score} points</p>
                        </div>
                      ) : (
                        <div>
                          <p>The correct answer was {exerciseValue}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex space-x-4 justify-center">
                      <Button onClick={nextExercise}>Next Exercise</Button>
                      <Button variant="outline" onClick={() => setLocation('/practice')}>
                        Back to Exercises
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          {exerciseStarted && isAnswerCorrect === null && (
            <Button variant="outline" className="w-full" onClick={resetExercise}>
              Reset
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default PracticePage;
