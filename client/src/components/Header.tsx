import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, isLoading } = useAuth();
  const [location] = useLocation();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-primary text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <span className="material-icons text-3xl mr-2">calculate</span>
          <h1 className="text-xl md:text-2xl font-bold">Abacus Master</h1>
        </div>
        
        {/* Navigation for larger screens */}
        <nav className="hidden md:flex space-x-6 items-center">
          <Link href="/" className={`hover:text-secondary transition-colors duration-200 ${location === '/' ? 'text-secondary' : ''}`}>
            Home
          </Link>
          <Link href="/learn" className={`hover:text-secondary transition-colors duration-200 ${location === '/learn' ? 'text-secondary' : ''}`}>
            Learn
          </Link>
          <Link href="/practice" className={`hover:text-secondary transition-colors duration-200 ${location === '/practice' ? 'text-secondary' : ''}`}>
            Practice
          </Link>
          <Link href="/progress" className={`hover:text-secondary transition-colors duration-200 ${location === '/progress' ? 'text-secondary' : ''}`}>
            Progress
          </Link>
          
          {isLoading ? (
            <div className="h-10 w-24 bg-white/20 rounded-full animate-pulse"></div>
          ) : isAuthenticated ? (
            <div className="flex items-center space-x-2 cursor-pointer">
              <Avatar className="w-8 h-8 bg-white/20">
                <AvatarImage src={user?.profileImageUrl || ''} alt={user?.firstName || 'User'} />
                <AvatarFallback className="text-white">
                  <span className="material-icons">person</span>
                </AvatarFallback>
              </Avatar>
              <span>{user?.firstName || 'User'}</span>
              <a 
                href="/api/logout" 
                className="bg-white/20 text-white px-3 py-1 rounded-full text-sm hover:bg-white/30 transition-colors duration-200"
              >
                Log Out
              </a>
            </div>
          ) : (
            <Button
              variant="outline"
              className="bg-white text-primary px-4 py-2 rounded-full font-medium hover:bg-secondary hover:text-white transition-colors duration-200"
              asChild
            >
              <a href="/api/login">Log In</a>
            </Button>
          )}
        </nav>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden text-white focus:outline-none" 
          onClick={toggleMobileMenu}
        >
          <span className="material-icons">menu</span>
        </button>
      </div>
      
      {/* Mobile menu, hidden by default */}
      <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'} bg-primary/95 w-full`}>
        <div className="container mx-auto px-4 py-3 flex flex-col space-y-3">
          <Link 
            href="/" 
            className="text-white hover:text-secondary py-2 transition-colors duration-200" 
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            href="/learn" 
            className="text-white hover:text-secondary py-2 transition-colors duration-200" 
            onClick={() => setMobileMenuOpen(false)}
          >
            Learn
          </Link>
          <Link 
            href="/practice" 
            className="text-white hover:text-secondary py-2 transition-colors duration-200" 
            onClick={() => setMobileMenuOpen(false)}
          >
            Practice
          </Link>
          <Link 
            href="/progress" 
            className="text-white hover:text-secondary py-2 transition-colors duration-200" 
            onClick={() => setMobileMenuOpen(false)}
          >
            Progress
          </Link>
          
          {isAuthenticated ? (
            <div className="flex items-center space-x-2">
              <Avatar className="w-8 h-8 bg-white/20">
                <AvatarImage src={user?.profileImageUrl || ''} alt={user?.firstName || 'User'} />
                <AvatarFallback className="text-white">
                  <span className="material-icons">person</span>
                </AvatarFallback>
              </Avatar>
              <span>{user?.firstName || 'User'}</span>
              <a
                href="/api/logout"
                className="bg-white/20 text-white px-3 py-1 rounded-full text-sm hover:bg-white/30 transition-colors duration-200"
              >
                Log Out
              </a>
            </div>
          ) : (
            <Button
              variant="outline"
              className="bg-white text-primary px-4 py-2 rounded-full font-medium hover:bg-secondary hover:text-white transition-colors duration-200 self-start"
              asChild
            >
              <a href="/api/login">Log In</a>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
