import type { Metadata } from 'next';
import HeroSection from '@/components/home/HeroSection';
import StatsSection from '@/components/home/StatsSection';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import IndustriesSection from '@/components/home/IndustriesSection';
import FeaturedJobs from '@/components/home/FeaturedJobs';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import HiringProcess from '@/components/home/HiringProcess';
import ContactCTA from '@/components/home/ContactCTA';

export const metadata: Metadata = {
  title: 'Recluta Talent Management | Leading HR Consultancy in India',
  description: 'India\'s trusted HR & recruitment partner. Expert staffing, executive search, and talent solutions across IT, BFSI, Manufacturing and more.',
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <WhyChooseUs />
      <IndustriesSection />
      <FeaturedJobs />
      <HiringProcess />
      <TestimonialsSection />
      <ContactCTA />
    </>
  );
}
