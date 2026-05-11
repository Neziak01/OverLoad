'use client';

import Calendar from '@/components/Calendar';

export default function Home() {
  return (
    <main className="md:ml-[72px] min-h-screen bg-slate-50 pb-[76px] md:pb-0">
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center shadow-md shadow-teal-500/20">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Calendrier</h1>
            <p className="text-sm text-gray-500">Toutes vos activités en un coup d'œil</p>
          </div>
        </div>
        <Calendar onDateSelect={() => {}} />
      </div>
    </main>
  );
}
