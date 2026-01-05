import PageSection from '@/components/_core/layout/PageSection';
import Link from 'next/link';
import { CardBody, CardContainer, CardItem } from '@/components/ui/3d-card';

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <PageSection title='Event Details' className='min-h-screen'>
      <div className='max-w-4xl mx-auto'>
        <CardContainer className='w-full py-8'>
          <CardBody className='w-full h-[300px] relative rounded-xl border border-white/10 shadow-2xl overflow-hidden bg-black'>
            {/* Holographic Background Layers */}
            <CardItem translateZ='-50' className='absolute inset-0 w-full h-full'>
              <div className='absolute inset-0 bg-gradient-to-br from-red-950 via-black to-red-900 opacity-90' />
              <div className='absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(220,38,38,0.15),transparent_70%)] animate-pulse' />
              <div className='absolute inset-0 opacity-20' style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '24px 24px' }} />
            </CardItem>

            <div className='relative h-full flex flex-col justify-between p-6 md:p-8 z-10'>
              {/* Event Title Overlay */}
              <CardItem translateZ='100' className='mt-auto w-full'>
                <h1 className='text-3xl md:text-5xl font-black text-white tracking-tighter uppercase leading-none drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]'>
                  {slug.replace(/-/g, ' ')}
                </h1>
              </CardItem>
              
              {/* Info Section at the Bottom */}
              <CardItem translateZ='80' className='mt-4 pt-4 border-t border-white/10 w-full'>
                <div className='flex flex-wrap gap-6 md:gap-12 text-white/90 font-ibm-plex-mono'>
                  <div className='flex flex-col'>
                    <span className='text-[10px] uppercase tracking-[0.2em] text-red-500 font-bold mb-1'>Date</span>
                    <span className='text-xs md:text-sm font-bold'>FEB 14, 2025</span>
                  </div>
                  <div className='flex flex-col'>
                    <span className='text-[10px] uppercase tracking-[0.2em] text-red-500 font-bold mb-1'>Time</span>
                    <span className='text-xs md:text-sm font-bold'>10:00 AM</span>
                  </div>
                  <div className='flex flex-col'>
                    <span className='text-[10px] uppercase tracking-[0.2em] text-red-500 font-bold mb-1'>Venue</span>
                    <span className='text-xs md:text-sm font-bold uppercase'>Main Auditorium</span>
                  </div>
                </div>
              </CardItem>
            </div>
            
            {/* Corner Accent */}
            <CardItem translateZ='40' className='absolute top-0 right-0 p-6'>
               <div className='text-red-600/20 font-black text-4xl select-none'>T</div>
            </CardItem>
          </CardBody>
        </CardContainer>
        
        <div className='grid md:grid-cols-3 gap-8 px-4 md:px-0'>
           <div className='md:col-span-2 space-y-8'>
              <div className='prose prose-invert max-w-none pb-8 border-b border-red-950/40'>
                 <h3 className='text-2xl md:text-3xl font-bold font-zen-dots text-[#dc2626] mb-4'>Description</h3>
                 <p className='text-muted-foreground leading-relaxed ibm-plex-mono-semibold text-base md:text-lg text-left font-bold'>
                   This is a placeholder description for the event. In a real application, this would fetch data based on the slug: <span className='font-mono text-white'>{slug}</span>.
                 </p>
                 <p className='text-muted-foreground leading-relaxed ibm-plex-mono-semibold text-base md:text-lg text-left font-bold'>
                   Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                 </p>
              </div>
              
              <div className='bg-muted/20 p-6 rounded-xl border border-red-950/40'>
                 <h3 className='text-2xl md:text-3xl font-bold font-zen-dots text-[#dc2626] mb-4'>Rules</h3>
                 <ul className='list-disc pl-5 space-y-2 text-gray-300 ibm-plex-mono-semibold text-base md:text-lg font-bold'>
                    <li>Rule number one: Participants must arrive 30 minutes before the event starts.</li>
                    <li>Rule number two: Use of unauthorized materials will lead to immediate disqualification.</li>
                    <li>Judges decision is final and binding for all participants.</li>
                 </ul>
              </div>
           </div>
           
           <div className='space-y-6'>
              <div className='bg-muted/20 p-6 rounded-xl border border-red-950/40'>
                 <h4 className='text-lg font-bold font-zen-dots text-[#dc2626] mb-4'>Event Info</h4>
                 <div className='space-y-4 text-sm md:text-base ibm-plex-mono-semibold font-bold'>
                    <div className='flex justify-between border-b border-white/5 pb-2'>
                       <span className='text-gray-300'>Date:</span>
                       <span className='text-white'>Feb 14, 2025</span>
                    </div>
                    <div className='flex justify-between border-b border-white/5 pb-2'>
                       <span className='text-gray-300'>Time:</span>
                       <span className='text-white'>10:00 AM</span>
                    </div>
                    <div className='flex justify-between border-b border-white/5 pb-2'>
                       <span className='text-gray-300'>Venue:</span>
                       <span className='text-white'>Main Auditorium</span>
                    </div>
                 </div>
                 
                 <Link href='/register' className='block w-full text-center bg-white text-black py-2.5 rounded-lg font-bold text-base mt-6 hover:bg-red-600 hover:text-white transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(220,38,38,0.5)] zen-dots-regular uppercase'>
                    Register Now
                 </Link>
              </div>
           </div>
        </div>
      </div>
    </PageSection>
  );
}
