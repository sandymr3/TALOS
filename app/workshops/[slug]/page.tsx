'use client';

import PageSection from '@/components/_core/layout/PageSection';
import Link from 'next/link';
import { CardBody, CardContainer, CardItem } from '@/components/ui/3d-card';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Image from 'next/image';

interface WorkshopData {
  title: string;
  description: string;
  date: any;
  duration: string;
  instructor: string;
  location: string;
  image?: string;
  isPaid: boolean;
  fee: number;
}

export default function WorkshopDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [workshop, setWorkshop] = useState<WorkshopData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkshop = async () => {
      if (!slug || !db) return;
      try {
        const docRef = doc(db, 'events', slug);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setWorkshop(docSnap.data() as WorkshopData);
        } else {
          console.error("No such workshop!");
        }
      } catch (error) {
        console.error("Error fetching workshop:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkshop();
  }, [slug]);

  if (loading) {
    return (
      <PageSection title='Loading...' className='min-h-screen flex items-center justify-center'>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </PageSection>
    );
  }

  if (!workshop) {
    return (
      <PageSection title='Workshop Not Found' className='min-h-screen flex items-center justify-center'>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Workshop not found</h2>
          <Link href="/workshops" className="text-red-500 hover:text-red-400">Back to Workshops</Link>
        </div>
      </PageSection>
    );
  }

  const formattedDate = workshop.date?.toDate ? new Date(workshop.date.toDate()).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'
  }) : workshop.date;

  return (
    <PageSection title='Workshop Details' className='min-h-screen'>
      <div className='max-w-4xl mx-auto'>
        <CardContainer className='w-full py-10'>
          <CardBody className='w-full h-auto'>
            <CardItem translateZ='100' className='w-full'>
              <div className='relative h-64 w-full rounded-xl overflow-hidden border border-white/10 shadow-2xl shadow-red-500/10 group'>
                {workshop.image && (
                   <Image 
                     src={workshop.image} 
                     alt={workshop.title} 
                     fill 
                     className="object-cover transition-transform duration-500 group-hover:scale-105"
                   />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                <div className='absolute bottom-0 left-0 p-8'>
                  <h1 className='text-3xl md:text-5xl font-black text-white tracking-tighter mb-2'>
                    {workshop.title}
                  </h1>
                  <span className='inline-block px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full uppercase tracking-wider'>
                    Workshop
                  </span>
                </div>
              </div>
            </CardItem>
          </CardBody>
        </CardContainer>
        
        <div className='grid md:grid-cols-3 gap-8'>
           <div className='md:col-span-2 space-y-8'>
              <div className='prose prose-invert max-w-none'>
                 <h3 className='text-3xl md:text-4xl font-bold font-zen-dots text-[#dc2626] mb-4'>Overview</h3>
                 <p className='text-muted-foreground leading-relaxed font-ibm-plex-mono text-lg font-bold'>
                   {workshop.description}
                 </p>
              </div>
           </div>
           
           <div className='space-y-6'>
              <div className='bg-muted/20 p-6 rounded-xl border border-white/5 backdrop-blur-sm'>
                 <h4 className='text-xl font-bold font-zen-dots text-[#dc2626] mb-4'>Details</h4>
                 <div className='space-y-4 text-base font-bold font-ibm-plex-mono'>
                    <div className='flex justify-between items-center border-b border-white/5 pb-2'>
                       <span className='text-gray-500'>Date</span>
                       <span className='text-white text-right text-sm'>{formattedDate}</span>
                    </div>
                    <div className='flex justify-between items-center border-b border-white/5 pb-2'>
                       <span className='text-gray-500'>Duration</span>
                       <span className='text-white'>{workshop.duration}</span>
                    </div>
                    <div className='flex justify-between items-center border-b border-white/5 pb-2'>
                       <span className='text-gray-500'>Instructor</span>
                       <span className='text-white'>{workshop.instructor}</span>
                    </div>
                    <div className='flex justify-between items-center border-b border-white/5 pb-2'>
                       <span className='text-gray-500'>Location</span>
                       <span className='text-white'>{workshop.location}</span>
                    </div>
                    <div className='flex justify-between items-center pt-2'>
                       <span className='text-gray-500'>Fee</span>
                       <span className='text-red-400 text-xl'>₹{workshop.fee}</span>
                    </div>
                 </div>
                 
                 <Link href={`/register/${slug}`} className='block w-full text-center bg-red-600 text-white py-3 rounded-lg font-bold text-sm mt-6 hover:bg-red-700 transition-all shadow-[0_0_15px_rgba(220,38,38,0.5)] hover:shadow-[0_0_25px_rgba(220,38,38,0.8)]'>
                    Register for Workshop
                 </Link>
              </div>
           </div>
        </div>
      </div>
    </PageSection>
  );
}
