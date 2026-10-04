import React, { ReactNode } from "react";
import CatPic from "../assets/flower_cat.png";
import { HiOutlineChevronDoubleRight } from "react-icons/hi";
import { motion } from "framer-motion";

interface AboutCardProps {
  name: string;
  children: ReactNode;
  delay?: number;
}

const AboutCard: React.FC<AboutCardProps> = ({ name, children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="text-white w-full max-w-sm flex flex-col"
    >
      <div className="bg-blue border-2 border-white w-fit px-4 py-1 rounded-full flex items-center gap-1.5 shadow-md">
        <h2 className="text-2xl text-white font-name font-semibold">{name}</h2>
        <HiOutlineChevronDoubleRight className="text-yellow-200 text-3xl font-bold" />
      </div>
      <div className="relative mt-2 p-4 sm:p-5 text-sm sm:text-base font-desc border-3 border-white rounded-3xl bg-white/10 backdrop-blur-xs shadow-md grow">
        {children}
        <img
          src={CatPic}
          alt="Decoration Cat"
          className="absolute -right-2 -bottom-2 w-9 sm:w-10 pointer-events-none"
        />
      </div>
    </motion.div>
  );
};

export default AboutCard;
