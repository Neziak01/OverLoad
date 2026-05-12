'use client';
import { useState } from 'react';
import { NatationActivity, Nage, TypeNage } from '@/types/natation';

interface Props {
  onSubmit: (activity: Omit<NatationActivity, '_id'>) => void;
}

const INPUT = 'block w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-colors';
const LABEL = 'block text-sm font-medium text-gray-700 mb-1.5';

const NAGE_LABELS: Record<TypeNage, string> = {
  crawl: 'Crawl',
  brasse: 'Brasse',
  dos: 'Dos crawlé',
  papillon: 'Papillon',
  '4nages': '4 Nages',
};

export default function NatationActivityForm({ onSubmit }: Props) {
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [nages, setNages] = useState<Nage[]>([]);
  const [currentNage, setCurrentNage] = useState<{ type: TypeNage; distance: string }>({
    type: 'crawl',
    distance: '',
  });

  const addNage = () => {
    if (!currentNage.distance || parseFloat(currentNage.distance) <= 0) return;
    setNages(prev => [...prev, {
      _id: Date.now().toString(),
      type: currentNage.type,
      distance: parseFloat(currentNage.distance),
    }]);
    setCurrentNage(prev => ({ ...prev, distance: '' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nages.length === 0) return;
    onSubmit({ date, nages, notes });
    setDate(''); setNotes(''); setNages([]);
    setCurrentNage({ type: 'crawl', distance: '' });
  };

  const totalDistance = nages.reduce((sum, n) => sum + n.distance, 0);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={LABEL}>Date</label>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} className={INPUT} required />
      </div>

      <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 space-y-3">
        <p className="text-sm font-semibold text-gray-800">Nages</p>

        <div className="flex gap-2">
          <div className="flex-1">
            <label className={LABEL}>Style</label>
            <select
              value={currentNage.type}
              onChange={e => setCurrentNage(prev => ({ ...prev, type: e.target.value as TypeNage }))}
              className={INPUT}
            >
              {Object.entries(NAGE_LABELS).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className={LABEL}>Distance (m)</label>
            <input
              type="number"
              value={currentNage.distance}
              onChange={e => setCurrentNage(prev => ({ ...prev, distance: e.target.value }))}
              placeholder="100"
              min="1"
              className={INPUT}
            />
          </div>
          <button
            type="button"
            onClick={addNage}
            className="h-[42px] px-3 mt-7 rounded-xl bg-sky-100 text-sky-700 text-sm font-semibold hover:bg-sky-200 transition-colors whitespace-nowrap"
          >
            + Ajouter
          </button>
        </div>

        {nages.length > 0 && (
          <div className="space-y-1.5">
            {nages.map(nage => (
              <div key={nage._id} className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sky-400" />
                  <span className="text-sm text-gray-700 capitalize">
                    {NAGE_LABELS[nage.type]} — <span className="font-semibold text-sky-600">{nage.distance} m</span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setNages(prev => prev.filter(n => n._id !== nage._id))}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
            <div className="flex items-center justify-between px-3 py-2 bg-sky-50 rounded-lg border border-sky-100">
              <span className="text-xs font-medium text-sky-600">Total</span>
              <span className="text-sm font-bold text-sky-700">{totalDistance} m</span>
            </div>
          </div>
        )}
      </div>

      <div>
        <label className={LABEL}>Notes (optionnel)</label>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          rows={3}
          placeholder="Commentaires sur votre séance..."
          className={INPUT + ' resize-none'}
        />
      </div>

      <button
        type="submit"
        disabled={nages.length === 0}
        className="w-full rounded-xl bg-sky-600 py-3 text-sm font-semibold text-white hover:bg-sky-700 active:scale-[0.98] transition-all shadow-sm shadow-sky-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Enregistrer la séance
      </button>
    </form>
  );
}
