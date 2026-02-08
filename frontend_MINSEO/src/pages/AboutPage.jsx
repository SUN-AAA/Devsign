import React, {useEffect, useState} from "react";
import NavbarPage from "./NavbarPage";

const AboutPage = () => {
    return (
        <div className="w-full min-h-screen font-esamanru text-white bg-gradient-to-b from-black via-gray-800 to-gray-700">
            <NavbarPage />
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-2xl font-bold text-center py-32">About Us</h1>
            </div>
        </div>
    );
};

export default AboutPage;