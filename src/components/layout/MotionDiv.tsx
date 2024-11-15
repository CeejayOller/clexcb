/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useRef, ReactNode } from "react";
import { motion, useAnimation, Variants, MotionProps } from "framer-motion";

interface MotionDivProps extends MotionProps {
  className?: string;
  itemVariants?: Variants; // Default item variants for all children
  childVariants?: Variants[]; // Specific variants for each child
  children: ReactNode; // Ensure children is of type ReactNode
}

export const MotionDiv: React.FC<MotionDivProps> = ({
  children,
  className,
  variants,
  initial,
  itemVariants,
  childVariants,
}) => {
  const controls = useAnimation();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            controls.start("show");
          } else {
            controls.start("hidden");
          }
        });
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [controls]);

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial={initial}
      animate={controls}
      className={className}
    >
      {React.Children.map(children, (child, index) =>
        React.isValidElement(child) ? (
          <motion.div
            variants={childVariants ? childVariants[index] : itemVariants}
          >
            {child}
          </motion.div>
        ) : (
          child
        )
      )}
    </motion.div>
  );
};
