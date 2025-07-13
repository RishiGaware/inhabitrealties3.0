import React, { useRef } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const developers = [
  {
    name: 'Prestige Group',
    logo: 'https://images.pexels.com/photos/439391/pexels-photo-439391.jpeg?auto=compress&w=80&h=80',
    description: 'Prestige Group is one of India’s leading real estate developers, known for luxury residential and commercial projects across major cities.',
    website: 'https://www.prestigeconstructions.com/'
  },
  {
    name: 'DLF Limited',
    logo: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&w=80&h=80',
    description: 'DLF is India’s largest publicly listed real estate company, with a legacy of over 70 years in residential, commercial, and retail properties.',
    website: 'https://www.dlf.in/'
  },
  {
    name: 'Godrej Properties',
    logo: 'https://images.pexels.com/photos/209251/pexels-photo-209251.jpeg?auto=compress&w=80&h=80',
    description: 'Godrej Properties brings the Godrej Group philosophy of innovation and excellence to the real estate industry.',
    website: 'https://www.godrejproperties.com/'
  },
  {
    name: 'Sobha Limited',
    logo: 'https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg?auto=compress&w=80&h=80',
    description: 'Sobha Limited is a renowned developer with a reputation for quality construction and timely delivery in India and the Middle East.',
    website: 'https://www.sobha.com/'
  },
  {
    name: 'Brigade Group',
    logo: 'https://images.pexels.com/photos/210617/pexels-photo-210617.jpeg?auto=compress&w=80&h=80',
    description: 'Brigade Group is a leading property developer in South India, known for innovative and sustainable developments.',
    website: 'https://www.brigadegroup.com/'
  },
  {
    name: 'Oberoi Realty',
    logo: 'https://images.pexels.com/photos/221502/pexels-photo-221502.jpeg?auto=compress&w=80&h=80',
    description: 'Oberoi Realty is a premium real estate developer in Mumbai, delivering iconic residential and commercial projects.',
    website: 'https://www.oberoirealty.com/'
  },
  {
    name: 'Lodha Group',
    logo: 'https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg?auto=compress&w=80&h=80',
    description: 'Lodha Group is one of India’s largest real estate developers, known for luxury and affordable housing projects.',
    website: 'https://www.lodhagroup.in/'
  },
  {
    name: 'Hiranandani Developers',
    logo: 'https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&w=80&h=80',
    description: 'Hiranandani Developers is a pioneer in integrated townships and premium real estate in India.',
    website: 'https://www.hiranandani.com/'
  },
  {
    name: 'Mahindra Lifespaces',
    logo: 'https://images.pexels.com/photos/417344/pexels-photo-417344.jpeg?auto=compress&w=80&h=80',
    description: 'Mahindra Lifespaces is committed to sustainable urbanization and green buildings across India.',
    website: 'https://www.mahindralifespaces.com/'
  },
  {
    name: 'Puravankara Limited',
    logo: 'https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg?auto=compress&w=80&h=80',
    description: 'Puravankara Limited is a trusted name in Indian real estate, delivering quality homes for over four decades.',
    website: 'https://www.puravankara.com/'
  }
];

const TopDevelopers = () => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.8;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-white to-gray-50" id="top-developers">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-purple-700 mb-12" style={{ fontFamily: "'Playfair Display', serif" }}>
          Top Real Estate Developers
        </h2>
        <div className="relative">
          {/* Left Arrow */}
          <button
            className="flex items-center justify-center absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 hover:bg-purple-100 text-purple-700 transition-all duration-200"
            style={{ outline: 'none' }}
            onClick={() => scroll('left')}
            aria-label="Scroll left"
          >
            <FaChevronLeft size={20} />
          </button>
          {/* Scrollable Cards */}
          <div
            ref={scrollRef}
            className="flex overflow-x-auto space-x-6 pb-4 scrollbar-thin scrollbar-thumb-purple-200 scrollbar-track-gray-100 snap-x snap-mandatory"
            style={{ scrollBehavior: 'smooth' }}
          >
            {developers.map((dev) => (
              <div key={dev.name} className="min-w-[300px] max-w-xs bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center text-center transition-transform duration-300 hover:scale-105 hover:shadow-2xl snap-center">
                <img src={dev.logo} alt={dev.name} className="w-20 h-20 rounded-full object-cover mb-4 border-4 border-purple-100 shadow" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>{dev.name}</h3>
                <p className="text-gray-600 text-sm mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>{dev.description}</p>
                <a href={dev.website} target="_blank" rel="noopener noreferrer" className="inline-block px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-full hover:bg-purple-700 transition-all duration-200">
                  Visit Website
                </a>
              </div>
            ))}
          </div>
          {/* Right Arrow */}
          <button
            className="flex items-center justify-center absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 hover:bg-purple-100 text-purple-700 transition-all duration-200"
            style={{ outline: 'none' }}
            onClick={() => scroll('right')}
            aria-label="Scroll right"
          >
            <FaChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default TopDevelopers; 