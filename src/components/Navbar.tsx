'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sport, COLOR_OPTIONS, EMOJI_OPTIONS } from '@/types/sport';

// ── Icônes fixes ──────────────────────────────────────────────────────────────

const HomeIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75" />
  </svg>
);
const DumbbellIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" strokeLinecap="round">
    <path d="M7 12h10" /><path d="M5 9.5v5M19 9.5v5" /><path d="M3 10.5v3M21 10.5v3" />
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
    <circle cx="13" cy="4.5" r="1.5" /><path d="M8.5 17.5l2-5 2.5 2 2-3.5" />
    <path d="M16 10.5l1.5 4" /><path d="M8.5 17.5l-1 3.5M14.5 19l-1-4.5" /><path d="M10.5 12.5L9 16h5" />
  </svg>
);
const RacketIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="14" cy="9" rx="5.5" ry="7" transform="rotate(35 14 9)" />
    <path d="M11 13.5L5.5 19.5" /><path d="M11.5 6.5l5 5" /><path d="M9 9l5 5" />
  </svg>
);
const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);
const CloseIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);
const TrashIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
  </svg>
);

// ── Nav items fixes ───────────────────────────────────────────────────────────

const FIXED_NAV = [
  { href: '/',            label: 'Accueil',  icon: <HomeIcon />,    activeColor: 'text-teal-400',    activeBg: 'bg-teal-500/15' },
  { href: '/musculation', label: 'Muscu',    icon: <DumbbellIcon />,activeColor: 'text-emerald-400', activeBg: 'bg-emerald-500/15' },
  { href: '/natation',    label: 'Natation', icon: <WavesIcon />,   activeColor: 'text-sky-400',     activeBg: 'bg-sky-500/15' },
  { href: '/course',      label: 'Course',   icon: <RunIcon />,     activeColor: 'text-violet-400',  activeBg: 'bg-violet-500/15' },
  { href: '/padel',       label: 'Padel',    icon: <RacketIcon />,  activeColor: 'text-amber-400',   activeBg: 'bg-amber-500/15' },
];

// ── Composant ─────────────────────────────────────────────────────────────────

