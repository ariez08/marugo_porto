import React, { ReactNode } from "react";
import Cat1 from "../assets/love_cat.png";
import { motion } from "framer-motion";

interface WorkExpProps {
  corp: string;
  date: string;
  children?: ReactNode;
  delay?: number;
}

const WorkExpCard: React.FC<WorkExpProps> = ({ corp, date, children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.45, delay, ease: "easeOut" }}
      className="p-3.5 sm:p-5 flex items-start gap-3 text-white border-b border-white/20 last:border-b-0"
    >
      <img
        src={Cat1}
        alt="icon_cat"
        className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 mt-0.5 object-contain"
      />
      <div className="min-w-0 grow">
        <h2 className="text-base sm:text-lg font-bold font-desc leading-snug break-words">
          {corp}
        </h2>
        <h3 className="text-xs sm:text-sm font-school text-yellow-200 mt-0.5">
          {date}
        </h3>
        <ul className="list-disc ml-4 mt-2 text-xs sm:text-sm font-desc text-white/95 space-y-1">
          {children}
        </ul>
      </div>
    </motion.div>
  );
};

export default WorkExpCard;
