'use client';
import PageSection from '@/components/_core/layout/PageSection';
import { useState } from 'react';

export default function RegisterPage() {
  const [teamMembers, setTeamMembers] = useState<{ name: string, email: string, phone: string }[]>([]);

  const addMember = () => {
    setTeamMembers([...teamMembers, { name: '', email: '', phone: '' }]);
  };

  const removeMember = (index: number) => {
    const newMembers = [...teamMembers];
    newMembers.splice(index, 1);
    setTeamMembers(newMembers);
  };

  const updateMember = (index: number, field: 'name' | 'email' | 'phone', value: string) => {
    const newMembers = [...teamMembers];
    newMembers[index][field] = value;
    setTeamMembers(newMembers);
  };

  return (
    <PageSection title="Register" className="min-h-screen">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 p-6 bg-muted/20 shadow-lg rounded-xl border border-white/10 backdrop-blur-sm">
          <h3 className="text-5xl mb-6 text-primary font-[family-name:var(--font-zen-dots)] font-bold tracking-wider">Cyber Security Hunt</h3>
          <p className="mb-4 text-lg text-muted-foreground ibm-plex-mono ibm-plex-mono-semibold">Capture the flag and secure the network. Prove your skills in this intense security challenge.</p>

          <details className="mb-4 group ibm-plex-mono ibm-plex-mono-semibold text-lg">
            <summary className="cursor-pointer ibm-plex-mono ibm-plex-mono-semibold text-white/80 hover:text-primary transition-colors select-none">Rules & Regulations</summary>
            <div className="mt-4 text-sm text-muted-foreground space-y-2 p-4 bg-black/20 rounded-lg">
              <ul className="list-disc pl-5 space-y-1 ibm-plex-mono">
                <li>Participants must bring their own laptops.</li>
                <li>Use of automated tools is strictly prohibited unless specified.</li>
                <li>Decision of the judges is final.</li>
              </ul>
            </div>
          </details>
        </div>

        <div className="bg-muted/20 shadow-lg rounded-xl p-8 border border-white/10 backdrop-blur-sm">
          <form className="space-y-6 font-[family-name:var(--font-ibm-plex-mono)]" onSubmit={(e) => e.preventDefault()}>

            {/* Leader Details - Name */}
            <div>
              <label className="block text-2xl font-medium mb-3 text-gray-300 font-[family-name:var(--font-zen-dots)]">Leader Name</label>
              <input type="text" className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-lg text-white placeholder-gray-600 ibm-plex-placeholder focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-colors font-semibold" placeholder="John Doe" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Department */}
              <div>
                <label className="block text-2xl font-medium mb-3 text-gray-300 font-[family-name:var(--font-zen-dots)]">Department</label>
                <input type="text" className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-lg text-white placeholder-gray-600 ibm-plex-placeholder focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-colors font-semibold" placeholder="CSE / IT" />
              </div>
              {/* Year */}
              <div>
                <label className="block text-2xl font-medium mb-3 text-gray-300 font-[family-name:var(--font-zen-dots)]">Year</label>
                <input type="text" className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-lg text-white placeholder-gray-600 ibm-plex-placeholder focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-colors font-semibold" placeholder="2nd Year" />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-2xl font-medium mb-3 text-gray-300 font-[family-name:var(--font-zen-dots)]">Email Address</label>
              <input type="email" className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-lg text-white placeholder-gray-600 ibm-plex-placeholder focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-colors font-semibold" placeholder="john@example.com" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Mobile Number */}
              <div>
                <label className="block text-2xl font-medium mb-3 text-gray-300 font-[family-name:var(--font-zen-dots)]">Mobile Number</label>
                <input type="tel" className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-lg text-white placeholder-gray-600 ibm-plex-placeholder focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-colors font-semibold" placeholder="+91 9876543210" />
              </div>
              {/* College / Institution */}
              <div>
                <label className="block text-2xl font-medium mb-3 text-gray-300 font-[family-name:var(--font-zen-dots)]">College / Institution</label>
                <input type="text" className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-lg text-white placeholder-gray-600 ibm-plex-placeholder focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-colors font-semibold" placeholder="SIT" />
              </div>
            </div>

            {/* Referral ID */}
            <div>
              <label className="block text-2xl font-medium mb-3 text-gray-300 font-[family-name:var(--font-zen-dots)]">Referral ID (Optional)</label>
              <input type="text" className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-lg text-white placeholder-gray-600 ibm-plex-placeholder focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-colors font-semibold" placeholder="REF123" />
            </div>

            {/* Team Name */}
            <div>
              <label className="block text-2xl font-medium mb-3 text-gray-300 font-[family-name:var(--font-zen-dots)]">Team Name</label>
              <input type="text" className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-lg text-white placeholder-gray-600 ibm-plex-placeholder focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-colors font-semibold" placeholder="The Avengers" />
            </div>

            {/* Team Members */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              <label className="block text-2xl font-medium text-gray-300 font-[family-name:var(--font-zen-dots)] mb-4">Team Members</label>

              <div className="space-y-4">
                {teamMembers.map((member, index) => (
                  <div key={index} className="flex flex-col gap-3 p-4 bg-white/5 rounded-xl border border-white/5 animate-in fade-in slide-in-from-top-2 relative group">
                    <button
                      type="button"
                      onClick={() => removeMember(index)}
                      className="absolute top-2 right-2 p-2 text-red-500 hover:text-red-400 hover:bg-white/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      title="Remove Member"
                    >
                      ✕
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={member.name}
                        onChange={(e) => updateMember(index, 'name', e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-lg text-white placeholder-gray-600 ibm-plex-placeholder focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-colors font-semibold"
                        placeholder="Member Name"
                      />
                      <input
                        type="tel"
                        value={member.phone}
                        onChange={(e) => updateMember(index, 'phone', e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-lg text-white placeholder-gray-600 ibm-plex-placeholder focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-colors font-semibold"
                        placeholder="Phone Number"
                      />
                    </div>
                    <input
                      type="email"
                      value={member.email}
                      onChange={(e) => updateMember(index, 'email', e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-lg text-white placeholder-gray-600 ibm-plex-placeholder focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-colors font-semibold"
                      placeholder="Member Email"
                    />
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addMember}
                className="w-full py-3 border-2 border-dashed border-white/10 rounded-lg text-lg text-gray-400 hover:border-primary/50 hover:text-primary transition-all flex items-center justify-center gap-2 group"
              >
                <span className="group-hover:scale-110 transition-transform">+</span> Add Team Member
              </button>
            </div>

            <button className="w-full bg-white text-black py-4 rounded-lg font-bold text-xl hover:bg-gray-200 transition-colors mt-8">
              Proceed to Payment
            </button>
          </form>
        </div>
      </div>
    </PageSection>
  );
}
