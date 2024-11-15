"use client";
import Image from "next/legacy/image";
import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { Badge } from "@/components/ui/badge";
import { Mail, MapPin, PhoneCall, ChevronDown } from "lucide-react";

export function ExpandableCards() {
  const [active, setActive] = useState<(typeof cards)[number] | boolean | null>(
    null
  );
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();
  const contentRef = useRef<HTMLDivElement>(null);
  const [isScrollable, setIsScrollable] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const checkScroll = () => {
    const element = contentRef.current;
    if (element) {
      const isContentScrollable = element.scrollHeight > element.clientHeight;
      setIsScrollable(isContentScrollable);
      setIsScrolled(element.scrollTop > 0);
    }
  };

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
      checkScroll();
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  return (
    <>
      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && typeof active === "object" ? (
          <div className="fixed inset-0  grid place-items-center z-[100] bg-black/70">
            <motion.button
              key={`button-${active.title}-${id}`}
              layout
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
                transition: {
                  duration: 0.05,
                },
              }}
              className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              className="w-full max-w-[95%] sm:max-w-[70%] md:h-fit flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden rounded-2xl"
            >
              <motion.div layoutId={`image-${active.title}-${id}`}>
                <Image
                  unoptimized
                  width={200}
                  height={200}
                  src={active.src}
                  alt={active.title}
                  className="w-full h-32 sm:h-48 md:h-64 lg:h-80 sm:rounded-tr-lg sm:rounded-tl-lg object-cover object-top"
                />
              </motion.div>

              <div className="bg-[#FFF0CE] dark:bg-neutral-900">
                <div className="flex justify-between items-start p-4">
                  <div className="">
                    <motion.h3
                      layoutId={`title-${active.title}-${id}`}
                      className="font-bold text-lg sm:text-xl lg:text-2xl text-neutral-700 dark:text-neutral-200"
                    >
                      {active.title}
                    </motion.h3>
                    <motion.div
                      layoutId={`description-${active.description}-${id}`}
                      className="relative w-full h-[5px] flex"
                    >
                      <div className="absolute left-0 w-[20%] h-full bg-[#a67b2c]" />
                      <div className="absolute right-0 w-[75%] h-full bg-[#0088b2]" />
                    </motion.div>
                  </div>

                  <motion.a
                    layoutId={`button-${active.title}-${id}`}
                    href={active.ctaLink}
                    target="_blank"
                    className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-xs sm:text-sm rounded-full font-bold bg-green-500 text-white"
                  >
                    {active.ctaText}
                  </motion.a>
                </div>
                <div className="pt-4 relative px-4">
                  <motion.div
                    ref={contentRef}
                    onScroll={checkScroll}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-neutral-600 text-xs md:text-sm lg:text-base h-40 md:h-fit pb-10 flex flex-col items-start gap-4 overflow-auto dark:text-neutral-400 [scrollbar-width:none] relative"
                  >
                    {typeof active.content === "function"
                      ? active.content()
                      : active.content}

                    {isScrollable && !isScrolled && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-black dark:bg-white rounded-full p-1"
                      >
                        <ChevronDown className="w-4 h-4 text-white dark:text-black" />
                      </motion.div>
                    )}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      <ul className="max-w-xl mx-auto w-full flex flex-row gap-4 justify-center overflow-x-auto p-2">
        {cards.map((card) => (
          <motion.button
            layoutId={`button-${card.title}-${id}`}
            key={`card-${card.title}-${id}`}
            className="px-4 py-2 text-sm rounded-full font-bold bg-[#A67B2C] hover:bg-[#088AB5] hover:text-white text-black hover:mask-none mask-bottom"
            onClick={() => setActive(card)}
          >
            {card.ctaText}
          </motion.button>
        ))}
      </ul>
    </>
  );
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.05,
        },
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};

const cards = [
  {
    description: "Our Vision & Mission",
    title: "Vision & Mission",
    src: "/cards/mis-vis.png",
    ctaText: "Our Vision & Mission",
    ctaLink: "#",
    content: () => {
      return (
        <div className="space-y-6">
          <div className="space-y-2">
            <Badge className="bg-blue-100 text-blue-900 mb-2">Vision</Badge>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              To be the leading tech-driven customs brokerage and logistics firm
              in the Philippines, recognized for our efficiency, reliability,
              and client-centric approach, facilitating seamless global trade
              for businesses of all sizes.
            </p>
          </div>

          <div className="space-y-2">
            <Badge className="bg-blue-100 text-blue-900 mb-2">Mission</Badge>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              To revolutionize customs brokerage and logistics in the
              Philippines by harnessing advanced technology and delivering
              unparalleled customer service, ensuring smooth and expedited trade
              operations for our clients.
            </p>
          </div>
        </div>
      );
    },
  },
  {
    description: "Our Core Values",
    title: "Core Values: CLEX",
    src: "/cards/values.png",
    ctaText: "Our Core Values",
    ctaLink: "#",
    content: () => {
      return (
        <div className="space-y-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <h4 className="text-lg font-semibold flex items-center ">
                <Badge className="bg-yellow-100 text-yellow-900 mr-2">01</Badge>
                <span className="text-[#a67b2c]">C</span>LIENT-CENTRIC
              </h4>
              <p className="text-gray-700 dark:text-gray-300">
                We put our clients at the heart of everything we do. Their
                success is our success, and we strive to exceed their
                expectations in every interaction.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="text-lg font-semibold flex items-center ">
                <Badge className="bg-yellow-100 text-yellow-900 mr-2">02</Badge>
                <span className="text-[#a67b2c]">L</span>EADERSHIP IN INNOVATION
              </h4>
              <p className="text-gray-700 dark:text-gray-300">
                We lead the way in adopting and implementing cutting-edge
                technologies to revolutionize the customs brokerage industry.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="text-lg font-semibold flex items-center">
                <Badge className="bg-yellow-100 text-yellow-900 mr-2">03</Badge>
                <span className="text-[#a67b2c]">E</span>FFICIENCY IN EXECUTION
              </h4>
              <p className="text-gray-700 dark:text-gray-300">
                We are committed to optimizing processes and delivering swift,
                accurate services that save time and resources for our clients.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="text-lg font-semibold flex items-center">
                <Badge className="bg-yellow-100 text-yellow-900 mr-2">04</Badge>
                E<span className="text-[#a67b2c]">X</span>CELLENCE IN ALL
                ASPECTS
              </h4>
              <p className="text-gray-700 dark:text-gray-300">
                We pursue excellence in every facet of our operations, from
                customer service to compliance, ensuring the highest standards
                of quality and professionalism.
              </p>
            </div>
          </div>
        </div>
      );
    },
  },
  {
    description: "Get in Touch",
    title: "Contact Us",
    src: "/cards/contact.png",
    ctaText: "Contact Us",
    ctaLink: "#",
    content: () => {
      return (
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              {/*
               */}
              <MapPin />
              <p className="text-gray-700 dark:text-gray-300">
                Block 2 Lot 5, Dreamland, Hagonoy,
                <br />
                Taguig City, NCR, PH, 1630
              </p>
            </div>
            <div className="flex items-start gap-3">
              <PhoneCall />
              <p className="text-gray-700 dark:text-gray-300">
                +63-919-096-CLEX(2539)
              </p>
            </div>
            <div className="flex items-start gap-3">
              <Mail />
              <p className="text-gray-700 dark:text-gray-300">
                info@cloudexpresscb.com
              </p>
            </div>
          </div>
        </div>
      );
    },
  },
];
