'use client';

type AccentColor = 'emerald' | 'sky' | 'violet' | 'amber' | 'teal';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  accentColor?: AccentColor;
}

const ACCENT_CLASSES: Record<AccentColor, string> = {
  emerald: 'bg-emerald-600 text-white border-emerald-600',
  sky: 'bg-sky-600 text-white border-sky-600',
  violet: 'bg-violet-600 text-white border-violet-600',
  amber: 'bg-amber-500 text-white border-amber-500',
  teal: 'bg-teal-600 text-white border-teal-600',
};

export default function Pagination({ currentPage, totalPages, onPageChange, accentColor = 'teal' }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const activeClass = ACCENT_CLASSES[accentColor];

  return (
    <div className="flex justify-center items-center gap-1.5 mt-5">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {pages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-8 h-8 flex items-center justify-center rounded-lg border text-sm font-medium transition-colors ${
            currentPage === page
              ? activeClass
              : 'border-gray-200 text-gray-600 bg-white hover:bg-gray-50'
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
