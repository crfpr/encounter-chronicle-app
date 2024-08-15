import React from 'react';
import { motion } from 'framer-motion';

const Sparkles = () => {
  const sparkles = Array.from({ length: 5 }).map((_, i) => (
    <motion.div
      key={i}
      className="absolute w-1 h-1 bg-yellow-400 rounded-full"
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 0],
        scale: [0, 1, 0],
        x: Math.random() * 40 - 20,
        y: Math.random() * 40 - 20,
      }}
      transition={{
        duration: 0.5,
        delay: Math.random() * 0.2,
        ease: "easeInOut",
      }}
    />
  ));

  return (
    <div className="relative ml-2 w-6 h-6">
      {sparkles}
    </div>
  );
};

export default Sparkles;