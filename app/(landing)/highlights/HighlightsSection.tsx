import Container from '@/components/_core/layout/Container';

export default function HighlightsSection() {
  const stats = [
    { label: 'Participants', value: '5000+' },
    { label: 'Events', value: '25+' },
    { label: 'Prize Pool', value: '$10k' },
    { label: 'Colleges', value: '50+' },
  ];

  return (
    <section className='py-24 bg-muted/10 border-y border-white/5'>
      <Container>
         <div className='flex flex-col md:flex-row justify-between items-center gap-12'>
            <div className='md:w-1/3 text-center md:text-left'>
               <h2 className='text-4xl font-bold mb-4 text-white'>Last Year&apos;s <span className='text-primary'>Legacy</span></h2>
               <p className='text-muted-foreground'>
                 TALOS 2024 set new benchmarks. This year, we go beyond limits.
               </p>
            </div>
            
            <div className='md:w-2/3 grid grid-cols-2 md:grid-cols-4 gap-6 w-full'>
               {stats.map((stat, i) => (
                 <div key={i} className='text-center p-6 bg-black/40 rounded-xl border border-white/5 hover:border-primary/30 transition-colors'>
                    <h3 className='text-3xl font-black text-white mb-2'>{stat.value}</h3>
                    <p className='text-sm text-muted-foreground uppercase tracking-wider'>{stat.label}</p>
                 </div>
               ))}
            </div>
         </div>
      </Container>
    </section>
  );
}