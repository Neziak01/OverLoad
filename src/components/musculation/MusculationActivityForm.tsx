'use client';
import { useState, useEffect } from 'react';
import { MusculationActivity, Exercice, Serie } from '@/types/musculation';

interface Props {
  onSubmit: (activity: Omit<MusculationActivity, '_id'>) => void;
}

const INPUT = 'block w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-colors';
const LABEL = 'block text-sm font-medium text-gray-700 mb-1.5';

export default function MusculationActivityForm({ onSubmit }: Props) {
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [exercices, setExercices] = useState<Exercice[]>([]);
  const [currentExercice, setCurrentExercice] = useState<Exercice>({ nom: '', series: [] });
  const [currentSerie, setCurrentSerie] = useState<Serie>({ repetitions: '', poids: '' });
  const [availableExercices, setAvailableExercices] = useState<string[]>([]);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customExercice, setCustomExercice] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { fetchExercices(); }, []);

  const fetchExercices = async () => {
    try {
      const res = await fetch('/api/exercices');
      if (res.ok) setAvailableExercices(await res.json());
    } catch {}
  };

  const addCustomExercice = async () => {
    if (!customExercice.trim()) return;
    try {
      const res = await fetch('/api/exercices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exercice: customExercice }),
      });
      if (res.ok) {
        const updated = await res.json();
        setAvailableExercices(updated);
        setCurrentExercice(prev => ({ ...prev, nom: customExercice }));
        setCustomExercice('');
        setShowCustomInput(false);
      }
    } catch {}
  };

  const deleteExercice = async (nom: string) => {
    try {
      const res = await fetch('/api/exercices', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exercice: nom }),
      });
      if (res.ok) setAvailableExercices(await res.json());
    } catch {}
  };

  const addSerie = () => {
    if (!currentSerie.repetitions) return;
    setCurrentExercice(prev => ({ ...prev, series: [...prev.series, currentSerie] }));
    setCurrentSerie({ repetitions: '', poids: '' });
  };

  const addExercice = () => {
    if (!currentExercice.nom) { setError('Sélectionnez un exercice'); return; }
    if (currentExercice.series.length === 0) { setError('Ajoutez au moins une série'); return; }
    setError(null);
    setExercices(prev => [...prev, currentExercice]);
    setCurrentExercice({ nom: '', series: [] });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (exercices.length === 0) { setError('Ajoutez au moins un exercice'); return; }
    onSubmit({ date, exercices, notes });
    setDate(''); setNotes(''); setExercices([]);
    setCurrentExercice({ nom: '', series: [] });
    setCurrentSerie({ repetitions: '', poids: '' });
    setError(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Date */}
      <div>
        <label className={LABEL}>Date</label>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} className={INPUT} required />
      </div>

      {/* Exercice selector */}
      <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 space-y-4">
        <p className="text-sm font-semibold text-gray-800">Exercices</p>

        {/* Select + actions */}
        <div className="flex gap-2">
          <div className="flex-1">
            <label className={LABEL}>Exercice</label>
            <select
              value={currentExercice.nom}
              onChange={e => setCurrentExercice(prev => ({ ...prev, nom: e.target.value }))}
              className={INPUT}
            >
              <option value="">Sélectionner...</option>
              {availableExercices.map(ex => (
                <option key={ex} value={ex}>{ex}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-1 items-end pb-0.5">
            {currentExercice.nom && (
              <button
                type="button"
                onClick={() => deleteExercice(currentExercice.nom)}
                className="w-9 h-[42px] flex items-center justify-center rounded-xl border border-gray-200 text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                title="Supprimer l'exercice"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowCustomInput(v => !v)}
              className="w-9 h-[42px] flex items-center justify-center rounded-xl border border-gray-200 text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
              title="Nouvel exercice"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </button>
          </div>
        </div>

        {showCustomInput && (
          <div className="flex gap-2">
            <input
              type="text"
              value={customExercice}
              onChange={e => setCustomExercice(e.target.value)}
              placeholder="Nom de l'exercice"
              className={INPUT + ' flex-1'}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCustomExercice())}
            />
            <button
              type="button"
              onClick={addCustomExercice}
              className="px-3 h-[42px] rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors whitespace-nowrap"
            >
              Ajouter
            </button>
          </div>
        )}

        {/* Series */}
        <div>
          <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Séries</p>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className={LABEL}>Répétitions</label>
              <input
                type="number"
                value={currentSerie.repetitions}
                onChange={e => setCurrentSerie(prev => ({ ...prev, repetitions: e.target.value }))}
                placeholder="12"
                className={INPUT}
              />
            </div>
            <div className="flex-1">
              <label className={LABEL}>Poids (kg)</label>
              <input
                type="number"
                value={currentSerie.poids}
                onChange={e => setCurrentSerie(prev => ({ ...prev, poids: e.target.value }))}
                placeholder="20"
                className={INPUT}
              />
            </div>
            <button
              type="button"
              onClick={addSerie}
              className="h-[42px] px-3 mt-7 rounded-xl bg-emerald-100 text-emerald-700 text-sm font-semibold hover:bg-emerald-200 transition-colors whitespace-nowrap"
            >
              + Série
            </button>
          </div>

          {currentExercice.series.length > 0 && (
            <div className="mt-3 space-y-1.5">
              {currentExercice.series.map((s, i) => (
                <div key={i} className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-gray-100">
                  <span className="text-sm text-gray-700">
                    Série {i + 1} — {s.repetitions} rép.{s.poids ? ` × ${s.poids} kg` : ''}
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentExercice(prev => ({ ...prev, series: prev.series.filter((_, j) => j !== i) }))}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={addExercice}
          className="w-full rounded-xl border-2 border-dashed border-emerald-200 py-2.5 text-sm font-medium text-emerald-600 hover:border-emerald-400 hover:bg-emerald-50 transition-colors"
        >
          Valider l'exercice
        </button>
      </div>

      {/* Added exercices */}
      {exercices.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Exercices ajoutés</p>
          {exercices.map((ex, i) => (
            <div key={i} className="flex items-start justify-between bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-gray-900">{ex.nom}</p>
                <p className="text-xs text-gray-500 mt-0.5">{ex.series.length} série{ex.series.length !== 1 ? 's' : ''}</p>
              </div>
              <button
                type="button"
                onClick={() => setExercices(prev => prev.filter((_, j) => j !== i))}
                className="text-gray-400 hover:text-red-500 transition-colors mt-0.5"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Notes */}
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

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">{error}</p>
      )}

      <button
        type="submit"
        className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white hover:bg-emerald-700 active:scale-[0.98] transition-all shadow-sm shadow-emerald-500/20"
      >
        Enregistrer la séance
      </button>
    </form>
  );
}
