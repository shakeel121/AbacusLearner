import { Link } from "wouter";

const Footer = () => {
  return (
    <footer className="bg-[#424242] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <span className="material-icons mr-2">calculate</span> 
              Abacus Master
            </h3>
            <p className="mb-4">Developing mathematical minds through interactive abacus learning.</p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-secondary transition-colors duration-200">
                <span className="material-icons">facebook</span>
              </a>
              <a href="#" className="hover:text-secondary transition-colors duration-200">
                <span className="material-icons">smartphone</span>
              </a>
              <a href="#" className="hover:text-secondary transition-colors duration-200">
                <span className="material-icons">alternate_email</span>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Learn</h4>
            <ul className="space-y-2">
              <li><Link href="/learn"><a className="hover:text-secondary transition-colors duration-200">Beginner Course</a></Link></li>
              <li><a href="#" className="hover:text-secondary transition-colors duration-200">Intermediate Course</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors duration-200">Advanced Course</a></li>
              <li><Link href="/practice"><a className="hover:text-secondary transition-colors duration-200">Practice Exercises</a></Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-secondary transition-colors duration-200">Abacus History</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors duration-200">Benefits of Abacus</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors duration-200">Math Tips</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors duration-200">Blog</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-secondary transition-colors duration-200">About Us</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors duration-200">Contact</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors duration-200">Terms of Service</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors duration-200">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-white/20 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Abacus Master. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
