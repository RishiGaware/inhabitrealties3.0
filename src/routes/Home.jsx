import React from 'react';
import Banner from '../components/Banner';
import Features from '../pages/common/Features';
import AboutUs from '../pages/common/AboutUs';
import HouseList from '../components/Houses/HouseList';
import GetStarted from '../components/GetStarted';
import ImageSlider from '../components/Animations/ImageSlider';
import FeaturedServices from '../components/FeaturedServices';
import Testimonials from '../components/Testimonials';
import Agents from '../components/Agents';
import HowItWorks from '../components/HowItWorks';
import PropertyFeatures from '../components/NeighborhoodGuides';

const Home = () => {
  return (
    <div className="bg-white">
      <Banner />
      <Features />
      <HouseList />
      <FeaturedServices />
      <HowItWorks />
      <Testimonials />
      <Agents />
      <PropertyFeatures />
      <ImageSlider />
      <AboutUs />
      <GetStarted />
    </div>
  );
};

export default Home;