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
    <section className="w-full min-h-[calc(100vh-4rem)] max-w-7xl mx-auto flex flex-col justify-start">
      <div className="flex-1 h-fit px-4 md:pl-4 md:pr-[50%] z-10 flex flex-col items-center justify-center">
        <div className="w-full">
          <MotionDiv
            variants={titleVariants}
            initial="hidden"
            className="[margin-bottom:clamp(0.25rem,0.7vh,0.5rem)]"
          >
            <h1 className="font-bold text-[#00729E] [font-size:clamp(1rem,min(2vh,2vw)+1rem,5rem)]">
              Your Client-Centric Partner in Customs Brokerage
            </h1>
          </MotionDiv>
          <TextGenerateEffect
            words="Delivering swift, seamless, and satisfying services to our clients."
            className="text-[#F6E2C3] [margin-bottom:clamp(0.25rem,1vh,1rem)] md:pr-[20%] [font-size:clamp(0.75rem,min(1.2vh,1.2vw)+0.25rem,1.25rem)]"
            delay={1}
          />
          <div className="flex flex-col sm:flex-row [gap:clamp(0.25rem,0.75vh,0.75rem)] justify-start">
            <Button
              size="lg"
              className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 [font-size:clamp(0.7rem,min(1vh,1vw)+0.25rem,1rem)]"
            >
              Get Started
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white [font-size:clamp(0.7rem,min(1vh,1vw)+0.25rem,1rem)]"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>

      {/* Services section with proper spacing */}
      <div className="w-full px-4 [padding-top:clamp(0.5rem,2vh,2rem)] [padding-bottom:clamp(0.5rem,2vh,2rem)]">
        <div className="w-full">
          <div className="inline-flex flex-col [margin-bottom:clamp(0.5rem,1vh,1.5rem)] text-left">
            <h2 className="text-[#DFF1FA] text-left z-10 [font-size:clamp(0.875rem,min(1.5vh,1.5vw)+0.5rem,2rem)] font-bold">
              Our Services
            </h2>
            <div className="relative w-full h-[5px] flex">
              <div className="absolute left-0 w-[20%] h-full bg-[#a67b2c]" />
              <div className="absolute right-0 w-[75%] h-full bg-[#0088b2]" />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center [gap:clamp(0.25rem,1vh,0.75rem)] xl:justify-between md:justify-center sm:justify-center w-full">
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
