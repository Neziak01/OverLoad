'use client';

import { useState, useEffect } from 'react';
import NatationActivityForm from '@/components/natation/NatationActivityForm';
import NatationActivityList from '@/components/natation/NatationActivityList';
import Pagination from '@/components/Pagination';
import { NatationActivity } from '@/types/natation';

const ITEMS_PER_PAGE = 5;

export default function NatationPage() {
  const [activities, setActivities] = useState<NatationActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => { fetchActivities(); }, []);

  const fetchActivities = async () => {
    try {
      const res = await fetch('/api/natation');
      if (!res.ok) throw new Error('Erreur lors du chargement');
      setActivities(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (activity: Omit<NatationActivity, '_id'>) => {
    try {
      const activityToSend = {
        ...activity,
        nages: activity.nages.map(({ _id, ...rest }) => rest),
      };
      const res = await fetch('/api/natation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activityToSend),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur lors de l'ajout");
      setActivities(prev => [data, ...prev]);
      setCurrentPage(1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/natation/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erreur lors de la suppression');
      setActivities(prev => prev.filter(a => a._id !== id));
      const newTotalPages = Math.ceil((activities.length - 1) / ITEMS_PER_PAGE);
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
          <div className="w-10 h-10 rounded-full border-2 border-sky-500 border-t-transparent animate-spin" />
          <p className="text-sm text-gray-500">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="md:ml-[72px] min-h-screen bg-slate-50 pb-[76px] md:pb-0">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-10">

        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-sky-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-sky-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" strokeLinecap="round">
              <path d="M3 10c1.5 0 2.5 1.5 4.5 1.5S10 10 12 10s3 1.5 5 1.5 3-1.5 4.5-1.5" />
              <path d="M3 15c1.5 0 2.5 1.5 4.5 1.5S10 15 12 15s3 1.5 5 1.5 3-1.5 4.5-1.5" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Natation</h1>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-5">Nouvelle séance</h2>
              <NatationActivityForm onSubmit={handleSubmit} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900">Historique</h2>
              {activities.length > 0 && (
                <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-2.5 py-1 font-medium">
                  {activities.length} séance{activities.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
            <NatationActivityList activities={paginatedActivities} onDelete={handleDelete} />
            {totalPages > 1 && (
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} accentColor="sky" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
