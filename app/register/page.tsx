'use client';
import PageSection from '@/components/_core/layout/PageSection';
import { useState } from 'react';

export default function RegisterPage() {
  const [eventType, setEventType] = useState<'solo' | 'team'>('solo');

  return (
    <PageSection title="Register" className="min-h-screen">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 p-6 bg-muted/20 shadow-lg rounded-xl border border-white/10 backdrop-blur-sm">
          <h3 className="text-xl font-bold mb-4 text-primary">Cyber Security Hunt</h3>
          <p className="mb-4 text-muted-foreground">Capture the flag and secure the network. Prove your skills in this intense security challenge.</p>
          
          <details className="mb-4 group">
            <summary className="cursor-pointer font-semibold text-white/80 hover:text-primary transition-colors select-none">Rules & Regulations</summary>
            <div className="mt-4 text-sm text-muted-foreground space-y-2 p-4 bg-black/20 rounded-lg">
              <ul className="list-disc pl-5 space-y-1">
                <li>Participants must bring their own laptops.</li>
                <li>Use of automated tools is strictly prohibited unless specified.</li>
                <li>Decision of the judges is final.</li>
              </ul>
            </div>
          </details>
        </div>

        <div className="bg-muted/20 shadow-lg rounded-xl p-8 border border-white/10 backdrop-blur-sm">
          <div className="flex gap-4 mb-8">
            <button 
              className={`flex-1 px-4 py-3 rounded-lg transition-all font-medium ${eventType === 'solo' ? 'bg-primary text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]' : 'bg-black/40 text-gray-400 hover:bg-black/60'}`}
              onClick={() => setEventType('solo')}
            >
              Solo Registration
            </button>
            <button 
              className={`flex-1 px-4 py-3 rounded-lg transition-all font-medium ${eventType === 'team' ? 'bg-primary text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]' : 'bg-black/40 text-gray-400 hover:bg-black/60'}`}
              onClick={() => setEventType('team')}
            >
              Team Registration
            </button>
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Full Name</label>
              <input type="text" className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white placeholder-gray-600 focus:outline-none focus:border-primary transition-colors" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Email</label>
              <input type="email" className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white placeholder-gray-600 focus:outline-none focus:border-primary transition-colors" placeholder="john@example.com" />
            </div>
            
            {eventType === 'team' && (
              <>
                <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                  <label className="block text-sm font-medium mb-2 text-gray-300">Team Name</label>
                  <input type="text" className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white placeholder-gray-600 focus:outline-none focus:border-primary transition-colors" placeholder="The Avengers" />
                </div>
                <div className="animate-in fade-in slide-in-from-top-4 duration-300 delay-75">
                   <label className="block text-sm font-medium mb-2 text-gray-300">Team Members</label>
                   <div className="p-4 bg-black/20 border border-white/5 rounded-lg text-sm text-gray-500 text-center border-dashed">
                     + Add Member
                   </div>
                </div>
              </>
            )}

            <button className="w-full bg-white text-black py-4 rounded-lg font-bold hover:bg-gray-200 transition-colors mt-8">
              Proceed to Payment
            </button>
          </form>
        </div>
      </div>
    </PageSection>
  );
}
