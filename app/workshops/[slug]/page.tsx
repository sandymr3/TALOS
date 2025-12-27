import PageSection from '@/components/_core/layout/PageSection';
import Link from 'next/link';

export default function WorkshopDetailPage({ params }: { params: { slug: string } }) {
  return (
    <PageSection title='Workshop Details' className='min-h-screen'>
      <div className='max-w-4xl mx-auto'>
        <div className='h-64 bg-gradient-to-br from-blue-900 to-black rounded-xl mb-8 flex items-end p-8 border border-white/10 relative overflow-hidden'>
          <div className='absolute inset-0 bg-red-900/20 mix-blend-overlay' />
          <h1 className='text-4xl md:text-6xl font-black text-white tracking-tighter relative z-10'>
             WORKSHOP NAME
          </h1>
        </div>
        
        <div className='grid md:grid-cols-3 gap-8'>
           <div className='md:col-span-2 space-y-8'>
              <div className='prose prose-invert max-w-none'>
                 <h3 className='text-xl font-bold text-primary mb-4'>Overview</h3>
                 <p className='text-muted-foreground leading-relaxed'>
                   This is a placeholder description for the workshop. Learn from industry experts and get hands-on experience. Slug: <span className='font-mono text-white'>{params.slug}</span>.
                 </p>
                 <h3 className='text-xl font-bold text-primary mb-4 mt-8'>Curriculum</h3>
                 <p className='text-muted-foreground leading-relaxed'>
                   We will cover the basics to advanced concepts. Bring your laptop and enthusiasm.
                 </p>
              </div>
           </div>
           
           <div className='space-y-6'>
              <div className='bg-muted/20 p-6 rounded-xl border border-white/5'>
                 <h4 className='font-bold text-white mb-4'>Details</h4>
                 <div className='space-y-4 text-sm'>
                    <div className='flex justify-between'>
                       <span className='text-gray-500'>Date</span>
                       <span className='text-white'>Feb 15, 2025</span>
                    </div>
                    <div className='flex justify-between'>
                       <span className='text-gray-500'>Duration</span>
                       <span className='text-white'>4 Hours</span>
                    </div>
                    <div className='flex justify-between'>
                       <span className='text-gray-500'>Instructor</span>
                       <span className='text-white'>Dr. Expert</span>
                    </div>
                 </div>
                 
                 <Link href='/register' className='block w-full text-center bg-white text-black py-3 rounded-lg font-bold mt-6 hover:bg-gray-200 transition-colors'>
                    Register for Workshop
                 </Link>
              </div>
           </div>
        </div>
      </div>
    </PageSection>
  );
}
