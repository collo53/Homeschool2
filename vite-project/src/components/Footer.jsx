import React from "react";
import { Link } from "react-router-dom";

import { FaHome } from "react-icons/fa";
function Footer() {
    return(

        
         <footer className="bg-gray-200 py-12 px-6 border-t border-gray-300">
                <div className="max-w-6xl mx-auto text-center">
                  <div className="text-2xl font-bold text-[#ffc01d] mb-4">HOMESCHOOL HUB</div>
                  <p className="text-gray-700 mb-6">Empowering families through personalized education</p>
                  <div className="flex justify-center space-x-6 text-sm text-gray-700">
                    <Link to="/" className="hover:text-[#ffc01d] transition-colors">Home</Link>
                    <Link to="/pages/about" className="hover:text-[#ffc01d] transition-colors">About</Link>
                    <Link to="/pages/services" className="hover:text-[#ffc01d] transition-colors">Services</Link>
                    <Link to="/pages/contact" className="hover:text-[#ffc01d] transition-colors">Contact</Link>
                  </div>
                </div>
              </footer>
      

    );
}
export default Footer;