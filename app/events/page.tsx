import PageSection from '@/components/_core/layout/PageSection';
import Link from 'next/link';

export default function EventsPage() {
  const events = [
    { title: 'Cyber Security Hunt', date: 'Feb 14, 10:00 AM', desc: 'Capture the flag and secure the network.', category: 'Technical' },
    { title: 'Code Marathon', date: 'Feb 14, 02:00 PM', desc: '24-hour non-stop coding challenge.', category: 'Coding' },
    { title: 'Robo Wars', date: 'Feb 15, 09:00 AM', desc: 'Battle of the bots. May the best bot win.', category: 'Robotics' },
    { title: 'Design Dash', date: 'Feb 15, 01:00 PM', desc: 'UI/UX challenge for creative minds.', category: 'Design' },
    { title: 'Tech Quiz', date: 'Feb 16, 11:00 AM', desc: 'Test your knowledge across various tech domains.', category: 'Quiz' },
    { title: 'Project Expo', date: 'Feb 16, 03:00 PM', desc: 'Showcase your innovative projects.', category: 'Expo' },
  ];

  return (
    <PageSection title='Events' className='min-h-screen'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {events.map((event, index) => (
          <div key={index} className='group relative bg-muted/30 border border-white/10 rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(220,38,38,0.2)]'>
            <div className='h-40 bg-gradient-to-br from-gray-900 to-black flex items-center justify-center relative overflow-hidden'>
               {/* Decorative background element */}
               <div className='absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-500/20 to-transparent transform scale-150 group-hover:scale-125 transition-transform duration-500' />
               <span className='text-4xl text-white/10 font-black uppercase tracking-widest'>{event.category}</span>
            </div>
            <div className='p-6'>
              <div className='flex justify-between items-start mb-4'>
                <span className='text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded'>{event.date}</span>
              </div>
              <h3 className='text-xl font-bold mb-2 group-hover:text-primary transition-colors'>{event.title}</h3>
              <p className='text-muted-foreground text-sm mb-6'>{event.desc}</p>
              <Link href={`/events/slug`} className='inline-flex items-center text-sm font-semibold text-white hover:text-primary transition-colors'>
                View Details <span className='ml-2'>&rarr;</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </PageSection>
  );
}