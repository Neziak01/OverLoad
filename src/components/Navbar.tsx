'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const HomeIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75" />
  </svg>
);

const DumbbellIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" strokeLinecap="round">
    <path d="M7 12h10" />
    <path d="M5 9.5v5M19 9.5v5" />
    <path d="M3 10.5v3M21 10.5v3" />
  </svg>
);

const WavesIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" strokeLinecap="round">
    <path d="M3 10c1.5 0 2.5 1.5 4.5 1.5S10 10 12 10s3 1.5 5 1.5 3-1.5 4.5-1.5" />
    <path d="M3 15c1.5 0 2.5 1.5 4.5 1.5S10 15 12 15s3 1.5 5 1.5 3-1.5 4.5-1.5" />
  </svg>
);

const RunIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="13" cy="4.5" r="1.5" />
    <path d="M8.5 17.5l2-5 2.5 2 2-3.5" />
    <path d="M16 10.5l1.5 4" />
    <path d="M8.5 17.5l-1 3.5M14.5 19l-1-4.5" />
    <path d="M10.5 12.5L9 16h5" />
  </svg>
);

const RacketIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="14" cy="9" rx="5.5" ry="7" transform="rotate(35 14 9)" />
    <path d="M11 13.5L5.5 19.5" />
    <path d="M11.5 6.5l5 5" />
    <path d="M9 9l5 5" />
  </svg>
);

const navItems = [
  {
    href: '/',
    label: 'Accueil',
    icon: <HomeIcon />,
    activeColor: 'text-teal-400',
    activeBg: 'bg-teal-500/15',
  },
  {
    href: '/musculation',
    label: 'Muscu',
    icon: <DumbbellIcon />,
    activeColor: 'text-emerald-400',
    activeBg: 'bg-emerald-500/15',
  },
  {
    href: '/natation',
    label: 'Natation',
    icon: <WavesIcon />,
    activeColor: 'text-sky-400',
    activeBg: 'bg-sky-500/15',
  },
  {
    href: '/course',
    label: 'Course',
    icon: <RunIcon />,
    activeColor: 'text-violet-400',
    activeBg: 'bg-violet-500/15',
  },
  {
    href: '/padel',
    label: 'Padel',
    icon: <RacketIcon />,
    activeColor: 'text-amber-400',
    activeBg: 'bg-amber-500/15',
  },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <nav className="hidden md:flex fixed left-0 top-0 h-screen w-[72px] bg-gray-900 flex-col items-center py-5 z-50 border-r border-white/5">
        {/* Logo */}
        <div className="mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-500/30">
            <span className="text-white font-bold text-lg tracking-tight">O</span>
          </div>
        </div>

        {/* Nav items */}
        <div className="flex flex-col items-center gap-1 flex-1">
          {navItems.map(item => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 py-2.5 px-2 rounded-xl w-[54px] transition-all duration-150 ${
                  isActive
                    ? `${item.activeBg} ${item.activeColor}`
                    : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                }`}
              >
                <span className="flex items-center justify-center">{item.icon}</span>
                <span className="text-[9px] font-medium leading-none">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-white/5 flex z-50 h-[60px]">
        {navItems.map(item => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center gap-1 transition-all duration-150 ${
                isActive ? item.activeColor : 'text-gray-500'
              }`}
            >
              <span className="flex items-center justify-center">{item.icon}</span>
              <span className="text-[9px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
