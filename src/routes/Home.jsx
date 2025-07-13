import React from 'react';
import Banner from '../components/Banner';
import Features from '../pages/common/Features';
import AboutUs from '../pages/common/AboutUs';
import TopDevelopers from '../components/TopDevelopers';
import DownloadAppSection from '../components/DownloadAppSection';
import HouseList from '../components/Houses/HouseList';
import GetStarted from '../components/GetStarted';
import ImageSlider from '../components/Animations/ImageSlider';
import FeaturedServices from '../components/FeaturedServices';
import Testimonials from '../components/Testimonials';
import Agents from '../components/Agents';
import HowItWorks from '../components/HowItWorks';
import PropertyFeatures from '../components/NeighborhoodGuides';
import PropertySearchBar from '../components/Search/PropertySearchBar';

const Home = () => {
  return (
    <div className="bg-white">
      <Banner />
      <HouseList />
      <Features />
      <FeaturedServices />
      <HowItWorks />
      <Testimonials />
      <Agents />
      <PropertyFeatures />
      <ImageSlider />
      <AboutUs />
      <TopDevelopers />
      <GetStarted />
      <DownloadAppSection />
    </div>
  );
};

export default Home;