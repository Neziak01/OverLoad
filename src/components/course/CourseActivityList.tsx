'use client';
import { CourseActivity } from '@/types/course';

interface Props {
  activities: CourseActivity[];
  onDelete: (id: string) => void;
}

export default function CourseActivityList({ activities, onDelete }: Props) {
  if (activities.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-violet-50 flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6 text-violet-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="13" cy="4.5" r="1.5" />
            <path d="M8.5 17.5l2-5 2.5 2 2-3.5M16 10.5l1.5 4M8.5 17.5l-1 3.5M14.5 19l-1-4.5M10.5 12.5L9 16h5" />
          </svg>
        </div>
        <p className="text-sm text-gray-500">Aucune sortie enregistrée</p>
        <p className="text-xs text-gray-400 mt-1">Ajoutez votre première course</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activities.map(activity => {
        const allure = parseFloat(activity.duree) > 0 && parseFloat(activity.distance) > 0
          ? (parseFloat(activity.duree) / parseFloat(activity.distance)).toFixed(2)
          : null;

        return (
          <div
            key={activity._id}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md hover:border-violet-100 transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <span className="text-xs font-semibold text-violet-600 bg-violet-50 rounded-full px-2.5 py-0.5">
                  Course
                </span>
                <p className="text-sm font-semibold text-gray-900 capitalize mt-1">
                  {new Date(activity.date).toLocaleDateString('fr-FR', {
                    weekday: 'long', day: 'numeric', month: 'long',
                  })}
                </p>
              </div>
              <button
                onClick={() => onDelete(activity._id)}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="bg-violet-50 rounded-xl p-2.5 text-center">
                <p className="text-base font-bold text-violet-700">{activity.distance}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">km</p>
              </div>
              <div className="bg-violet-50 rounded-xl p-2.5 text-center">
                <p className="text-base font-bold text-violet-700">{activity.duree}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">minutes</p>
              </div>
              {allure && (
                <div className="bg-violet-50 rounded-xl p-2.5 text-center">
                  <p className="text-base font-bold text-violet-700">{allure}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">min/km</p>
                </div>
              )}
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
