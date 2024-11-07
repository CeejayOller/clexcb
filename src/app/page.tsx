// src/app/page.tsx
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import Navbar from '@/components/layout/Navbar';
import { ServiceCard } from '@/components/home/ServiceCard';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            CLEX Customs Brokerage
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your trusted partner in customs clearance and trade compliance
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/sign-in">
              <Button size="lg">Get Started</Button>
            </Link>
            <Link href="/inquiry">
              <Button variant="outline" size="lg">Make an Inquiry</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50" id="services">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <ServiceCard 
              title="Import Clearance"
              description="Complete customs clearance services for all your import needs"
            />
            <ServiceCard 
              title="Import Accreditation Assistance"
              description="Assist or handle your import accreditation"
            />
            <ServiceCard 
              title="Trade Consultancy"
              description="Professional advice on trade regulations and compliance"
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16" id="about">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">About Us</h2>
          <div className="prose prose-lg mx-auto">
            <p className="text-gray-600">
              CLEX Customs Brokerage is a leading provider of customs clearance services,
              dedicated to facilitating smooth international trade operations for our clients.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
