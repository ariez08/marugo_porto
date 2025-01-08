import React from "react";
import { motion } from "framer-motion";
import Card from "../components/card";
import CapsuleButton from "../components/capsule_button";

interface HomeCardProps {
  bgColor: string;
  imgSrc: string;
  altText: string;
  buttonText: string;
  buttonClass: string;
  buttonLink?: string;
  delayTime?: number;
}

const HomeCard: React.FC<HomeCardProps> = ({
  bgColor,
  imgSrc,
  altText,
  buttonText,
  buttonClass,
  buttonLink,
  delayTime,
}) => {
  return (
    <motion.div 
      className="group flex flex-col items-center"
      animate={{ y: [0, -10, 0] }} // Bounce effect
      transition={{
        duration: 2,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut",
        delay: delayTime
      }}
    >
      <Card className={bgColor}>
        <img
          src={imgSrc}
          alt={altText}
          className="w-48 object-cover transform transition-transform duration-300 group-hover:scale-110"
        />
      </Card>
      <CapsuleButton
        text={buttonText}
        className={buttonClass}
        to={buttonLink}
      />
    </motion.div>
  );
};

export default HomeCard;
