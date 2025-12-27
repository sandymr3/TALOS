import Link from 'next/link';
import Container from '@/components/_core/layout/Container';

export default function PreviewSection() {
  return (
    <section className='py-24 bg-black'>
      <Container>
        <div className='flex justify-between items-end mb-12'>
           <h2 className='text-3xl font-bold text-white'>Featured Events</h2>
           <Link href='/events' className='text-primary hover:text-white transition-colors text-sm font-semibold'>View All &rarr;</Link>
        </div>
        
        <div className='grid md:grid-cols-3 gap-6'>
           {[1, 2, 3].map((i) => (
             <div key={i} className='group relative h-64 rounded-xl overflow-hidden bg-muted/20 border border-white/10'>
                <div className='absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80' />
                <div className='absolute bottom-0 left-0 p-6'>
                   <span className='inline-block px-2 py-1 bg-primary text-white text-xs font-bold rounded mb-2'>Trending</span>
                   <h3 className='text-xl font-bold text-white group-hover:text-primary transition-colors'>Flagship Event {i}</h3>
                   <p className='text-sm text-gray-300 mt-2 line-clamp-2'>Experience the thrill of competition with our headline event.</p>
                </div>
             </div>
           ))}
        </div>
      </Container>
    </section>
  );
}