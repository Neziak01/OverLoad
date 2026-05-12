'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Sport, GenericActivity, CreateGenericActivity } from '@/types/sport';
import Pagination from '@/components/Pagination';

const ITEMS_PER_PAGE = 5;

export default function SportPage() {
  const { slug } = useParams<{ slug: string }>();
  const [sport, setSport] = useState<Sport | null>(null);
  const [activities, setActivities] = useState<GenericActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Form state
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [sportsRes, actRes] = await Promise.all([
          fetch('/api/sports'),
          fetch(`/api/generic-activities?sportSlug=${slug}`),
        ]);
        const sportsData: Sport[] = sportsRes.ok ? await sportsRes.json() : [];
        const found = sportsData.find(s => s.slug === slug) ?? null;
        setSport(found);
        const actData = actRes.ok ? await actRes.json() : [];
        setActivities(Array.isArray(actData) ? actData : []);
      } catch {
        setError('Erreur de chargement');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;
    setSubmitting(true);
    try {
      const payload: CreateGenericActivity = {
        sportSlug: slug,
        date,
        ...(duration ? { duration: Number(duration) } : {}),
        ...(notes ? { notes } : {}),
      };
      const res = await fetch('/api/generic-activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Erreur lors de l'ajout");
      const newActivity = await res.json();
      setActivities(prev => [newActivity, ...prev]);
      setDate(new Date().toISOString().split('T')[0]);
      setDuration('');
      setNotes('');
      setCurrentPage(1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/generic-activities/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erreur lors de la suppression');
      setActivities(prev => prev.filter(a => a._id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
    }
  };

  const totalPages = Math.ceil(activities.length / ITEMS_PER_PAGE);
  const paginated = activities.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  if (loading) {
    return (
      <div className="md:ml-[72px] min-h-screen bg-slate-50 flex items-center justify-center pb-[76px] md:pb-0">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#6366f1 transparent transparent transparent' }} />
          <p className="text-sm text-gray-500">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!sport) {
    return (
      <div className="md:ml-[72px] min-h-screen bg-slate-50 flex items-center justify-center pb-[76px] md:pb-0">
        <div className="text-center">
          <p className="text-4xl mb-3">🤔</p>
          <p className="text-gray-600 font-medium">Sport introuvable</p>
          <p className="text-sm text-gray-400 mt-1">Le sport « {slug} » n'existe pas.</p>
        </div>
      </div>
    );
  }

  const iconBg = `${sport.color}20`;

  return (
    <div className="md:ml-[72px] min-h-screen bg-slate-50 pb-[76px] md:pb-0">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-10">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" style={{ backgroundColor: iconBg }}>
            {sport.emoji}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{sport.name}</h1>
            <p className="text-sm text-gray-500">
              {activities.length} activité{activities.length !== 1 ? 's' : ''} enregistrée{activities.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-5">Nouvelle activité</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  required
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all"
                  style={{ '--tw-ring-color': `${sport.color}40` } as React.CSSProperties}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Durée (minutes) <span className="text-gray-400 font-normal">— optionnel</span></label>
                <input
                  type="number"
                  value={duration}
                  onChange={e => setDuration(e.target.value)}
                  min={1}
                  placeholder="ex : 60"
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Notes <span className="text-gray-400 font-normal">— optionnel</span></label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Commentaire, ressenti..."
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 transition-all resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50"
                style={{ backgroundColor: sport.color }}
              >
                {submitting ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </form>
          </div>

          {/* List */}
          <div>
            {activities.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
                <p className="text-4xl mb-3">{sport.emoji}</p>
                <p className="text-gray-500 text-sm">Aucune activité enregistrée</p>
                <p className="text-gray-400 text-xs mt-1">Ajoutez votre première séance !</p>
              </div>
            ) : (
              <div className="space-y-3">
                {paginated.map(activity => (
                  <div key={activity._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0" style={{ backgroundColor: iconBg }}>
                          {sport.emoji}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {new Date(activity.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                          </p>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            {activity.duration && (
                              <span className="text-xs text-gray-500 bg-gray-100 rounded-full px-2 py-0.5">
                                ⏱ {activity.duration} min
                              </span>
                            )}
                          </div>
                          {activity.notes && (
                            <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{activity.notes}</p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(activity._id)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors shrink-0"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
                {totalPages > 1 && (
                  <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} accentColor="teal" />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
