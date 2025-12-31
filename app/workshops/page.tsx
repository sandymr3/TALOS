"use client";

import PageSection from '@/components/_core/layout/PageSection';
import Link from 'next/link';
import { FlipCard } from '@/components/ui/FlipCard';

export default function WorkshopsPage() {
  const workshops = [
    { 
      title: 'AI & Machine Learning', 
      instructor: 'Dr. Smith', 
      date: 'Feb 14', 
      duration: '3 Hours', 
      desc: 'Intro to Neural Networks.',
      category: 'AI',
      slug: 'ai-ml',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop'
    },
    { 
      title: 'Blockchain Development', 
      instructor: 'Prof. Doe', 
      date: 'Feb 15', 
      duration: '4 Hours', 
      desc: 'Building DApps with Solidity.',
      category: 'Web3',
      slug: 'blockchain',
      image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=800&auto=format&fit=crop'
    },
    { 
      title: 'Cloud Computing', 
      instructor: 'Jane R.', 
      date: 'Feb 16', 
      duration: '3 Hours', 
      desc: 'AWS Essentials.',
      category: 'Cloud',
      slug: 'cloud-computing',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop'
    },
  ];

  return (
    <PageSection title='Workshops' className='min-h-screen'>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workshops.map((workshop) => (
          <FlipCard
            key={workshop.slug}
            backContent={
              <div className="flex min-h-full flex-col gap-2">
                <h1 className="text-3xl font-bold text-red-600 zen-dots-regular">{workshop.title}</h1>
                <p className="mt-1 border-t border-t-gray-200/20 py-4 text-base leading-normal ibm-plex-mono-semibold text-gray-300">
                  {workshop.desc}
                </p>
                <div className="mt-auto flex flex-col gap-4">
                  <div className="flex justify-between items-center text-xs font-mono text-gray-400">
                    <span>{workshop.instructor}</span>
                    <span>{workshop.duration}</span>
                  </div>
                  <span className="w-fit text-xs font-mono text-red-500 bg-red-500/10 px-2 py-1 rounded">
                    {workshop.date}
                  </span>
                  <Link 
                    href={`/workshops/${workshop.slug}`} 
                    className="w-full text-center px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors zen-dots-regular text-xl"
                  >
                    Register Now
                  </Link>
                </div>
              </div>
            }
          >
            <div className="relative h-full w-full">
              <img
                src={workshop.image}
                alt={workshop.title}
                className="size-full rounded-2xl object-cover shadow-2xl shadow-black/40"
              />
              <div className="absolute inset-0 bg-black/30 rounded-2xl" />
              <div className="absolute bottom-4 left-4 text-3xl font-bold text-white drop-shadow-md zen-dots-regular">
                {workshop.title}
              </div>
              <div className="absolute top-4 right-4">
                 <span className="text-xs font-bold bg-black/50 backdrop-blur-md text-white px-2 py-1 rounded border border-white/10">
                    {workshop.category}
                 </span>
              </div>
            </div>
          </FlipCard>
        ))}
      </div>
    </PageSection>
  );
}
