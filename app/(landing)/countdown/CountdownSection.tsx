export default function CountdownSection() {
  return (
    <section className='py-20 text-center bg-black border-y border-white/5 relative overflow-hidden'>
      <div className='absolute inset-0 bg-red-900/5 -z-10' />
      <div className='container mx-auto px-4'>
         <p className='text-primary tracking-widest uppercase text-sm font-semibold mb-6'>The Countdown Begins</p>
         <div className='flex justify-center gap-4 md:gap-12 font-mono text-4xl md:text-7xl font-bold text-white'>
            <div className='flex flex-col items-center'>
               <span>45</span>
               <span className='text-sm md:text-base font-sans font-normal text-muted-foreground mt-2'>Days</span>
            </div>
            <span className='text-red-500 animate-pulse'>:</span>
            <div className='flex flex-col items-center'>
               <span>12</span>
               <span className='text-sm md:text-base font-sans font-normal text-muted-foreground mt-2'>Hours</span>
            </div>
            <span className='text-red-500 animate-pulse'>:</span>
            <div className='flex flex-col items-center'>
               <span>30</span>
               <span className='text-sm md:text-base font-sans font-normal text-muted-foreground mt-2'>Minutes</span>
            </div>
         </div>
      </div>
    </section>
  );
}