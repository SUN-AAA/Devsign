import React from "react";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <div className="w-full min-h-[88vh] font-esamanru flex items-center justify-center flex-col text-center pt-20">
      <motion.h1
        className="text-5xl md:text-7xl font-bold mb-4"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        DEVSIGN
      </motion.h1>

      <motion.p
        className="text-md md:text-xl max-w-xl text-gray-300 font-Medium"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 1 }}
      >
        조선대학교 IT 동아리 DEVSIGN 홈페이지 방문을 환영합니다!
      </motion.p>
    </div>
  );
};

export default HeroSection;