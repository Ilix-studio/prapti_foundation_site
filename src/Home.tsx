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

const Home: React.FC = () => {
  return (
    <main className='min-h-screen flex flex-col'>
      <Header />
      <HeroSection />
      <EmergencyCall />
      <HalfAbout />
      <LatestBlogPosts />
      <OurMission />
      <DonateUs />
      <RunningDog />
      <Footer />
    </main>
  );
};

export default Home;
