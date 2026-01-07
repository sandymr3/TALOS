import ParallaxScrollGallery from '@/components/ui/ParallaxScrollGallery';

export default function GalleryPage() {
  const trailImages = [
    "https://images.unsplash.com/photo-1526378722484-bd91ca387e72",
    "https://images.unsplash.com/photo-1518770660439-4636190af475",
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d",
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    "https://images.unsplash.com/photo-1531482615713-2afd69097998",
    "https://images.unsplash.com/photo-1581091870627-3a9c8c5c9b6b",
    "https://images.unsplash.com/photo-1510511459019-5dda7724fd87",
    "https://images.unsplash.com/photo-1559028012-481c04fa702d",
    "https://images.unsplash.com/photo-1544197150-b99a580bb7a8",
    "https://images.unsplash.com/photo-1621504450181-5d356f61d307"
  ];

  const staticImages = [
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4",
    "https://images.unsplash.com/photo-1511512578047-dfb367046420",
    "https://images.unsplash.com/photo-1523580494863-6f3031224c94",
    "https://images.unsplash.com/photo-1517048676732-d65bc937f952"
  ];

  return (
    <div className='min-h-screen pt-32 pb-12 bg-black relative z-10'>
      
      <div className="max-w-7xl mx-auto px-4 mb-12 text-center">
        <h1 className="text-3xl md:text-5xl text-white tracking-tighter uppercase bbh-bartle-regular">
          TALOS <span className="text-[#dc2626]">MEMORIES</span>
        </h1>
      </div>

      {/* Top Grid Section - Exact Half-Half Split */}
      <div className="w-full max-w-7xl mx-auto mb-12 px-4 grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
        
        {/* Left Half: Video Section */}
        <div className="relative bg-black border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(220,38,38,0.2)] group min-h-[400px]">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10 pointer-events-none" />
          
          <video 
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
            controls
            autoPlay
            muted
            loop
            playsInline
            poster="https://images.unsplash.com/photo-1535498730771-e735b998cd64?q=80&w=2568&auto=format&fit=crop"
          >
             <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" type="video/mp4" />
             Your browser does not support the video tag.
          </video>

          <div className="absolute bottom-6 left-6 z-20">
             <h3 className="text-2xl font-bold text-white mb-1"><span className="text-red-600">TALOS 2025</span> Highlights</h3>
             <p className="text-sm text-red-500 font-mono">REWIND THE LEGACY</p>
          </div>
        </div>

        {/* Right Half: 4 Static Pictures (2x2 Grid) */}
        <div className="grid grid-cols-2 gap-4 h-full">
          {staticImages.map((src, i) => (
            <div key={i} className="relative rounded-xl overflow-hidden border border-white/10 group bg-black">
              <div className="absolute inset-0 bg-red-900/10 group-hover:bg-transparent transition-colors duration-300 z-10 pointer-events-none" />
              <img 
                src={src} 
                alt={`Gallery Static ${i + 1}`} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
          ))}
        </div>

      </div>

      {/* Gallery Animation Section */}
      <div className="w-full mb-12">
        <div className="max-w-7xl mx-auto px-4 mb-10">
           <h2 className="text-2xl md:text-4xl font-black text-white tracking-tighter uppercase">
             Experience <span className="text-red-600">Talos</span>
           </h2>
           <div className="mt-3 h-1 w-16 bg-red-600 rounded-full" />
        </div>
        <ParallaxScrollGallery images={trailImages} />
      </div>
    </div>
  );
}