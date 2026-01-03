import Link from 'next/link';
import Container from '@/components/_core/layout/Container';
import DecryptedText from '@/components/ui/DecryptedText';
import HolographicWave from '@/components/ui/HolographicWave';

export default function HeroSection() {
  return (
    <section className='relative h-screen flex items-center justify-center overflow-hidden'>
      <HolographicWave />
      
      <Container className='text-center z-10'>
        
        <div className="relative inline-block mb-6">
          <span 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10rem] md:text-[16rem] text-[#ff0000]/40 -z-10 whitespace-nowrap select-none pointer-events-none drop-shadow-[0_0_30px_rgba(255,0,0,0.8)]"
            style={{ fontFamily: '"Zen Dots", sans-serif' }}
          >
            5.0
          </span>
          <h1 className='text-6xl md:text-8xl font-extrabold tracking-tighter text-white relative z-10'>
            <DecryptedText
              text="TALOS"
              animateOn="view"
              revealDirection="center"
              speed={100}
              maxIterations={20}
            />
          </h1>
        </div>
      </Container>
    </section>
  );
}