import React from "react";

function ServicesHero() {
  return (
    <section className="relative flex flex-col md:flex-row items-center justify-center text-center md:text-left bg-gradient-to-r from-black via-gray-900 to-yellow-400 px-6 md:px-12 h-screen">
      
      {/* Content */}
      <div className="max-w-2xl">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-6 text-yellow-300 drop-shadow-lg">
          Services We Offer
        </h1>

        <p className="text-sm sm:text-base lg:text-lg leading-relaxed text-gray-100 mb-8">
         We are committed to providing quality education that nurtures 
  academic excellence, personal growth, and lifelong learning. We offer a wide 
  range of programs — from strong academic foundations and co-curricular 
  activities to student mentorship and community engagement — ensuring every 
  learner reaches their fullest potential.
        </p>

        
      </div>
    </section>
  );
}

export default ServicesHero;
