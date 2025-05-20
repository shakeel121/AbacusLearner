import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";

const Hero = () => {
  const { isAuthenticated } = useAuth();

  return (
    <section className="bg-primary text-white py-12">
      <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Master Mental Math with Abacus</h1>
          <p className="text-lg mb-6">Develop calculation skills, improve concentration, and enhance memory through interactive abacus training.</p>
          <div className="flex flex-wrap gap-4">
            <Button
              className="bg-secondary text-white px-6 py-3 rounded-full font-medium hover:bg-white hover:text-secondary transition-colors duration-200 shadow-md"
              asChild
            >
              {isAuthenticated ? (
                <Link href="/learn">Start Learning</Link>
              ) : (
                <a href="/api/login">Start Learning</a>
              )}
            </Button>
            <Button
              variant="outline"
              className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-full font-medium hover:bg-white hover:text-primary transition-colors duration-200"
              asChild
            >
              <Link href="/learn">Take a Tour</Link>
            </Button>
          </div>
        </div>
        <div className="flex justify-center">
          <img 
            src="https://images.unsplash.com/photo-1632571401005-458e9d244591?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400" 
            alt="Abacus learning illustration" 
            className="rounded-lg shadow-lg max-w-full h-auto"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
