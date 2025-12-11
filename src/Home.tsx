import React from "react";
import { Header } from "./mainComponents/Header";
import { HeroSection } from "./mainComponents/HeroSection";
import { EmergencyCall } from "./mainComponents/ReportAbout/EmergencyCall";
import OurMission from "./mainComponents/OurMission";
import LatestBlogPosts from "./mainComponents/Admin/AdminBlogs/LatestBlogPosts";
import DonateUs from "./mainComponents/SupportUs/DonateUs";
import Footer from "./mainComponents/Footer";
import RunningDog from "./mainComponents/RunningDog";
import HalfAbout from "./mainComponents/HalfAbout";
import HomeGallery from "./mainComponents/Gallery/HomeGallery";
import SmallContactSec from "./mainComponents/ContactUs/SmallContactSec";
import TotalImpactView from "./mainComponents/Admin/AdminImpact/TotalImpactView";
import Testimonials from "./mainComponents/Testimonials/Testimonials";
import { Helmet } from "react-helmet";

const Home: React.FC = () => {
  return (
    <div className='min-h-screen flex flex-col'>
      <Helmet>
        <title>
          Prapti Foundation - Dog Rescue & Animal Welfare | Golaghat, Assam
        </title>
        <meta
          name='description'
          content='Prapti Foundation rescues and rehabilitates stray dogs in Golaghat, Assam. Join us in our mission to provide shelter, medical care, and loving homes.'
        />
        <meta
          name='keywords'
          content='Prapti Foundation Golaghat, dog rescue Assam, animal welfare Golaghat, stray dog shelter Assam'
        />
        <link rel='canonical' href='https://praptifoundation.in/' />
      </Helmet>
      <Header />
      <HeroSection />
      <EmergencyCall />
      <LatestBlogPosts />
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
