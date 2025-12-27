import Container from '../layout/Container';

export default function Footer() {
  return (
    <footer className='border-t border-white/10 bg-black py-12 mt-auto'>
      <Container>
        <div className='flex flex-col md:flex-row justify-between items-center gap-6'>
          <div className='text-center md:text-left'>
            <h3 className='text-2xl font-bold mb-2 tracking-tighter text-primary'>TALOS 2025</h3>
            <p className='text-muted-foreground text-sm max-w-xs'>
              Unleashing innovation and creativity through technology and design.
            </p>
          </div>
          <div className='text-center md:text-right'>
            <p className='text-muted-foreground text-sm'>© 2025 TALOS Symposium. All rights reserved.</p>
          </div>
        </div>
      </Container>
    </footer>
  );
}