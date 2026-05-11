'use client';

import { useState, useEffect } from 'react';
import MusculationActivityForm from '@/components/musculation/MusculationActivityForm';
import MusculationActivityList from '@/components/musculation/MusculationActivityList';
import Pagination from '@/components/Pagination';
import { MusculationActivity } from '@/types/musculation';

const ITEMS_PER_PAGE = 3;

export default function MusculationPage() {
  const [activities, setActivities] = useState<MusculationActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => { fetchActivities(); }, []);

  const fetchActivities = async () => {
    try {
      const res = await fetch('/api/musculation');
      if (!res.ok) throw new Error('Erreur lors du chargement');
      setActivities(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (activity: Omit<MusculationActivity, '_id'>) => {
    try {
      const res = await fetch('/api/musculation', {
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
      const res = await fetch(`/api/musculation/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erreur lors de la suppression');
      setActivities(prev => prev.filter(a => a._id !== id));
      const newTotal = activities.length - 1;
      const newTotalPages = Math.ceil(newTotal / ITEMS_PER_PAGE);
      if (currentPage > newTotalPages) setCurrentPage(Math.max(1, newTotalPages));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  const totalPages = Math.ceil(activities.length / ITEMS_PER_PAGE);
  const paginatedActivities = activities.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  if (loading) {
    return (
      <div className="md:ml-[72px] min-h-screen bg-slate-50 flex items-center justify-center pb-[76px] md:pb-0">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
          <p className="text-sm text-gray-500">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="md:ml-[72px] min-h-screen bg-slate-50 pb-[76px] md:pb-0">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-10">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" strokeLinecap="round">
              <path d="M7 12h10" />
              <path d="M5 9.5v5M19 9.5v5" />
              <path d="M3 10.5v3M21 10.5v3" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Musculation</h1>
            <p className="text-sm text-gray-500">
              {activities.length} séance{activities.length !== 1 ? 's' : ''} enregistrée{activities.length !== 1 ? 's' : ''}
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

        {/* Two column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form */}
          <div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-5">Nouvelle séance</h2>
              <MusculationActivityForm onSubmit={handleSubmit} />
            </div>
          </div>

          {/* List */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900">Historique</h2>
              {activities.length > 0 && (
                <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-2.5 py-1 font-medium">
                  {activities.length} séance{activities.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
            <MusculationActivityList activities={paginatedActivities} onDelete={handleDelete} />
            {totalPages > 1 && (
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} accentColor="emerald" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
