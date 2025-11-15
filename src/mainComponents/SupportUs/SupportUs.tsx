import React from "react";

import { Header } from "@/mainComponents/Header";
import Footer from "@/mainComponents/Footer";
import BankStatementCard from "./BankStatementCard";

const SupportUs: React.FC = () => {
  return (
    <div className='flex flex-col min-h-screen'>
      <Header />
      <BankStatementCard />
      <Footer />
    </div>
  );
};
export default SupportUs;
