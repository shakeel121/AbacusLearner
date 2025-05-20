import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Parent",
    avatar: "person",
    quote: "My daughter has improved so much in math since starting with Abacus Master. Her mental calculation speed is impressive!",
    stars: 5
  },
  {
    name: "Michael Chen",
    role: "Teacher",
    avatar: "person",
    quote: "I recommend this to all my students. The interactive abacus and progress tracking make learning math enjoyable and effective.",
    stars: 4.5
  },
  {
    name: "Emily Rodriguez",
    role: "Student",
    avatar: "person",
    quote: "Math used to be my worst subject, but now I love it! The achievement badges kept me motivated to keep learning.",
    stars: 5
  }
];

const Testimonials = () => {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={`star-${i}`} className="material-icons">star</span>);
    }
    
    if (hasHalfStar) {
      stars.push(<span key="half-star" className="material-icons">star_half</span>);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="material-icons">star_border</span>);
    }
    
    return stars;
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-[#424242]">What Our Students Say</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-[#f5f5f5] rounded-lg p-6 shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                  <span className="material-icons text-primary">{testimonial.avatar}</span>
                </div>
                <div>
                  <h4 className="font-bold">{testimonial.name}</h4>
                  <p className="text-sm text-[#9e9e9e]">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-[#424242] italic">"{testimonial.quote}"</p>
              <div className="flex mt-4 text-secondary">
                {renderStars(testimonial.stars)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
