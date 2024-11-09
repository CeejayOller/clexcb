import { Button } from "@/components/ui/button";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { MotionDiv } from "@/components/layout/MotionDiv";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import { services } from "@/constants/";
import { ExpandableCards } from "@/components/home/ExpandableCards";

export default function HeroSection() {
  const titleVariants = {
    hidden: { opacity: 0, y: 50 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="w-full h-fit max-w-7xl mx-auto flex flex-col justify-start py-8">
      <div className="px-4 md:pl-4 md:pr-[50%] z-10 flex flex-col items-center sm:pt-16 pt-16 md:pt-24 w-full">
        <div className="mb-4 text-left w-full">
          <MotionDiv variants={titleVariants} initial="hidden" className="mb-4">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#00729E]">
              Your Client-Centric Partner in Customs Brokerage
            </h1>
          </MotionDiv>
          <TextGenerateEffect
            words="Delivering swift, seamless, and satisfying services to our clients."
            className="text-md md:text-lg lg:text-xl text-[#F6E2C3] mb-4 md:pr-[20%]"
            delay={1}
          />
          <div className="flex flex-col sm:flex-row gap-4 justify-start">
            <Button
              size="lg"
              className="bg-yellow-500 hover:bg-yellow-600 text-blue-900"
            >
              Get Started
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>

      {/* Our Services - adjusted max-w and padding */}
      <div className="w-full px-4 mb-8 flex flex-col items-center">
        <div className="w-full">
          <div className="inline-flex flex-col mb-5 text-left">
            <h2 className="text-2xl font-bold text-[#DFF1FA] text-left z-10">
              Our Services
            </h2>

            <div className="relative w-full h-[5px] flex">
              <div className="absolute left-0 w-[20%] h-full bg-[#a67b2c]" />
              <div className="absolute right-0 w-[75%] h-full bg-[#0088b2]" />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 xl:justify-between md:justify-center sm:justitfy-center lg:gap-4 md:gap-4 w-full">
          {services.map((service) => (
            <HoverEffect
              key={service.link}
              title={service.title}
              description={service.description}
              link={service.link}
              image={service.image}
              hoverImage={service.hoverImage}
            />
          ))}
        </div>
      </div>

      <ExpandableCards />
    </section>
  );
}
