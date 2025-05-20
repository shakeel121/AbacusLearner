import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgeIcon } from "@/components/ui/badge-icon";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Level } from "@shared/schema";
import Certificate from "@/components/Certificate";
import { useState } from "react";

const ProgressPage = () => {
  const { isAuthenticated, user } = useAuth();
  const [showCertificate, setShowCertificate] = useState(false);
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    window.location.href = "/api/login";
    return null;
  }
  
  // Fetch user progress data
  const { data: progress, isLoading: isLoadingProgress } = useQuery({
    queryKey: ["/api/progress"],
    enabled: isAuthenticated,
  });
  
  // Fetch levels for reference
  const { data: levels, isLoading: isLoadingLevels } = useQuery<Level[]>({
    queryKey: ["/api/levels"],
  });
  
  // Fetch user achievements
  const { data: achievements, isLoading: isLoadingAchievements } = useQuery({
    queryKey: ["/api/achievements/user"],
    enabled: isAuthenticated,
  });
  
  // Get total completed levels
  const getCompletedLevelsCount = () => {
    if (!progress) return 0;
    return progress.filter((p: any) => p.isCompleted).length;
  };
  
  // Get overall progress percentage
  const getOverallProgress = () => {
    if (!progress || !levels || levels.length === 0) return 0;
    
    const totalLevels = levels.length;
    const completedLevels = getCompletedLevelsCount();
    
    return Math.round((completedLevels / totalLevels) * 100);
  };
  
  // Prepare data for charts
  const prepareChartData = () => {
    if (!progress || !levels) return [];
    
    return levels.map(level => {
      const levelProgress = progress.find((p: any) => p.levelId === level.id);
      return {
        name: level.name,
        score: levelProgress ? levelProgress.score : 0,
        isCompleted: levelProgress ? levelProgress.isCompleted : false,
        difficulty: level.difficulty
      };
    });
  };
  
  // Prepare pie chart data
  const preparePieData = () => {
    if (!progress || !levels) return [];
    
    const completed = getCompletedLevelsCount();
    const inProgress = progress.filter((p: any) => !p.isCompleted && p.score > 0).length;
    const notStarted = (levels.length || 0) - completed - inProgress;
    
    return [
      { name: 'Completed', value: completed, color: '#4caf50' },
      { name: 'In Progress', value: inProgress, color: '#ff9800' },
      { name: 'Not Started', value: notStarted, color: '#9e9e9e' }
    ];
  };
  
  const chartData = prepareChartData();
  const pieData = preparePieData();
  
  if (isLoadingProgress || isLoadingLevels || isLoadingAchievements) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Your Progress</h1>
        
        <div className="space-y-8">
          <Skeleton className="h-40 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-80 w-full" />
            <Skeleton className="h-80 w-full" />
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Your Progress</h1>
      
      {/* Summary Card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Progress Summary</CardTitle>
          <CardDescription>
            Your overall progress in the abacus learning journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">
                {getCompletedLevelsCount()}
              </div>
              <div className="text-[#9e9e9e]">Levels Completed</div>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-secondary mb-2">
                {achievements?.length || 0}
              </div>
              <div className="text-[#9e9e9e]">Achievements Earned</div>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">
                {getOverallProgress()}%
              </div>
              <div className="text-[#9e9e9e]">Overall Progress</div>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="text-sm mb-2">Overall completion: {getOverallProgress()}%</div>
            <Progress value={getOverallProgress()} className="h-3" />
          </div>
        </CardContent>
      </Card>
      
      {/* Progress Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Level Progress</CardTitle>
            <CardDescription>
              Your progress across different difficulty levels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 20, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                  <YAxis />
                  <Tooltip />
                  <Bar 
                    dataKey="score" 
                    name="Score"
                    fill="#3f51b5"
                    barSize={30}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Completion Status</CardTitle>
            <CardDescription>
              Overview of your learning journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Achievements Section */}
      <Card>
        <CardHeader>
          <CardTitle>Achievements</CardTitle>
          <CardDescription>
            Badges and recognition earned through your progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          {achievements && achievements.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {/* Map through user achievements */}
              {achievements.map((achievement: any) => (
                <div key={achievement.id} className="text-center">
                  <BadgeIcon
                    icon="emoji_events"
                    variant="secondary"
                    size="lg"
                    className="mx-auto mb-2"
                  />
                  <div className="font-medium">{achievement.name}</div>
                  <div className="text-xs text-[#9e9e9e]">Earned on {new Date(achievement.earnedAt).toLocaleDateString()}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <BadgeIcon
                icon="emoji_events"
                variant="locked"
                size="lg"
                className="mx-auto mb-4"
              />
              <p>No achievements earned yet. Keep practicing to earn badges!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressPage;
