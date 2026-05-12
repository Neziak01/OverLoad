'use client';
import { NatationActivity } from '@/types/natation';

interface Props {
  activities: NatationActivity[];
  onDelete?: (id: string) => void;
}

const NAGE_LABELS: Record<string, string> = {
  crawl: 'Crawl',
  brasse: 'Brasse',
  dos: 'Dos crawlé',
  papillon: 'Papillon',
  '4nages': '4 Nages',
};

export default function NatationActivityList({ activities, onDelete }: Props) {
  if (activities.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-sky-50 flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6 text-sky-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" strokeLinecap="round">
            <path d="M3 10c1.5 0 2.5 1.5 4.5 1.5S10 10 12 10s3 1.5 5 1.5 3-1.5 4.5-1.5" />
            <path d="M3 15c1.5 0 2.5 1.5 4.5 1.5S10 15 12 15s3 1.5 5 1.5 3-1.5 4.5-1.5" />
          </svg>
        </div>
        <p className="text-sm text-gray-500">Aucune séance enregistrée</p>
        <p className="text-xs text-gray-400 mt-1">Ajoutez votre première séance de natation</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activities.map(activity => {
        const totalDistance = activity.nages.reduce((sum, n) => sum + n.distance, 0);
        return (
          <div
            key={activity._id}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md hover:border-sky-100 transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-semibold text-sky-600 bg-sky-50 rounded-full px-2.5 py-0.5">Natation</span>
                  <span className="text-xs font-bold text-sky-500">{totalDistance} m</span>
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

            <div className="flex flex-wrap gap-1.5">
              {activity.nages.map((nage, i) => (
                <div key={i} className="flex items-center gap-1.5 bg-sky-50 border border-sky-100 rounded-lg px-2.5 py-1.5">
                  <span className="text-xs font-medium text-sky-700">{NAGE_LABELS[nage.type] || nage.type}</span>
                  <span className="text-xs text-sky-500 font-bold">{nage.distance} m</span>
                </div>
              ))}
            </div>

            {activity.notes && (
              <p className="mt-3 text-xs text-gray-500 border-t border-gray-100 pt-3 italic">
                {activity.notes}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
