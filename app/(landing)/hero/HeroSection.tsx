import Link from 'next/link';
import Container from '@/components/_core/layout/Container';

export default function HeroSection() {
  return (
    <section className='relative h-screen flex items-center justify-center overflow-hidden'>
      {/* Background with Red Glow */}
      <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/20 via-black to-black -z-10' />
      
      <Container className='text-center z-10'>
        <div className='inline-block mb-4 px-3 py-1 border border-red-500/30 rounded-full bg-red-500/10 backdrop-blur-sm'>
          <span className='text-red-400 text-xs font-semibold tracking-wider uppercase'>February 14-16, 2025</span>
        </div>
        
        <h1 className='text-7xl md:text-9xl font-black mb-6 tracking-tighter text-white'>
          TALOS <span className='text-primary'>2025</span>
        </h1>
        
        <p className='text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10'>
          The ultimate technical symposium. Unleash your potential, compete with the best, and witness the future of technology.
        </p>
        
        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
          <Link 
            href='/register' 
            className='px-8 py-4 bg-primary text-white font-bold rounded-full hover:bg-red-700 transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(220,38,38,0.5)]'
          >
            Register Now
          </Link>
          <Link 
            href='/about' 
            className='px-8 py-4 bg-transparent border border-white/20 text-white font-bold rounded-full hover:bg-white/10 transition-all'
          >
            Learn More
          </Link>
        </div>
      </Container>
    </section>
  );
}