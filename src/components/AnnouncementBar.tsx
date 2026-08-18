import React from 'react';
import { Megaphone, ArrowRight, Sparkles, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { PageType } from '../types';
import { useData } from '../context/DataContext';

interface AnnouncementBarProps {
  onNavigate: (page: PageType, param?: string) => void;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ onNavigate }) => {
  const { announcement } = useData();

  if (!announcement.enabled || !announcement.message) {
    return null;
  }

  const getStyle = () => {
    switch (announcement.type) {
      case 'promotional':
        return 'bg-gradient-to-r from-teal-900 via-sky-900 to-blue-950 text-teal-100 border-b border-teal-700/40';
      case 'warning':
        return 'bg-gradient-to-r from-amber-900 via-amber-800 to-orange-950 text-amber-100 border-b border-amber-700/40';
      case 'success':
        return 'bg-gradient-to-r from-emerald-950 via-teal-900 to-emerald-900 text-emerald-100 border-b border-emerald-700/40';
      case 'info':
      default:
        return 'bg-gradient-to-r from-blue-950 via-slate-900 to-sky-950 text-sky-100 border-b border-sky-800/40';
    }
  };

  const getIcon = () => {
    switch (announcement.type) {
      case 'promotional': return <Sparkles className="w-3.5 h-3.5 text-teal-300 shrink-0" />;
      case 'warning': return <AlertCircle className="w-3.5 h-3.5 text-amber-300 shrink-0" />;
      case 'success': return <CheckCircle className="w-3.5 h-3.5 text-emerald-300 shrink-0" />;
      case 'info':
      default: return <Info className="w-3.5 h-3.5 text-sky-300 shrink-0" />;
    }
  };

  return (
    <div className={`py-2 px-4 text-xs font-medium transition-all ${getStyle()}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 sm:gap-3 text-center">
        {getIcon()}
        <span className="leading-tight">{announcement.message}</span>
        {announcement.linkText && (
          <button
            onClick={() => onNavigate((announcement.linkPage as PageType) || 'book-test')}
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/15 hover:bg-white/25 text-white font-bold text-[11px] transition-all ml-1"
          >
            <span>{announcement.linkText}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
};
