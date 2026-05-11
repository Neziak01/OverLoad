'use client';
import { useState, useEffect } from 'react';
import { MusculationActivity } from '@/types/musculation';
import { PadelActivity } from '@/types/padel';
import { CourseActivity } from '@/types/course';
import { NatationActivity } from '@/types/natation';

interface CalendarProps {
  onDateSelect: (date: Date) => void;
}

interface ActivityDetails {
  type: 'musculation' | 'padel' | 'course' | 'natation';
  activity: MusculationActivity | PadelActivity | CourseActivity | NatationActivity;
}

const MONTHS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

const SPORT_CONFIG = {
  musculation: { label: 'Muscu', bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  padel: { label: 'Padel', bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
  course: { label: 'Course', bg: 'bg-violet-100', text: 'text-violet-700', dot: 'bg-violet-500' },
  natation: { label: 'Natation', bg: 'bg-sky-100', text: 'text-sky-700', dot: 'bg-sky-500' },
};

export default function Calendar({ onDateSelect }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [musculationActivities, setMusculationActivities] = useState<MusculationActivity[]>([]);
  const [padelActivities, setPadelActivities] = useState<PadelActivity[]>([]);
  const [courseActivities, setCourseActivities] = useState<CourseActivity[]>([]);
  const [natationActivities, setNatationActivities] = useState<NatationActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<ActivityDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllActivities();
  }, []);

  const fetchAllActivities = async () => {
    try {
      const [musRes, padRes, courRes, natRes] = await Promise.all([
        fetch('/api/musculation'),
        fetch('/api/padel'),
        fetch('/api/course'),
        fetch('/api/natation'),
      ]);
      const [musData, padData, courData, natData] = await Promise.all([
        musRes.ok ? musRes.json() : [],
        padRes.ok ? padRes.json() : [],
        courRes.ok ? courRes.json() : [],
        natRes.ok ? natRes.json() : [],
      ]);
      setMusculationActivities(Array.isArray(musData) ? musData : []);
      setPadelActivities(Array.isArray(padData) ? padData : []);
      setCourseActivities(Array.isArray(courData) ? courData : []);
      setNatationActivities(Array.isArray(natData) ? natData : []);
    } catch (err) {
      console.error('Erreur chargement activités:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDateKey = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

  const handleDateClick = (day: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(newDate);
    onDateSelect(newDate);
  };

  const today = new Date();
  const isToday = (day: number) =>
    day === today.getDate() &&
    currentDate.getMonth() === today.getMonth() &&
    currentDate.getFullYear() === today.getFullYear();

  const isSelected = (day: number) =>
    selectedDate?.getDate() === day &&
    selectedDate?.getMonth() === currentDate.getMonth() &&
    selectedDate?.getFullYear() === currentDate.getFullYear();

  const renderActivityDetails = () => {
    if (!selectedActivity) return null;
    const { type, activity } = selectedActivity;
    const config = SPORT_CONFIG[type];

    const renderContent = () => {
      if (type === 'musculation') {
        const a = activity as MusculationActivity;
        return (
          <>
            <h3 className="text-base font-semibold text-gray-900 mb-3">Séance musculation</h3>
            <div className="space-y-2">
              {a.exercices.map((ex, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-3">
                  <p className="font-medium text-sm text-gray-800">{ex.nom}</p>
                  <div className="mt-1 space-y-0.5">
                    {ex.series.map((s, j) => (
                      <p key={j} className="text-xs text-gray-500">
                        Série {j + 1}: {s.repetitions} reps{s.poids ? ` — ${s.poids} kg` : ''}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {a.notes && <p className="mt-3 text-xs text-gray-500">{a.notes}</p>}
          </>
        );
      }
      if (type === 'padel') {
        const a = activity as PadelActivity;
        return (
          <>
            <h3 className="text-base font-semibold text-gray-900 mb-3">
              {a.type === 'training' ? 'Entraînement' : 'Tournoi'} Padel
            </h3>
            <div className="space-y-1.5 text-sm text-gray-600">
              <p><span className="font-medium text-gray-800">Lieu</span> — {a.location}</p>
              <p><span className="font-medium text-gray-800">Durée</span> — {a.duration} min</p>
              {a.level && <p><span className="font-medium text-gray-800">Niveau</span> — {a.level}</p>}
              {a.score && <p><span className="font-medium text-gray-800">Score</span> — {a.score}</p>}
              {a.result && <p><span className="font-medium text-gray-800">Résultat</span> — {a.result}</p>}
            </div>
            {a.notes && <p className="mt-3 text-xs text-gray-500">{a.notes}</p>}
          </>
        );
      }
      if (type === 'course') {
        const a = activity as CourseActivity;
        return (
          <>
            <h3 className="text-base font-semibold text-gray-900 mb-3">Course à pied</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-violet-50 rounded-xl p-3 text-center">
                <p className="text-xl font-bold text-violet-600">{a.distance}</p>
                <p className="text-xs text-gray-500 mt-0.5">kilomètres</p>
              </div>
              <div className="bg-violet-50 rounded-xl p-3 text-center">
                <p className="text-xl font-bold text-violet-600">{a.duree}</p>
                <p className="text-xs text-gray-500 mt-0.5">minutes</p>
              </div>
            </div>
            {a.notes && <p className="mt-3 text-xs text-gray-500">{a.notes}</p>}
          </>
        );
      }
      if (type === 'natation') {
        const a = activity as NatationActivity;
        return (
          <>
            <h3 className="text-base font-semibold text-gray-900 mb-3">Séance natation</h3>
            <div className="space-y-2">
              {a.nages.map((nage, i) => (
                <div key={i} className="flex items-center justify-between bg-sky-50 rounded-xl px-3 py-2">
                  <span className="text-sm font-medium text-gray-800 capitalize">{nage.type}</span>
                  <span className="text-sm text-sky-600 font-semibold">{nage.distance} m</span>
                </div>
              ))}
            </div>
            {a.notes && <p className="mt-3 text-xs text-gray-500">{a.notes}</p>}
          </>
        );
      }
    };

    return (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${config.bg} ${config.text}`}>
              {config.label}
            </span>
            <button
              onClick={() => setSelectedActivity(null)}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-5">{renderContent()}</div>
        </div>
      </div>
    );
  };

  const renderCalendarDays = () => {
    const days = [];
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const daysInMonth = lastDay.getDate();
    // Convert Sunday=0 to Monday=0 (European style)
    const startingDay = (firstDay.getDay() + 6) % 7;

    for (let i = 0; i < startingDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 md:h-28 rounded-xl" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateKey = formatDateKey(date);

      const dayMusculation = musculationActivities.filter(a => formatDateKey(new Date(a.date)) === dateKey);
      const dayPadel = padelActivities.filter(a => formatDateKey(new Date(a.date)) === dateKey);
      const dayCourse = courseActivities.filter(a => formatDateKey(new Date(a.date)) === dateKey);
      const dayNatation = natationActivities.filter(a => formatDateKey(new Date(a.date)) === dateKey);

      const todayStyle = isToday(day);
      const selectedStyle = isSelected(day);

      days.push(
        <div
          key={day}
          onClick={() => handleDateClick(day)}
          className={`h-24 md:h-28 rounded-xl p-2 cursor-pointer transition-all duration-150 border ${
            selectedStyle
              ? 'border-teal-400 bg-teal-50 ring-2 ring-teal-400/30'
              : todayStyle
              ? 'border-teal-200 bg-teal-50/60'
              : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm'
          }`}
        >
          <div className={`text-xs font-semibold mb-1.5 w-6 h-6 flex items-center justify-center rounded-full ${
            todayStyle ? 'bg-teal-500 text-white' : 'text-gray-600'
          }`}>
            {day}
          </div>
          <div className="space-y-0.5 overflow-hidden">
            {dayMusculation.map(a => (
              <button
                key={a._id}
                onClick={e => { e.stopPropagation(); setSelectedActivity({ type: 'musculation', activity: a }); }}
                className="w-full text-left bg-emerald-100 text-emerald-700 rounded px-1.5 py-0.5 text-[10px] font-medium truncate hover:bg-emerald-200 transition-colors block"
              >
                Muscu
              </button>
            ))}
            {dayPadel.map(a => (
              <button
                key={a._id}
                onClick={e => { e.stopPropagation(); setSelectedActivity({ type: 'padel', activity: a }); }}
                className="w-full text-left bg-amber-100 text-amber-700 rounded px-1.5 py-0.5 text-[10px] font-medium truncate hover:bg-amber-200 transition-colors block"
              >
                Padel
              </button>
            ))}
            {dayCourse.map(a => (
              <button
                key={a._id}
                onClick={e => { e.stopPropagation(); setSelectedActivity({ type: 'course', activity: a }); }}
                className="w-full text-left bg-violet-100 text-violet-700 rounded px-1.5 py-0.5 text-[10px] font-medium truncate hover:bg-violet-200 transition-colors block"
              >
                Course
              </button>
            ))}
            {dayNatation.map(a => (
              <button
                key={a._id}
                onClick={e => { e.stopPropagation(); setSelectedActivity({ type: 'natation', activity: a }); }}
                className="w-full text-left bg-sky-100 text-sky-700 rounded px-1.5 py-0.5 text-[10px] font-medium truncate hover:bg-sky-200 transition-colors block"
              >
                Natation
              </button>
            ))}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <button
          onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex items-center gap-3">
          <h2 className="text-base font-semibold text-gray-900">
            {MONTHS[currentDate.getMonth()]}
          </h2>
          <select
            value={currentDate.getFullYear()}
            onChange={e => setCurrentDate(new Date(parseInt(e.target.value), currentDate.getMonth()))}
            className="text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400"
          >
            {Array.from({ length: 10 }, (_, i) => currentDate.getFullYear() - 5 + i).map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 px-3 pt-3 pb-1">
        {DAYS.map(d => (
          <div key={d} className="text-center text-[11px] font-semibold text-gray-400 pb-2">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="px-3 pb-3">
        {loading ? (
          <div className="grid grid-cols-7 gap-1.5">
            {Array.from({ length: 35 }).map((_, i) => (
              <div key={i} className="h-24 md:h-28 rounded-xl bg-gray-50 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-1.5">
            {renderCalendarDays()}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="px-5 py-3 border-t border-gray-100 flex flex-wrap gap-3">
        {Object.entries(SPORT_CONFIG).map(([key, cfg]) => (
          <div key={key} className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${cfg.dot}`} />
            <span className="text-xs text-gray-500">{cfg.label}</span>
          </div>
        ))}
      </div>

      {selectedActivity && renderActivityDetails()}
    </div>
  );
}