export default function Navbar() {
  const pathname = usePathname();
  const [customSports, setCustomSports] = useState<Sport[]>([]);
  const [showModal, setShowModal] = useState(false);

  // Form
  const [formName, setFormName] = useState('');
  const [formColor, setFormColor] = useState(COLOR_OPTIONS[0].hex);
  const [formEmoji, setFormEmoji] = useState(EMOJI_OPTIONS[0]);
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetch('/api/sports')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setCustomSports(data); })
      .catch(() => {});
  }, []);

  const handleAddSport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) { setFormError('Le nom est requis'); return; }
    setFormLoading(true);
    setFormError('');
    try {
      const res = await fetch('/api/sports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formName.trim(), color: formColor, emoji: formEmoji }),
      });
      const data = await res.json();
      if (!res.ok) { setFormError(data.error ?? 'Erreur'); return; }
      setCustomSports(prev => [...prev, data]);
      setShowModal(false);
      setFormName('');
      setFormColor(COLOR_OPTIONS[0].hex);
      setFormEmoji(EMOJI_OPTIONS[0]);
    } catch {
      setFormError('Erreur réseau');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteSport = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm('Supprimer ce sport et toutes ses activités ?')) return;
    try {
      await fetch(`/api/sports/${id}`, { method: 'DELETE' });
      setCustomSports(prev => prev.filter(s => s._id !== id));
    } catch {}
  };

  // ── NavItem fixe ──────────────────────────────────────────────────────────

  const FixedItem = ({ item, mobile = false }: { item: typeof FIXED_NAV[0]; mobile?: boolean }) => {
    const isActive = pathname === item.href;
    if (mobile) return (
      <Link href={item.href} className={`flex-1 flex flex-col items-center justify-center gap-1 transition-all duration-150 ${isActive ? item.activeColor : 'text-gray-500'}`}>
        <span>{item.icon}</span>
        <span className="text-[9px] font-medium">{item.label}</span>
      </Link>
    );
    return (
      <Link href={item.href} className={`flex flex-col items-center gap-1 py-2.5 px-2 rounded-xl w-[54px] transition-all duration-150 ${isActive ? `${item.activeBg} ${item.activeColor}` : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}>
        <span>{item.icon}</span>
        <span className="text-[9px] font-medium leading-none">{item.label}</span>
      </Link>
    );
  };

  // ── NavItem custom (inline style pour la couleur dynamique) ───────────────

  const CustomItem = ({ sport, mobile = false }: { sport: Sport; mobile?: boolean }) => {
    const isActive = pathname === `/sports/${sport.slug}`;
    const activeStyle = isActive ? { color: sport.color, backgroundColor: `${sport.color}22` } : {};
    if (mobile) return (
      <Link href={`/sports/${sport.slug}`} className="flex-1 flex flex-col items-center justify-center gap-1 transition-all duration-150" style={isActive ? { color: sport.color } : { color: '#6b7280' }}>
        <span className="text-lg leading-none">{sport.emoji}</span>
        <span className="text-[9px] font-medium truncate max-w-[48px]">{sport.name}</span>
      </Link>
    );
    return (
      <div className="relative group w-[54px]">
        <Link href={`/sports/${sport.slug}`} className="flex flex-col items-center gap-1 py-2.5 px-2 rounded-xl w-full transition-all duration-150" style={isActive ? activeStyle : { color: '#6b7280' }}
          onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.05)'; (e.currentTarget as HTMLElement).style.color = '#d1d5db'; }}
          onMouseLeave={e => { if (!isActive) { (e.currentTarget as HTMLElement).style.backgroundColor = ''; (e.currentTarget as HTMLElement).style.color = '#6b7280'; } }}>
          <span className="text-lg leading-none">{sport.emoji}</span>
          <span className="text-[9px] font-medium leading-none truncate w-full text-center">{sport.name}</span>
        </Link>
        <button
          onClick={e => handleDeleteSport(sport._id, e)}
          className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gray-700 text-gray-400 hover:bg-red-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center z-10"
        >
          <TrashIcon />
        </button>
      </div>
    );
  };

  return (
    <>
      {/* ── Desktop sidebar ─────────────────────────────────────────────── */}
      <nav className="hidden md:flex fixed left-0 top-0 h-screen w-[72px] bg-gray-900 flex-col items-center py-5 z-50 border-r border-white/5">
        {/* Logo */}
        <div className="mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-500/30">
            <span className="text-white font-bold text-lg tracking-tight">O</span>
          </div>
        </div>

        {/* Fixed sports */}
        <div className="flex flex-col items-center gap-1">
          {FIXED_NAV.map(item => <FixedItem key={item.href} item={item} />)}
        </div>

        {/* Custom sports */}
        {customSports.length > 0 && (
          <>
            <div className="w-8 h-px bg-white/10 my-3" />
            <div className="flex flex-col items-center gap-1 overflow-y-auto max-h-[280px] w-full px-[9px] scrollbar-hide">
              {customSports.map(sport => <CustomItem key={sport._id} sport={sport} />)}
            </div>
          </>
        )}

        {/* Add sport button */}
        <div className="mt-auto pt-3">
          <button
            onClick={() => setShowModal(true)}
            className="flex flex-col items-center gap-1 py-2.5 px-2 rounded-xl w-[54px] text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-all duration-150"
          >
            <PlusIcon />
            <span className="text-[9px] font-medium leading-none">Ajouter</span>
          </button>
        </div>
      </nav>

      {/* ── Mobile bottom nav ───────────────────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-white/5 flex z-50 h-[60px] overflow-x-auto scrollbar-hide">
        {FIXED_NAV.map(item => <FixedItem key={item.href} item={item} mobile />)}
        {customSports.map(sport => <CustomItem key={sport._id} sport={sport} mobile />)}
        <button
          onClick={() => setShowModal(true)}
          className="flex-shrink-0 flex flex-col items-center justify-center gap-1 px-3 text-gray-500"
        >
          <PlusIcon />
          <span className="text-[9px] font-medium">Ajouter</span>
        </button>
      </nav>

      {/* ── Modal ajout sport ───────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">Ajouter un sport</h2>
              <button onClick={() => setShowModal(false)} className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                <CloseIcon />
              </button>
            </div>

            <form onSubmit={handleAddSport} className="p-5 space-y-5">
              {/* Nom */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nom du sport</label>
                <input
                  type="text"
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  placeholder="ex : Vélo, Ski, Basketball..."
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all"
                  autoFocus
                />
              </div>

              {/* Emoji */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Icône</label>
                <div className="grid grid-cols-8 gap-1.5">
                  {EMOJI_OPTIONS.map(emoji => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setFormEmoji(emoji)}
                      className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all ${formEmoji === emoji ? 'bg-gray-900 ring-2 ring-gray-700 ring-offset-1' : 'bg-gray-100 hover:bg-gray-200'}`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Couleur */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Couleur</label>
                <div className="flex flex-wrap gap-2">
                  {COLOR_OPTIONS.map(c => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setFormColor(c.hex)}
                      className={`w-8 h-8 rounded-full transition-all ${formColor === c.hex ? 'ring-2 ring-offset-2 scale-110' : 'hover:scale-105'}`}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ backgroundColor: `${formColor}20` }}>
                  {formEmoji}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{formName || 'Nom du sport'}</p>
                  <p className="text-xs" style={{ color: formColor }}>Sport personnalisé</p>
                </div>
              </div>

              {formError && (
                <p className="text-sm text-red-600 bg-red-50 rounded-xl px-3 py-2">{formError}</p>
              )}

              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50"
                  style={{ backgroundColor: formColor }}
                >
                  {formLoading ? '...' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
