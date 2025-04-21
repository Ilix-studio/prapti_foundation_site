import React from "react";
import { Header } from "./mainComponents/Header";
import { HeroSection } from "./mainComponents/HeroSection";
import { EmergencyCall } from "./mainComponents/ReportAbout/EmergencyCall";
import OurMission from "./mainComponents/OurMission";

const Home: React.FC = () => {
  return (
    <main className='min-h-screen flex flex-col'>
      <Header />
      <HeroSection />
      <EmergencyCall />
      {/* <BlogsPage /> */}
      <OurMission />
    </main>
  );
};

export default Home;
