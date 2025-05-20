import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgeIcon } from "@/components/ui/badge-icon";
import { Button } from "@/components/ui/button";
import { Exercise } from "@shared/schema";
import { Link } from "wouter";

interface ExerciseCardProps {
  exercise: Exercise;
  isCompleted?: boolean;
  bestScore?: number;
}

const ExerciseCard = ({ exercise, isCompleted = false, bestScore = 0 }: ExerciseCardProps) => {
  const difficultyLabel = () => {
    const diff = exercise.difficulty;
    if (diff <= 3) return "Easy";
    if (diff <= 7) return "Medium";
    return "Hard";
  };
  
  const problemTypeIcon = () => {
    switch (exercise.problemType) {
      case "addition":
        return "add";
      case "subtraction":
        return "remove";
      case "multiplication":
        return "close_fullscreen";
      case "division":
        return "call_split";
      default:
        return "calculate";
    }
  };
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <BadgeIcon 
              icon={problemTypeIcon()} 
              variant={isCompleted ? "success" : "default"}
            />
            <CardTitle>{exercise.title}</CardTitle>
          </div>
          {isCompleted && (
            <div className="bg-accent text-white text-xs px-2 py-1 rounded-full">
              Completed
            </div>
          )}
        </div>
        <CardDescription>{exercise.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-[#9e9e9e]">Difficulty:</div>
          <div className="font-semibold">{difficultyLabel()}</div>
          
          <div className="text-[#9e9e9e]">Type:</div>
          <div className="font-semibold capitalize">{exercise.problemType}</div>
          
          {exercise.timeLimit && (
            <>
              <div className="text-[#9e9e9e]">Time Limit:</div>
              <div className="font-semibold">{exercise.timeLimit} seconds</div>
            </>
          )}
          
          {isCompleted && bestScore > 0 && (
            <>
              <div className="text-[#9e9e9e]">Best Score:</div>
              <div className="font-semibold">{bestScore}</div>
            </>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" asChild>
          <Link href={`/practice/${exercise.id}`}>
            {isCompleted ? "Practice Again" : "Start Exercise"}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ExerciseCard;
