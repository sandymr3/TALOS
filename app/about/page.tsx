import PageSection from '@/components/_core/layout/PageSection';

export default function AboutPage() {
  return (
    <PageSection title='About Us' className='min-h-screen'>
      <div className='max-w-4xl mx-auto space-y-16'>
        
        <div className='text-center'>
           <p className='text-2xl font-light leading-relaxed text-muted-foreground'>
             <span className='text-primary font-bold'>TALOS 2025</span> is not just a technical symposium; it&apos;s a convergence of brilliant minds, innovative ideas, and cutting-edge technology.
           </p>
        </div>

        <div className='grid md:grid-cols-2 gap-12'>
           <div className='p-8 bg-muted/20 rounded-2xl border border-white/5 hover:border-primary/30 transition-colors'>
              <h3 className='text-2xl font-bold mb-4 text-primary'>Our Mission</h3>
              <p className='text-muted-foreground leading-relaxed'>
                To provide a platform for students to showcase their technical prowess, foster a culture of innovation, and bridge the gap between academic learning and industry standards.
              </p>
           </div>
           <div className='p-8 bg-muted/20 rounded-2xl border border-white/5 hover:border-primary/30 transition-colors'>
              <h3 className='text-2xl font-bold mb-4 text-primary'>Our Vision</h3>
              <p className='text-muted-foreground leading-relaxed'>
                To become the premier technical symposium in the region, recognized for excellence in competition, workshops, and fostering the next generation of tech leaders.
              </p>
           </div>
        </div>

        <div>
           <h3 className='text-2xl font-bold mb-6 border-l-4 border-primary pl-4'>Legacy</h3>
           <p className='text-muted-foreground leading-relaxed mb-4'>
             Since its inception in 2015, TALOS has grown exponentially. From a small intra-college event to a massive inter-college festival hosting over 5000+ participants, our journey has been fueled by passion and code.
           </p>
           <p className='text-muted-foreground leading-relaxed'>
             This year, we are raising the bar even higher with 20+ events, industry-expert workshops, and a prize pool that screams opportunity.
           </p>
        </div>

      </div>
    </PageSection>
  );
}