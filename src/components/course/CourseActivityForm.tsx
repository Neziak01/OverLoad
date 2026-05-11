'use client';
import { useState } from 'react';
import { CourseActivity } from '@/types/course';

interface Props {
  onSubmit: (activity: Omit<CourseActivity, '_id'>) => void;
}

const INPUT = 'block w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-colors';
const LABEL = 'block text-sm font-medium text-gray-700 mb-1.5';

export default function CourseActivityForm({ onSubmit }: Props) {
  const [formData, setFormData] = useState({ date: '', duree: '', distance: '', notes: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ date: '', duree: '', distance: '', notes: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={LABEL}>Date</label>
        <input type="date" name="date" value={formData.date} onChange={handleChange} className={INPUT} required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={LABEL}>Distance (km)</label>
          <input
            type="number"
            name="distance"
            value={formData.distance}
            onChange={handleChange}
            placeholder="5.2"
            step="0.1"
            min="0"
            className={INPUT}
            required
          />
        </div>
        <div>
          <label className={LABEL}>Durée (min)</label>
          <input
            type="number"
            name="duree"
            value={formData.duree}
            onChange={handleChange}
            placeholder="45"
            min="0"
            className={INPUT}
            required
          />
        </div>
      </div>

      {formData.distance && formData.duree && (
        <div className="bg-violet-50 border border-violet-100 rounded-xl px-4 py-3 flex items-center justify-between">
          <span className="text-xs text-violet-600 font-medium">Allure estimée</span>
          <span className="text-sm font-bold text-violet-700">
            {(parseFloat(formData.duree) / parseFloat(formData.distance)).toFixed(2)} min/km
          </span>
        </div>
      )}

      <div>
        <label className={LABEL}>Notes (optionnel)</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          placeholder="Commentaires sur votre sortie..."
          className={INPUT + ' resize-none'}
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white hover:bg-violet-700 active:scale-[0.98] transition-all shadow-sm shadow-violet-500/20"
      >
        Enregistrer la sortie
      </button>
    </form>
  );
}
