const Features = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-[#424242]">Why Learn with Abacus Master?</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-[#f5f5f5] rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center mb-4">
              <span className="material-icons text-3xl text-primary mr-3">school</span>
              <h3 className="text-xl font-semibold">Guided Learning</h3>
            </div>
            <p className="text-[#424242]">Step-by-step lessons with interactive guidance to master abacus techniques at your own pace.</p>
          </div>
          
          <div className="bg-[#f5f5f5] rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center mb-4">
              <span className="material-icons text-3xl text-primary mr-3">trending_up</span>
              <h3 className="text-xl font-semibold">Track Progress</h3>
            </div>
            <p className="text-[#424242]">Monitor your improvement with detailed analytics and achievement badges to stay motivated.</p>
          </div>
          
          <div className="bg-[#f5f5f5] rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center mb-4">
              <span className="material-icons text-3xl text-primary mr-3">psychology</span>
              <h3 className="text-xl font-semibold">Brain Development</h3>
            </div>
            <p className="text-[#424242]">Enhance cognitive abilities, concentration, and memory while learning valuable math skills.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
