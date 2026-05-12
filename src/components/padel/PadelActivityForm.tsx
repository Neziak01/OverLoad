'use client';
import { useState } from 'react';
import { PadelActivityType, CreatePadelActivity } from '@/types/padel';

interface Props {
  onSubmit: (activity: CreatePadelActivity) => void;
}

const INPUT = 'block w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-colors';
const LABEL = 'block text-sm font-medium text-gray-700 mb-1.5';

export default function PadelActivityForm({ onSubmit }: Props) {
  const [type, setType] = useState<PadelActivityType>('training');
  const [date, setDate] = useState('');
  const [duration, setDuration] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [tournamentLevel, setTournamentLevel] = useState('');
  const [result, setResult] = useState('');
  const [score, setScore] = useState('');
  const [level, setLevel] = useState('4');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const activity: CreatePadelActivity = {
      type,
      date: new Date(date),
      duration: parseInt(duration),
      location,
      notes,
      ...(type === 'tournament' && { tournamentLevel, result }),
      ...(type === 'training' && { score, level }),
    };
    onSubmit(activity);
    setDate(''); setDuration(''); setLocation(''); setNotes('');
    setTournamentLevel(''); setResult(''); setScore(''); setLevel('4');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Type toggle */}
      <div>
        <label className={LABEL}>Type d'activité</label>
        <div className="flex gap-1.5 bg-gray-100 rounded-xl p-1">
          {(['training', 'tournament'] as const).map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                type === t
                  ? 'bg-white text-amber-700 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t === 'training' ? 'Entraînement' : 'Tournoi'}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className={LABEL}>Date et heure</label>
        <input type="datetime-local" value={date} onChange={e => setDate(e.target.value)} className={INPUT} required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={LABEL}>Durée (min)</label>
          <input type="number" value={duration} onChange={e => setDuration(e.target.value)} min="0" placeholder="90" className={INPUT} required />
        </div>
        <div>
          <label className={LABEL}>Lieu</label>
          <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="Club XYZ" className={INPUT} required />
        </div>
      </div>

      {type === 'tournament' && (
        <>
          <div>
            <label className={LABEL}>Niveau du tournoi</label>
            <input type="text" value={tournamentLevel} onChange={e => setTournamentLevel(e.target.value)} placeholder="P100, P250..." className={INPUT} required />
          </div>
          <div>
            <label className={LABEL}>Résultat</label>
            <input type="text" value={result} onChange={e => setResult(e.target.value)} placeholder="1/4 de finale, Champion..." className={INPUT} />
          </div>
        </>
      )}

      {type === 'training' && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={LABEL}>Score</label>
            <input type="text" value={score} onChange={e => setScore(e.target.value)} placeholder="6-4, 6-3" className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>Niveau</label>
            <select value={level} onChange={e => setLevel(e.target.value)} className={INPUT}>
              {['4', '4/5', '5', '5/6', '6'].map(l => (
                <option key={l} value={l}>P{l}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div>
        <label className={LABEL}>Notes (optionnel)</label>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          rows={3}
          placeholder="Commentaires..."
          className={INPUT + ' resize-none'}
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-xl bg-amber-500 py-3 text-sm font-semibold text-white hover:bg-amber-600 active:scale-[0.98] transition-all shadow-sm shadow-amber-500/20"
      >
        Enregistrer l'activité
      </button>
    </form>
  );
}
