import PageSection from '@/components/_core/layout/PageSection';

export default function WorkshopsPage() {
  const workshops = [
    { title: 'AI & Machine Learning', instructor: 'Dr. Smith', date: 'Feb 14', duration: '3 Hours', desc: 'Intro to Neural Networks.' },
    { title: 'Blockchain Development', instructor: 'Prof. Doe', date: 'Feb 15', duration: '4 Hours', desc: 'Building DApps with Solidity.' },
    { title: 'Cloud Computing', instructor: 'Jane R.', date: 'Feb 16', duration: '3 Hours', desc: 'AWS Essentials.' },
  ];

  return (
    <PageSection title='Workshops' className='min-h-screen'>
      <div className='grid gap-6 max-w-4xl mx-auto'>
        {workshops.map((workshop, index) => (
          <div key={index} className='flex flex-col md:flex-row bg-muted/20 border border-white/5 rounded-xl overflow-hidden hover:border-primary/40 transition-all'>
             <div className='w-full md:w-48 bg-black/50 flex flex-col items-center justify-center p-6 border-r border-white/5'>
                <span className='text-3xl font-bold text-primary'>{workshop.date.split(' ')[1]}</span>
                <span className='text-sm text-muted-foreground uppercase'>{workshop.date.split(' ')[0]}</span>
             </div>
             <div className='p-6 flex-1'>
                <h3 className='text-2xl font-bold mb-2'>{workshop.title}</h3>
                <p className='text-muted-foreground mb-4'>{workshop.desc}</p>
                <div className='flex gap-4 text-sm text-gray-400 font-mono'>
                  <span>By {workshop.instructor}</span>
                  <span>•</span>
                  <span>{workshop.duration}</span>
                </div>
             </div>
             <div className='p-6 flex items-center justify-center bg-black/20'>
                <button className='px-6 py-2 bg-white/5 hover:bg-primary hover:text-white rounded-lg transition-colors font-medium border border-white/10'>
                  Register
                </button>
             </div>
          </div>
        ))}
      </div>
    </PageSection>
  );
}