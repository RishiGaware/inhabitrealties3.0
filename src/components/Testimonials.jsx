import React from 'react';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';
import { TESTIMONIAL_IMAGES } from '../config/images';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah L.",
      title: "First-Time Home Buyer",
      quote: "The team made my first home purchase a breeze. Their expertise and personalized service were outstanding. I couldn't be happier with my new home!",
      image: TESTIMONIAL_IMAGES.sarah,
      rating: 5,
    },
    {
      name: "Michael B.",
      title: "Luxury Property Investor",
      quote: "As an investor, I need an agency that understands the market. Their insights led me to a high-return luxury property. A truly professional experience.",
      image: TESTIMONIAL_IMAGES.michael,
      rating: 5,
    },
    {
      name: "Jessica T.",
      title: "Growing Family",
      quote: "Finding a home that fits a growing family's needs is tough, but they found us the perfect place in a great neighborhood. We're forever grateful!",
      image: TESTIMONIAL_IMAGES.jessica,
      rating: 5,
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            What Our Clients Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
            Don't just take our word for it. Here's what our satisfied clients have to say about their experience with us.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white rounded-md shadow p-4 hover:shadow-lg transition-all duration-500 transform hover:-translate-y-1 border border-gray-100"
              style={{ 
                animationDelay: `${index * 0.2}s`,
                animation: 'fadeInUp 0.8s ease-out forwards'
              }}
            >
              <div className="flex items-center mb-6">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <FaStar key={i} className="text-yellow-400 text-sm" />
                    ))}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {testimonial.name}
                  </h3>
                  <p className="text-sm text-gray-600" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {testimonial.title}
                  </p>
                </div>
                <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-purple-100">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              <div className="relative">
                <FaQuoteLeft className="text-4xl text-purple-200 absolute -top-2 -left-2" />
                <p className="text-sm text-gray-600 leading-relaxed pl-8" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {testimonial.quote}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-8">
          <div className="bg-white rounded-md shadow p-4 max-w-xl mx-auto">
            <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              Ready to Join Our Happy Clients?
            </h3>
            <p className="text-sm text-gray-600 mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>
              Start your journey today and experience the difference that professional real estate services can make.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 text-xs font-semibold">
                Get Started Today
              </button>
              <button className="px-4 py-2 border-2 border-purple-600 text-purple-600 rounded-md hover:bg-purple-600 hover:text-white transition-all duration-300 transform hover:scale-105 text-xs font-semibold">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials; 