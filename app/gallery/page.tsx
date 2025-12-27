import PageSection from '@/components/_core/layout/PageSection';

export default function GalleryPage() {
  const photos = Array.from({ length: 9 });

  return (
    <PageSection title='Gallery' className='min-h-screen'>
      <div className='columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4'>
        {photos.map((_, index) => (
          <div key={index} className='break-inside-avoid relative group rounded-xl overflow-hidden bg-muted/20 border border-white/5'>
            {/* Placeholder Image */}
            <div className={`w-full ${index % 2 === 0 ? 'aspect-video' : 'aspect-square'} bg-gradient-to-t from-black to-gray-900 flex items-center justify-center`}>
               <div className='text-muted-foreground/20 group-hover:text-primary/50 transition-colors'>
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                 </svg>
               </div>
            </div>
            
            {/* Overlay */}
            <div className='absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4'>
               <p className='text-white font-medium transform translate-y-2 group-hover:translate-y-0 transition-transform'>Event Snapshot {index + 1}</p>
            </div>
          </div>
        ))}
      </div>
    </PageSection>
  );
}