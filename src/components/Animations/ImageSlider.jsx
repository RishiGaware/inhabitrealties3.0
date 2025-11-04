import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

// Copyright-free images from Unsplash
const images = [
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80',
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80',
  'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=1200&q=80',
  'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=80',
  'https://images.unsplash.com/photo-1505843514667-8f62bfb4e5c3?w=1200&q=80',
];

const ImageSlider = () => {
  const [imageErrors, setImageErrors] = useState({});

  // Fallback images from Unsplash if primary images fail
  const fallbackImages = [
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=80',
    'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=80',
    'https://images.unsplash.com/photo-1505843514667-8f62bfb4e5c3?w=1200&q=80',
    'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=1200&q=80',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80',
  ];

  const handleImageError = (index, e) => {
    if (!imageErrors[index]) {
      setImageErrors(prev => ({ ...prev, [index]: true }));
      // Try fallback image
      const fallbackIndex = index % fallbackImages.length;
      e.target.src = fallbackImages[fallbackIndex];
    } else {
      // If fallback also fails, show placeholder
      e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Crect fill="%23ddd" width="800" height="600"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="40" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3EApartment Image%3C/text%3E%3C/svg%3E';
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-8">
        Featured Apartments
      </h2>
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        effect="fade"
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={true}
        className="rounded-lg shadow-2xl h-64 md:h-80 lg:h-96"
        style={{
          '--swiper-navigation-color': '#A300A3',
          '--swiper-pagination-color': '#A300A3',
        }}
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <img 
              src={image} 
              alt={`Featured Apartment ${index + 1}`} 
              className="w-full h-full object-cover rounded-lg" 
              onError={(e) => handleImageError(index, e)}
              loading="lazy"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ImageSlider; 