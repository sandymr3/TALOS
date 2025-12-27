export default function MascotSection() {
  return (
    <section className='py-32 text-center relative bg-black overflow-hidden'>
      {/* Spotlight Effect */}
      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/20 blur-[100px] rounded-full pointer-events-none' />
      
      <div className='container mx-auto px-4 relative z-10'>
        <h2 className='text-4xl md:text-5xl font-black mb-12 text-white tracking-tighter'>
          MEET <span className='text-primary'>TALOS</span>
        </h2>
        
        <div className='w-64 h-80 md:w-96 md:h-96 mx-auto relative group cursor-pointer'>
           {/* Abstract Shape / Placeholder */}
           <div className='absolute inset-0 bg-gradient-to-b from-red-500 to-red-900 clip-path-polygon opacity-80 group-hover:opacity-100 transition-opacity duration-500 shadow-[0_0_50px_rgba(220,38,38,0.5)]' 
                style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
           </div>
           
           <div className='absolute inset-1 bg-black clip-path-polygon flex items-center justify-center'
                style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
                <span className='text-muted-foreground group-hover:text-white transition-colors font-mono'>[3D MODEL LOADING]</span>
           </div>
        </div>
        
        <p className='mt-12 text-muted-foreground max-w-lg mx-auto'>
          The bronze giant of Crete, reimagined for the digital age. A symbol of strength, protection, and technological marvel.
        </p>
      </div>
    </section>
  );
}