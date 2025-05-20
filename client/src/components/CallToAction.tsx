import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";

const CallToAction = () => {
  const { isAuthenticated } = useAuth();

  return (
    <section className="py-16 bg-primary text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Master the Abacus?</h2>
        <p className="text-xl mb-8 max-w-3xl mx-auto">
          Join thousands of students who have improved their math skills and cognitive abilities with our interactive abacus platform.
        </p>
        <Button
          className="bg-secondary text-white px-8 py-4 rounded-full font-medium hover:bg-white hover:text-secondary transition-colors duration-200 shadow-lg text-lg"
          asChild
        >
          {isAuthenticated ? (
            <Link href="/learn">Get Started Free</Link>
          ) : (
            <a href="/api/login">Get Started Free</a>
          )}
        </Button>
        <p className="mt-4 text-white/80">No credit card required. Free account includes basic lessons.</p>
      </div>
    </section>
  );
};

export default CallToAction;
