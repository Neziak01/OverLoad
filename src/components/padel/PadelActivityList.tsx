'use client';
import { PadelActivity } from '@/types/padel';

interface Props {
  activities: PadelActivity[];
  onDelete?: (id: string) => void;
}

export default function PadelActivityList({ activities, onDelete }: Props) {
  if (activities.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
            <ellipse cx="14" cy="9" rx="5.5" ry="7" transform="rotate(35 14 9)" />
            <path d="M11 13.5L5.5 19.5M11.5 6.5l5 5M9 9l5 5" />
          </svg>
        </div>
        <p className="text-sm text-gray-500">Aucune activité enregistrée</p>
        <p className="text-xs text-gray-400 mt-1">Ajoutez votre première séance de padel</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activities.map(activity => (
        <div
          key={activity._id}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md hover:border-amber-100 transition-all duration-200"
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className={`text-xs font-semibold rounded-full px-2.5 py-0.5 ${
                  activity.type === 'training'
                    ? 'bg-amber-50 text-amber-700'
                    : 'bg-orange-50 text-orange-700'
                }`}>
                  {activity.type === 'training' ? 'Entraînement' : 'Tournoi'}
                </span>
                {activity.level && (
                  <span className="text-xs text-gray-400 font-medium">P{activity.level}</span>
                )}
              </div>
              <p className="text-sm font-semibold text-gray-900 capitalize">
                {new Date(activity.date).toLocaleDateString('fr-FR', {
                  weekday: 'long', day: 'numeric', month: 'long',
                })}
              </p>
            </div>
            {onDelete && (
              <button
                onClick={() => onDelete(activity._id)}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-1.5 bg-gray-50 rounded-lg px-2.5 py-1.5">
              <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              <span className="text-gray-600">{activity.location}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-gray-50 rounded-lg px-2.5 py-1.5">
              <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-gray-600">{activity.duration} min</span>
            </div>
            {activity.score && (
              <div className="flex items-center gap-1.5 bg-amber-50 rounded-lg px-2.5 py-1.5">
                <span className="font-semibold text-amber-700">{activity.score}</span>
              </div>
            )}
            {activity.result && (
              <div className="flex items-center gap-1.5 bg-orange-50 rounded-lg px-2.5 py-1.5">
                <span className="font-semibold text-orange-700">{activity.result}</span>
              </div>
            )}
            {activity.tournamentName && (
              <div className="flex items-center gap-1.5 bg-gray-50 rounded-lg px-2.5 py-1.5">
                <span className="text-gray-600">{activity.tournamentName}</span>
              </div>
            )}
          </div>

          {activity.notes && (
            <p className="mt-3 text-xs text-gray-500 border-t border-gray-100 pt-3 italic">
              {activity.notes}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
