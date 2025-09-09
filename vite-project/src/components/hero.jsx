import React from "react";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="w-screen">
      <div className="flex flex-col md:flex-row justify-center items-center bg-gradient-to-r from-black via-gray-900 to-yellow-400 px-6 py-20 md:h-screen">
        
        <div className="w-full md:w-1/2 text-yellow-300 flex flex-col justify-center items-center md:items-start mt-16 md:mt-0 text-center md:text-left animate-fadeInLeft">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 leading-tight drop-shadow-lg">
            Learning Center for Your Kids
          </h1>
          <p className="text-base sm:text-lg leading-7 text-white max-w-lg mb-8">
            Empower your child’s future with fun, engaging, and interactive
            learning experiences. Discover a world where curiosity meets
            creativity.
          </p>
          <Link
            to="/pages/services"
            className="px-8 py-3 bg-yellow-400 text-black font-semibold rounded-full shadow-md hover:shadow-xl hover:bg-yellow-500 transition duration-300"
          >
            Explore More
          </Link>
        </div>

        <div className="w-full md:w-1/2 mt-10 md:mt-0 flex justify-center animate-fadeInRight">
          <img
            src="https://images.unsplash.com/photo-1642072525068-69da5a1fabfc?q=80&w=985&auto=format&fit=crop&ixlib=rb-4.0.3"
            alt="Kids Learning"
            className="w-full max-w-md h-72 md:h-[28rem] object-cover object-center rounded-xl shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;
