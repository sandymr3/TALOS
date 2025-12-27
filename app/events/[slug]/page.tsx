import PageSection from '@/components/_core/layout/PageSection';
import Link from 'next/link';

export default function EventDetailPage({ params }: { params: { slug: string } }) {
  return (
    <PageSection title='Event Details' className='min-h-screen'>
      <div className='max-w-4xl mx-auto'>
        <div className='h-64 bg-gradient-to-r from-red-900 to-black rounded-xl mb-8 flex items-end p-8 border border-white/10'>
          <h1 className='text-4xl md:text-6xl font-black text-white tracking-tighter'>
             EVENT NAME
          </h1>
        </div>
        
        <div className='grid md:grid-cols-3 gap-8'>
           <div className='md:col-span-2 space-y-8'>
              <div className='prose prose-invert max-w-none'>
                 <h3 className='text-xl font-bold text-primary mb-4'>Description</h3>
                 <p className='text-muted-foreground leading-relaxed'>
                   This is a placeholder description for the event. In a real application, this would fetch data based on the slug: <span className='font-mono text-white'>{params.slug}</span>.
                 </p>
                 <p className='text-muted-foreground leading-relaxed'>
                   Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                 </p>
              </div>
              
              <div className='bg-muted/20 p-6 rounded-xl border border-white/5'>
                 <h3 className='text-xl font-bold text-white mb-4'>Rules</h3>
                 <ul className='list-disc pl-5 space-y-2 text-gray-400'>
                    <li>Rule number one.</li>
                    <li>Rule number two.</li>
                    <li>Judges decision is final.</li>
                 </ul>
              </div>
           </div>
           
           <div className='space-y-6'>
              <div className='bg-muted/20 p-6 rounded-xl border border-white/5'>
                 <h4 className='font-bold text-white mb-4'>Event Info</h4>
                 <div className='space-y-4 text-sm'>
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
                 
                 <Link href='/register' className='block w-full text-center bg-primary text-white py-3 rounded-lg font-bold mt-6 hover:bg-red-700 transition-colors'>
                    Register Now
                 </Link>
              </div>
           </div>
        </div>
      </div>
    </PageSection>
  );
}
