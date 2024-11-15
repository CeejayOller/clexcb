// src/app/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import { ServiceCard } from "@/components/home/ServiceCard";
import HeroSection1 from "@/components/home/HeroSection";
import HeroSection from "@/components/home/HeroSection";
import Background from "@/components/home/Background";
import Footer from "@/components/home/Footer";

export default function LandingPage() {
  return (
    <div className="antialiased min-h-screen bg-black flex flex-col relative">
      <Background />
      <Navbar />
      <main className="flex-1 max-lg:pb-[150px] max-lg:pt-[100px] max-sm:pb-4 max-sm:pt-[100px] flex flex-col justify-between">
        <HeroSection />
      </main>
      <Footer />
    </div>
  );
}
