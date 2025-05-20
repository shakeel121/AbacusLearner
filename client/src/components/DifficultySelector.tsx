import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const difficultyLevels = [
  {
    id: 1,
    name: 'Beginner',
    description: [
      'Basic addition & subtraction',
      'Numbers 1-100',
      'Guided exercises'
    ],
    color: 'bg-green-500',
    isLocked: false
  },
  {
    id: 2,
    name: 'Intermediate',
    description: [
      'Multi-digit operations',
      'Numbers 1-1000',
      'Timed challenges'
    ],
    color: 'bg-yellow-500',
    isLocked: false
  },
  {
    id: 3,
    name: 'Advanced',
    description: [
      'Multiplication & division',
      'Large numbers & decimals',
      'Speed calculation competitions'
    ],
    color: 'bg-red-500',
    isLocked: true
  }
];

const DifficultySelector = () => {
  const { isAuthenticated } = useAuth();

  return (
    <section className="py-16 bg-[#f5f5f5]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-6 text-[#424242]">Choose Your Difficulty</h2>
        <p className="text-center text-[#9e9e9e] max-w-3xl mx-auto mb-12">
          Whether you're just starting or looking to challenge yourself, we have the right level for you.
        </p>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {difficultyLevels.map((level) => (
            <div key={level.id} className="difficulty-selector bg-white rounded-lg overflow-hidden shadow-md">
              <div className={`h-2 ${level.color}`}></div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2 text-[#424242]">{level.name}</h3>
                <ul className="mb-4 text-[#9e9e9e] space-y-2">
                  {level.description.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className={`material-icons ${level.color.replace('bg-', 'text-')} mr-2 text-sm mt-1`}>check_circle</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                {!level.isLocked ? (
                  <Button
                    className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary/80 transition-colors duration-200"
                    asChild
                  >
                    {isAuthenticated ? (
                      <Link href={`/learn?level=${level.id}`}>
                        {level.name === 'Beginner' ? 'Start Here' : 'Challenge Yourself'}
                      </Link>
                    ) : (
                      <a href="/api/login">
                        {level.name === 'Beginner' ? 'Start Here' : 'Challenge Yourself'}
                      </a>
                    )}
                  </Button>
                ) : (
                  <Button
                    disabled
                    className="w-full bg-[#e0e0e0] text-[#424242] py-2 rounded-md cursor-not-allowed"
                  >
                    Complete Intermediate First
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DifficultySelector;
