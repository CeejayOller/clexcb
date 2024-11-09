"use client";
import Image from "next/image";
import React from "react";

const Background: React.FC = () => {
  return (
    <>
      <div className="absolute inset-0 pointer-events-none">
        <div className="h-full flex justify-center items-start">
          <div className="h-[50vh] md:h-[70vh] w-full overflow-hidden relative">
            <Image
              src="/landing/hero-bg1.png"
              alt="Background"
              layout="fill"
              objectFit="cover"
              className="mask-radial rounded-b-[50px] md:rounded-b-[150px]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white/70 via-white/15 to-transparent rounded-b-[50px] md:rounded-b-[150px] mask-bottom" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Background;
