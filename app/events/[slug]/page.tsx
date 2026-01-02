import PageSection from '@/components/_core/layout/PageSection';
import Link from 'next/link';
import { CardBody, CardContainer, CardItem } from '@/components/ui/3d-card';

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <PageSection title='Event Details' className='min-h-screen'>
      <div className='max-w-4xl mx-auto'>
        <CardContainer className='w-full py-10'>
          <CardBody className='w-full h-auto'>
            <CardItem translateZ='100' className='w-full'>
              <div className='h-64 bg-gradient-to-r from-red-900 to-black rounded-xl flex items-end p-8 border border-white/10 shadow-2xl shadow-red-500/10'>
                <h1 className='text-4xl md:text-6xl font-black text-white tracking-tighter'>
                  EVENT NAME
                </h1>
              </div>
            </CardItem>
          </CardBody>
        </CardContainer>
        
        <div className='grid md:grid-cols-3 gap-8'>
           <div className='md:col-span-2 space-y-8'>
              <div className='prose prose-invert max-w-none'>
                 <h3 className='text-3xl md:text-4xl font-bold font-zen-dots text-[#dc2626] mb-4'>Description</h3>
                 <p className='text-muted-foreground leading-relaxed font-ibm-plex-mono text-lg font-bold'>
                   This is a placeholder description for the event. In a real application, this would fetch data based on the slug: <span className='font-mono text-white'>{slug}</span>.
                 </p>
                 <p className='text-muted-foreground leading-relaxed font-ibm-plex-mono text-lg font-bold'>
                   Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                 </p>
              </div>
              
              <div className='bg-muted/20 p-6 rounded-xl border border-white/5'>
                 <h3 className='text-3xl md:text-4xl font-bold font-zen-dots text-[#dc2626] mb-4'>Rules</h3>
                 <ul className='list-disc pl-5 space-y-2 text-gray-400 font-ibm-plex-mono font-bold text-lg'>
                    <li>Rule number one.</li>
                    <li>Rule number two.</li>
                    <li>Judges decision is final.</li>
                 </ul>
              </div>
           </div>
           
           <div className='space-y-6'>
              <div className='bg-muted/20 p-6 rounded-xl border border-white/5'>
                 <h4 className='text-xl font-bold font-zen-dots text-[#dc2626] mb-4'>Event Info</h4>
                 <div className='space-y-4 text-base font-bold font-ibm-plex-mono'>
                    <div className='flex justify-between'>
                       <span className='text-gray-500'>Date</span>
                       <span className='text-white'>Feb 14, 2025</span>
                    </div>
                    <div className='flex justify-between'>
                       <span className='text-gray-500'>Time</span>
                       <span className='text-white'>10:00 AM</span>
                    </div>
                    <div className='flex justify-between'>
                       <span className='text-gray-500'>Venue</span>
                       <span className='text-white'>Main Auditorium</span>
                    </div>
                 </div>
                 
                 <Link href='/register' className='block w-full text-center bg-primary text-white py-3 rounded-lg font-bold text-sm mt-6 hover:bg-red-700 transition-all shadow-[0_0_15px_rgba(220,38,38,0.5)] hover:shadow-[0_0_25px_rgba(220,38,38,0.8)]'>
                    Register Now
                 </Link>
              </div>
           </div>
        </div>
      </div>
    </PageSection>
  );
}
