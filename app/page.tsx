'use client';

import HeroSection from "./(landing)/hero/HeroSection";
import CountdownSection from "./(landing)/countdown/CountdownSection";
import MascotSection from "./(landing)/mascot/MascotSection";
import HighlightsSection from "./(landing)/highlights/HighlightsSection";
import PreviewSection from "./(landing)/events-preview/PreviewSection";
import ScrollVelocity from "@/components/ui/ScrollVelocity";

export default function Home() {
  return (
    <>
      <HeroSection />
      <CountdownSection />
      <MascotSection />
      <HighlightsSection />
      <ScrollVelocity texts={['TALOS 5.0', 'REGISTER NOW']} velocity={50} />
      <PreviewSection />
    </>
  );
}
