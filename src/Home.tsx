import React from "react";
import { Header } from "./mainComponents/Header";
import { HeroSection } from "./mainComponents/HeroSection";
import { EmergencyCall } from "./mainComponents/ReportAbout/EmergencyCall";
import OurMission from "./mainComponents/OurMission";
import LatestBlogPosts from "./mainComponents/AdminBlogs/LatestBlogPosts";
import DonateUs from "./mainComponents/DonateUs";
import Footer from "./mainComponents/Footer";
import RunningDog from "./mainComponents/RunningDog";
import HalfAbout from "./mainComponents/HalfAbout";
import HomeGallery from "./mainComponents/Gallery/HomeGallery";
import SmallContactSec from "./mainComponents/ContactUs/SmallContactSec";
import TotalImpactView from "./mainComponents/Admin/AdminImpact/TotalImpactView";
import Testimonials from "./mainComponents/Testimonials/Testimonials";

const Home: React.FC = () => {
  return (
    <div className='min-h-screen flex flex-col'>
      <Header />
      <HeroSection />
      <EmergencyCall />
      <LatestBlogPosts />
      <br />
      <br />
      <HalfAbout />
      <br />
      <br />
      <HomeGallery />
      <br />
      <OurMission />
      <br />
      <DonateUs />
      <br />
      <Testimonials />
      <br />
      <SmallContactSec />
      <br />
      <TotalImpactView />
      <br />
      <RunningDog />
      <br />
      <Footer />
    </div>
  );
};

export default Home;
