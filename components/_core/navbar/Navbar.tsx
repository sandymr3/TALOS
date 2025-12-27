import Link from 'next/link';
import Container from '../layout/Container';

export default function Navbar() {
  return (
    <nav className='bg-background/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-50'>
      <Container className='h-16 flex items-center justify-between'>
        <Link href='/' className='font-bold text-xl tracking-tighter hover:text-primary transition-colors'>
          TALOS 2025
        </Link>
        <div className='flex gap-6 items-center'>
          <Link href='/events' className='text-sm font-medium hover:text-primary transition-colors'>Events</Link>
          <Link href='/workshops' className='text-sm font-medium hover:text-primary transition-colors'>Workshops</Link>
          <Link href='/gallery' className='text-sm font-medium hover:text-primary transition-colors'>Gallery</Link>
          <Link href='/about' className='text-sm font-medium hover:text-primary transition-colors'>About</Link>
          <Link href='/login' className='bg-primary text-primary-foreground px-5 py-2 rounded-full text-sm font-medium hover:bg-red-700 transition-colors'>
            Login
          </Link>
        </div>
      </Container>
    </nav>
  );
}