import React from "react";
import HeroSection from "../components/HeroSection.jsx";
import NavbarPage from "./NavbarPage.jsx";
import FooterSection from "../components/FooterSection.jsx";

const MainPage = () => {
  return (
    <div className="w-full min-h-screen font-esamanru bg-gradient-to-b from-black via-gray-800 to-gray-700 text-white">
      <NavbarPage />
      <main>
        <HeroSection />
        <FooterSection />
      </main>
    </div>
  );
};

export default MainPage;
