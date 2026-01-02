import PageSection from '@/components/_core/layout/PageSection';
import Link from 'next/link';
import { CardBody, CardContainer, CardItem } from '@/components/ui/3d-card';

export default async function WorkshopDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <PageSection title='Workshop Details' className='min-h-screen'>
      <div className='max-w-4xl mx-auto'>
        <CardContainer className='w-full py-10'>
          <CardBody className='w-full h-auto'>
            <CardItem translateZ='100' className='w-full'>
              <div className='h-64 bg-gradient-to-r from-red-900 to-black rounded-xl flex items-end p-8 border border-white/10 shadow-2xl shadow-red-500/10'>
                <h1 className='text-4xl md:text-6xl font-black text-white tracking-tighter'>
                  WORKSHOP NAME
                </h1>
              </div>
            </CardItem>
          </CardBody>
        </CardContainer>
        
        <div className='grid md:grid-cols-3 gap-8'>
           <div className='md:col-span-2 space-y-8'>
              <div className='prose prose-invert max-w-none'>
                 <h3 className='text-3xl md:text-4xl font-bold font-zen-dots text-[#dc2626] mb-4'>Overview</h3>
                 <p className='text-muted-foreground leading-relaxed font-ibm-plex-mono text-lg font-bold'>
                   This is a placeholder description for the workshop. Learn from industry experts and get hands-on experience. Slug: <span className='font-mono text-white'>{slug}</span>.
                 </p>
                 <h3 className='text-3xl md:text-4xl font-bold font-zen-dots text-[#dc2626] mb-4 mt-8'>Curriculum</h3>
                 <p className='text-muted-foreground leading-relaxed font-ibm-plex-mono text-lg font-bold'>
                   We will cover the basics to advanced concepts. Bring your laptop and enthusiasm.
                 </p>
              </div>
           </div>
           
           <div className='space-y-6'>
              <div className='bg-muted/20 p-6 rounded-xl border border-white/5'>
                 <h4 className='text-xl font-bold font-zen-dots text-[#dc2626] mb-4'>Details</h4>
                 <div className='space-y-4 text-base font-bold font-ibm-plex-mono'>
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
                 
                 <Link href='/register' className='block w-full text-center bg-primary text-white py-3 rounded-lg font-bold text-sm mt-6 hover:bg-red-700 transition-all shadow-[0_0_15px_rgba(220,38,38,0.5)] hover:shadow-[0_0_25px_rgba(220,38,38,0.8)]'>
                    Register for Workshop
                 </Link>
              </div>
           </div>
        </div>
      </div>
    </PageSection>
  );
}
