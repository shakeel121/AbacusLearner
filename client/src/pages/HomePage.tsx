import Hero from "@/components/Hero";
import Features from "@/components/Features";
import LearningPath from "@/components/LearningPath";
import AbacusDemo from "@/components/AbacusDemo";
import DifficultySelector from "@/components/DifficultySelector";
import Testimonials from "@/components/Testimonials";
import CallToAction from "@/components/CallToAction";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const HomePage = () => {
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated && user) {
      toast({
        title: "Welcome back!",
        description: `Great to see you again, ${user.firstName || 'friend'}!`,
        duration: 3000,
      });
    }
  }, [isAuthenticated, user]);

  return (
    <>
      <Hero />
      <Features />
      <LearningPath />
      <AbacusDemo />
      <DifficultySelector />
      <Testimonials />
      <CallToAction />
    </>
  );
};

export default HomePage;
