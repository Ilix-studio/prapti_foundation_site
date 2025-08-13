import React from "react";
import { Header } from "./mainComponents/Header";
import { HeroSection } from "./mainComponents/HeroSection";
import { EmergencyCall } from "./mainComponents/ReportAbout/EmergencyCall";
import OurMission from "./mainComponents/OurMission";
import LatestBlogPosts from "./mainComponents/BlogPosts/LatestBlogPosts";
import DonateUs from "./mainComponents/DonateUs";
import Footer from "./mainComponents/Footer";

import RunningDog from "./mainComponents/RunningDog";
import HalfAbout from "./mainComponents/HalfAbout";
import HomeGallery from "./mainComponents/Gallery/HomeGallery";
import SmallContactSec from "./mainComponents/ContactUs/SmallContactSec";
import TotalImpactView from "./mainComponents/Admin/AdminImpact/TotalImpactView";

const Home: React.FC = () => {
  return (
    <main className='min-h-screen flex flex-col'>
      <Header />
      <HeroSection />
      <EmergencyCall />
      <LatestBlogPosts />
      <HalfAbout />
      <HomeGallery />
      <OurMission />
      <DonateUs />
      <SmallContactSec />
      <TotalImpactView />
      <RunningDog />
      <Footer />
    </main>
  );
};

export default Home;
