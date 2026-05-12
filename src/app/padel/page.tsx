'use client';

import { useState, useEffect } from 'react';
import PadelActivityForm from '@/components/padel/PadelActivityForm';
import PadelActivityList from '@/components/padel/PadelActivityList';
import Pagination from '@/components/Pagination';
import { PadelActivity, CreatePadelActivity } from '@/types/padel';

const ITEMS_PER_PAGE = 3;

export default function PadelPage() {
  const [activities, setActivities] = useState<PadelActivity[]>([]);
  const [filter, setFilter] = useState<'all' | 'training' | 'tournament'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => { fetchActivities(); }, []);

  const fetchActivities = async () => {
    try {
      const res = await fetch('/api/padel');
      if (!res.ok) throw new Error('Erreur lors du chargement');
      setActivities(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (activity: CreatePadelActivity) => {
    try {
      const res = await fetch('/api/padel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activity),
      });
      if (!res.ok) throw new Error("Erreur lors de l'ajout");
      const newActivity = await res.json();
      setActivities(prev => [newActivity, ...prev]);
      setCurrentPage(1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/padel/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erreur lors de la suppression');
      setActivities(prev => prev.filter(a => a._id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  const filteredActivities = filter === 'all' ? activities : activities.filter(a => a.type === filter);
  const totalPages = Math.ceil(filteredActivities.length / ITEMS_PER_PAGE);
  const paginatedActivities = filteredActivities.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleFilterChange = (newFilter: typeof filter) => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="md:ml-[72px] min-h-screen bg-slate-50 flex items-center justify-center pb-[76px] md:pb-0">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
          <p className="text-sm text-gray-500">Chargement...</p>
        </div>
      </div>
    );
  }

  const filterTabs = [
    { value: 'all', label: 'Tout', count: activities.length },
    { value: 'training', label: 'Entraînements', count: activities.filter(a => a.type === 'training').length },
    { value: 'tournament', label: 'Tournois', count: activities.filter(a => a.type === 'tournament').length },
  ] as const;

  return (
    <div className="md:ml-[72px] min-h-screen bg-slate-50 pb-[76px] md:pb-0">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-10">

        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
              <ellipse cx="14" cy="9" rx="5.5" ry="7" transform="rotate(35 14 9)" />
              <path d="M11 13.5L5.5 19.5" />
              <path d="M11.5 6.5l5 5" />
              <path d="M9 9l5 5" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Padel</h1>
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
          <div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-5">Nouvelle activité</h2>
              <PadelActivityForm onSubmit={handleSubmit} />
            </div>
          </div>

          <div>
            {/* Filter tabs */}
            <div className="flex gap-1.5 mb-4 bg-gray-100 rounded-xl p-1">
              {filterTabs.map(tab => (
                <button
                  key={tab.value}
                  onClick={() => handleFilterChange(tab.value)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    filter === tab.value
                      ? 'bg-white text-amber-700 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                  <span className={`text-[10px] rounded-full px-1.5 py-0.5 font-semibold ${
                    filter === tab.value ? 'bg-amber-100 text-amber-600' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            <PadelActivityList activities={paginatedActivities} onDelete={handleDelete} />
            {totalPages > 1 && (
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} accentColor="amber" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
