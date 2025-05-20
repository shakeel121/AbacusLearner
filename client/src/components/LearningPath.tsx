import { useQuery } from "@tanstack/react-query";
import { Level } from "@shared/schema";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const LearningPathCard = ({ 
  level, 
  progress = 0,
  isLocked = false
}: { 
  level: Level; 
  progress?: number;
  isLocked?: boolean;
}) => {
  const { isAuthenticated } = useAuth();
  const colors = {
    beginner: "bg-green-500",
    intermediate: "bg-yellow-500",
    advanced: "bg-orange-500",
    expert: "bg-red-500"
  };
  
  const colorClass = colors[level.difficulty as keyof typeof colors] || "bg-green-500";
  
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:transform hover:scale-105">
      <div className={`h-3 ${colorClass}`}></div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-3 text-[#424242]">{level.name}</h3>
        <p className="text-[#9e9e9e] mb-4">{level.description}</p>
        <div className="progress-bar mb-4">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
        {isAuthenticated ? (
          <Button 
            disabled={isLocked}
            className={`text-primary font-medium hover:underline flex items-center ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
            variant="link"
            asChild
          >
            {isLocked ? (
              <div>
                Locked <span className="material-icons ml-1">lock</span>
              </div>
            ) : (
              <Link href={`/learn?level=${level.id}`}>
                Continue <span className="material-icons ml-1">arrow_forward</span>
              </Link>
            )}
          </Button>
        ) : (
          <Button
            className="text-primary font-medium hover:underline flex items-center"
            variant="link"
            asChild
          >
            <a href="/api/login">
              {isLocked ? "Locked" : "Start"} <span className="material-icons ml-1">{isLocked ? "lock" : "arrow_forward"}</span>
            </a>
          </Button>
        )}
      </div>
    </div>
  );
};

const LearningPathSkeleton = () => (
  <div className="grid md:grid-cols-4 gap-6">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="bg-white rounded-lg overflow-hidden shadow-md">
        <Skeleton className="h-3 w-full" />
        <div className="p-6">
          <Skeleton className="h-7 w-1/2 mb-3" />
          <Skeleton className="h-10 w-full mb-4" />
          <Skeleton className="h-2 w-full mb-4" />
          <Skeleton className="h-6 w-24" />
        </div>
      </div>
    ))}
  </div>
);

const LearningPath = () => {
  const { isAuthenticated, user } = useAuth();
  const { data: levels, isLoading: isLoadingLevels } = useQuery<Level[]>({
    queryKey: ["/api/levels"],
  });
  
  const { data: userProgress, isLoading: isLoadingProgress } = useQuery({
    queryKey: ["/api/progress"],
    enabled: isAuthenticated,
  });
  
  const getProgressForLevel = (levelId: number) => {
    if (!userProgress || !isAuthenticated) return 0;
    
    const progress = userProgress.find((p: any) => p.levelId === levelId);
    return progress ? progress.score : 0;
  };
  
  const isLevelLocked = (level: Level) => {
    if (!isAuthenticated) return level.isLocked;
    
    // Expert level is locked by default
    if (level.difficulty === "expert") return true;
    
    // For other levels, check if the previous level is completed
    const previousLevelIndex = levels?.findIndex(l => l.id === level.id) - 1;
    if (previousLevelIndex < 0) return false;
    
    const previousLevel = levels?.[previousLevelIndex];
    if (!previousLevel) return false;
    
    const previousLevelProgress = userProgress?.find((p: any) => p.levelId === previousLevel.id);
    return !(previousLevelProgress?.isCompleted);
  };

  return (
    <section className="py-16 bg-[#f5f5f5]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-6 text-[#424242]">Your Learning Journey</h2>
        <p className="text-center text-[#9e9e9e] max-w-3xl mx-auto mb-12">
          Progress through carefully designed modules that build your skills from beginner to advanced.
        </p>
        
        {isLoadingLevels || isLoadingProgress ? (
          <LearningPathSkeleton />
        ) : (
          <div className="grid md:grid-cols-4 gap-6">
            {levels?.map((level) => (
              <LearningPathCard 
                key={level.id} 
                level={level} 
                progress={getProgressForLevel(level.id)}
                isLocked={isLevelLocked(level)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default LearningPath;
