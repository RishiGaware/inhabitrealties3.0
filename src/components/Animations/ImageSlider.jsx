import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

import a1 from '../../assets/images/apartments/a1lg.png';
import a2 from '../../assets/images/apartments/a2lg.png';
import a3 from '../../assets/images/apartments/a3lg.png';
import a4 from '../../assets/images/apartments/a4lg.png';
import a5 from '../../assets/images/apartments/a5lg.png';
import a6 from '../../assets/images/apartments/a6lg.png';

const images = [a1, a2, a3, a4, a5, a6];

const ImageSlider = () => {
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
            <img src={image} alt={`Apartment ${index + 1}`} className="w-full h-full object-cover rounded-lg" />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ImageSlider; 