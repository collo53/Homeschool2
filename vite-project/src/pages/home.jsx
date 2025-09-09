import { Link } from "react-router-dom";
import Navbar from "../components/navbar";
import { FaUserGraduate, FaChalkboardTeacher, FaClock, FaUsers } from "react-icons/fa";
const FeatureCard = ({ title, description, icon }) => (
  <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition flex flex-col items-center text-center">
    {icon}
    <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-700">{description}</p>
  </div>
);



const Home = () => {
  const features = [
  { 
    title: "Personalized Learning", 
    description: "Tailored curriculum that adapts to your child's unique learning style and pace from anywhere in the world.",
    icon: <FaUserGraduate className="text-[#ffc01d] text-4xl mb-4" />
  },
  { 
    title: "Expert Support", 
    description: "Access to experienced educators and comprehensive teaching resources.",
    icon: <FaChalkboardTeacher className="text-[#ffc01d] text-4xl mb-4" />
  },
  { 
    title: "Flexible Schedule", 
    description: "Learn at your own pace with a schedule that fits your family's lifestyle.",
    icon: <FaClock className="text-[#ffc01d] text-4xl mb-4" />
  },
  { 
    title: "Community Network", 
    description: "Connect with other homeschooling families for support and socialization.",
    icon: <FaUsers className="text-[#ffc01d] text-4xl mb-4" />
  }
];


  return (
    <div className="bg-gray-50  min-h-screen min-w-screen">
      <Navbar />
<section className="relative min-h-screen w-full pt-16 flex items-center justify-center">
  <img
    src="https://images.unsplash.com/photo-1708347456805-b7f83316a8ba?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    alt="Hero Background"
    className="absolute inset-0 w-full h-full object-center object-cover"
  />

  {/* Overlay */}
  <div className="absolute inset-0 "></div>

  {/* Content */}
  <div className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6 md:px-12 w-full">
    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight text-white">
      Welcome to Homeschool Hub
    </h1>
    <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 max-w-3xl text-white">
      Personalized Education for Every Child
    </p>
   
  </div>
</section>




      {/* Hero Section */}
      <section className="pt-28 pb-20 px-6 relative overflow-hidden">
        
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Empower Your Child's <span className="text-[#ffc01d]">Learning Journey</span>
            </h1>
            <p className="text-xl text-gray-700 max-w-lg">
              Discover personalized education with our comprehensive homeschool platform designed for modern families.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Link to="/pages/about" className="bg-[#ffc01d] text-white px-8 py-3 rounded-md hover:bg-black transition-all text-lg text-center">
               Learn More
              </Link>
             
            </div>

            <div className="flex items-center space-x-8 pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#ffc01d]">500+</div>
                <div className="text-sm text-gray-600">Families Served</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#ffc01d]">15+</div>
                <div className="text-sm text-gray-600">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#ffc01d]">98%</div>
                <div className="text-sm text-gray-600">Satisfaction Rate</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <img 
            src="https://images.unsplash.com/photo-1489710437720-ebb67ec84dd2?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Happy family homeschooling" 
              className="w-full h-auto object-cover rounded-2xl shadow-2xl hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-[#ffc01d]/20 rounded-full blur-xl"></div>
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-[#ffc01d]/10 rounded-full blur-xl"></div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Why Choose Our Platform?</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Everything you need to create an exceptional homeschool experience tailored to your family's unique needs.
            </p>
          </div>
         <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => <FeatureCard key={i} {...f} />)}
        </div>

        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center bg-[#ffc01d]/10 rounded-3xl p-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to Transform Your Child's Education?</h2>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Join hundreds of families who have discovered the joy of personalized learning.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/pages/services" className="bg-[#ffc01d] text-white px-8 py-3 rounded-md hover:bg-black transition-all text-lg text-center">
             View Our Services
            </Link>
            
          </div>
        </div>
      </section>

      {/* Footer */}
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
    </div>
  );
};

export default Home;
