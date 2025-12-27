import HeroSection from "./(landing)/hero/HeroSection";
import CountdownSection from "./(landing)/countdown/CountdownSection";
import MascotSection from "./(landing)/mascot/MascotSection";
import HighlightsSection from "./(landing)/highlights/HighlightsSection";
import PreviewSection from "./(landing)/events-preview/PreviewSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <CountdownSection />
      <MascotSection />
      <HighlightsSection />
      <PreviewSection />
    </>
  );
}