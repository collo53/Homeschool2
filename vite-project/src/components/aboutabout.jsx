import React from "react";

function Aboutabout() {
  return (
    <section className="flex flex-col-reverse md:flex-row justify-center items-center gap-12 w-full bg-neutral-100 px-6 py-12 md:px-20 md:py-20">
      
      {/* Text Section */}
      <div className="flex flex-col w-full md:w-1/2 text-center md:text-left">
        <h1 className="text-[#ffc01d] text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
          About Us
        </h1>
        <p className="text-gray-700 text-lg leading-relaxed mb-6">
          At <span className="font-semibold text-[#ffc01d]">Homeschool Hub</span>, 
          we believe that every child deserves a personalized approach to education. 
          Our mission is to create a nurturing environment where curiosity thrives, 
          talents are discovered, and learning becomes a joyful journey.  
        </p>
        <p className="text-gray-700 text-lg leading-relaxed mb-6">
          We partner with families to provide flexible, innovative, and engaging 
          programs that support academic excellence while also building confidence, 
          creativity, and character.
        </p>

        {/* Key Values */}
        <h2 className="text-[#ffc01d] font-bold text-3xl pb-2">Our Goals</h2>
        <ul className="text-gray-800 space-y-3 mb-8">
          <li className="flex items-center">
            <span className="text-[#ffc01d] text-xl mr-3">✓</span>
            Personalized learning paths for every child
          </li>
          <li className="flex items-center">
            <span className="text-[#ffc01d] text-xl mr-3">✓</span>
            Focus on creativity, critical thinking, and confidence
          </li>
          <li className="flex items-center">
            <span className="text-[#ffc01d] text-xl mr-3">✓</span>
            Strong partnership with families and communities
          </li>
        </ul>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="bg-[#ffc01d] text-white font-medium px-8 py-3 rounded-lg shadow-md hover:bg-black hover:shadow-lg transition-all duration-300">
            Admission
          </button>
          <button className="text-[#ffc01d] border-2 border-[#ffc01d] font-medium px-8 py-3 rounded-lg hover:bg-[#ffc01d] hover:text-white transition-all duration-300">
            Learn More
          </button>
        </div>
      </div>

      <div className="w-full md:w-1/2">
        <img
          src="https://images.unsplash.com/photo-1727553957823-a54c8ff6a3ff?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3"
          alt="About Us"
          className="w-full h-auto object-cover rounded-2xl shadow-lg hover:scale-105 transition-transform duration-500"
        />
      </div>
    </section>
  );
}

export default Aboutabout;
