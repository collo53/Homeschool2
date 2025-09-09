import React from 'react';
import { Link } from 'react-router-dom';

function AboutServices() {
  return (
    <div className="flex flex-col justify-center items-center">

      {/* Section 1: Preschool & Kindergarten Readiness */}
      <div className="flex flex-col-reverse md:flex-row justify-center items-center gap-12 w-full bg-neutral-100 px-6 py-12 md:px-20 md:py-20 leading-9">
        <div className="flex flex-col w-full md:w-1/2">
          <h1 className="text-[#ffc01d] text-3xl md:text-4xl font-bold mb-4">
            Preschool & Kindergarten Readiness
          </h1>
          <p className="text-gray-700 text-base mb-4">
            Our readiness program prepares children with the foundational skills 
            they need to thrive in kindergarten. Through structured play, hands-on 
            activities, and guided exploration, we nurture both academic growth and 
            social-emotional development.
          </p>
          <ul className="text-gray-800 space-y-2">
            <li><span className="text-[#ffc01d] mr-2">✓</span>Early literacy & numeracy skills</li>
            <li><span className="text-[#ffc01d] mr-2">✓</span>Learning through play & discovery</li>
            <li><span className="text-[#ffc01d] mr-2">✓</span>Confidence & independence building</li>
          </ul>
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Link to="/admission">
              <button className="bg-[#ffc01d] text-white px-6 py-2 rounded-md hover:bg-black transition-all">
                Admission
              </button>
            </Link>
            <Link to="/services">
              <button className="text-[#ffc01d] border border-[#ffc01d] px-6 py-2 rounded-md hover:bg-[#ffc01d] hover:text-white transition-all">
                Learn More
              </button>
            </Link>
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <img
            src="https://images.unsplash.com/photo-1508830524289-0adcbe822b40?q=80&w=1080&auto=format&fit=crop"
            alt="Preschool Activities"
            className="w-full h-auto object-cover rounded-lg shadow-md"
          />
        </div>
      </div>

      {/* Section 2: Our Vision */}
      <div className="flex flex-col-reverse md:flex-row justify-center items-center gap-12 w-full px-6 py-12 md:px-20 md:py-20 leading-9">
        <div className="w-full md:w-1/2">
          <img
            src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=1080&auto=format&fit=crop"
            alt="Our Vision"
            className="w-full h-auto object-cover rounded-lg shadow-md"
          />
        </div>
        <div className="flex flex-col w-full md:w-1/2">
          <h1 className="text-[#ffc01d] text-3xl md:text-4xl font-bold mb-4">
            Our Vision
          </h1>
          <p className="text-gray-700 text-base mb-4">
            We believe that every child is a curious explorer, ready to shape the 
            world with imagination and creativity. Our vision is to provide a safe, 
            joyful, and nurturing environment where children grow into confident, 
            kind, and lifelong learners.
          </p>
          <ul className="text-gray-800 space-y-2">
            <li><span className="text-[#ffc01d] mr-2">✓</span>Interactive, child-centered learning</li>
            <li><span className="text-[#ffc01d] mr-2">✓</span>Skilled & compassionate educators</li>
            <li><span className="text-[#ffc01d] mr-2">✓</span>Focus on creativity & critical thinking</li>
          </ul>
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Link to="/admission">
              <button className="bg-[#ffc01d] text-white px-6 py-2 rounded-md hover:bg-black transition-all">
                Admission
              </button>
            </Link>
            <Link to="/about">
              <button className="text-[#ffc01d] border border-[#ffc01d] px-6 py-2 rounded-md hover:bg-[#ffc01d] hover:text-white transition-all">
                Learn More
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Section 3: Creative Free Play */}
      <div className="flex flex-col-reverse md:flex-row justify-center items-center gap-12 w-full bg-neutral-100 px-6 py-12 md:px-20 md:py-20 leading-9">
        <div className="flex flex-col w-full md:w-1/2">
          <h1 className="text-[#ffc01d] text-3xl md:text-4xl font-bold mb-4">
            Creative Free Play
          </h1>
          <p className="text-gray-700 text-base mb-4">
            Play is at the heart of learning. Through unstructured free play, 
            children practice problem-solving, develop social skills, and 
            express creativity in meaningful ways. Our play-based approach 
            encourages imagination while strengthening resilience and teamwork.
          </p>
          <ul className="text-gray-800 space-y-2">
            <li><span className="text-[#ffc01d] mr-2">✓</span>Self-led exploration & discovery</li>
            <li><span className="text-[#ffc01d] mr-2">✓</span>Problem-solving through play</li>
            <li><span className="text-[#ffc01d] mr-2">✓</span>Encouraging imagination & teamwork</li>
          </ul>
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Link to="/admission">
              <button className="bg-[#ffc01d] text-white px-6 py-2 rounded-md hover:bg-black transition-all">
                Admission
              </button>
            </Link>
            <Link to="/services">
              <button className="text-[#ffc01d] border border-[#ffc01d] px-6 py-2 rounded-md hover:bg-[#ffc01d] hover:text-white transition-all">
                Learn More
              </button>
            </Link>
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <img
            src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1080&auto=format&fit=crop"
            alt="Creative Free Play"
            className="w-full h-auto object-cover rounded-lg shadow-md"
          />
        </div>
      </div>
    </div>
  );
}

export default AboutServices;
