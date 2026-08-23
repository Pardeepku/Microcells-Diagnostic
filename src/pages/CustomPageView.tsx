import React from 'react';
import { 
  ChevronRight, 
  Calendar, 
  Clock, 
  Share2, 
  MessageSquare, 
  Phone, 
  ShieldCheck, 
  ArrowLeft,
  FileText,
  Sparkles
} from 'lucide-react';
import { PageType } from '../types';
import { useData } from '../context/DataContext';

interface CustomPageViewProps {
  slug?: string;
  onNavigate: (page: PageType, param?: string) => void;
}

export const CustomPageView: React.FC<CustomPageViewProps> = ({ slug, onNavigate }) => {
  const { customPages, labInfo } = useData();

  // Find page by slug or fallback to first custom page
  const page = customPages.find(p => p.slug === slug) || customPages[0];

  if (!page) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center mb-4">
          <FileText className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Page Not Found</h2>
        <p className="text-sm text-slate-500 max-w-md mb-6">
          The requested custom page could not be located or may have been unpublished by the laboratory administrator.
        </p>
        <button
          onClick={() => onNavigate('home')}
          className="px-6 py-3 bg-teal-600 text-white rounded-2xl font-bold text-xs shadow-lg shadow-teal-900/15"
        >
          Return to Home
        </button>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: page.title,
        text: page.subtitle || page.title,
        url: window.location.href
      }).catch(() => {});
    }
  };

  // Convert raw markdown / text to structured paragraphs & headings
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) {
        return <div key={idx} className="h-3" />;
      }
      if (trimmed.startsWith('### ')) {
        return (
          <h3 key={idx} className="text-lg sm:text-xl font-bold text-slate-900 mt-6 mb-2 font-display">
            {trimmed.replace('### ', '')}
          </h3>
        );
      }
      if (trimmed.startsWith('## ')) {
        return (
          <h2 key={idx} className="text-xl sm:text-2xl font-bold text-slate-900 mt-8 mb-3 font-display border-b border-slate-100 pb-2">
            {trimmed.replace('## ', '')}
          </h2>
        );
      }
      if (trimmed.startsWith('# ')) {
        return (
          <h1 key={idx} className="text-2xl sm:text-3xl font-bold text-slate-900 mt-8 mb-4 font-display">
            {trimmed.replace('# ', '')}
          </h1>
        );
      }
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        return (
          <li key={idx} className="ml-5 list-disc text-sm text-slate-600 leading-relaxed my-1">
            {trimmed.substring(2)}
          </li>
        );
      }
      return (
        <p key={idx} className="text-sm sm:text-base text-slate-600 leading-relaxed my-2">
          {trimmed}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      
      {/* Breadcrumb Bar */}
      <div className="bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <button onClick={() => onNavigate('home')} className="hover:text-teal-600 transition-colors">
              Home
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-bold truncate max-w-[200px] sm:max-w-none">
              {page.title}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-slate-900 transition-all flex items-center gap-1.5 text-xs font-semibold"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Banner with Custom Image */}
      <div className="relative bg-slate-900 text-white overflow-hidden py-16 sm:py-24">
        {page.bannerImage && (
          <img
            src={page.bannerImage}
            alt={page.title}
            className="absolute inset-0 w-full h-full object-cover opacity-20 filter saturate-50"
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/80 to-transparent"></div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-500/20 text-teal-300 border border-teal-500/30 rounded-full text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{labInfo.tradeName} Information</span>
          </span>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white font-display">
            {page.title}
          </h1>

          {page.subtitle && (
            <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
              {page.subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="bg-white rounded-3xl p-6 sm:p-12 border border-slate-200/80 shadow-xl shadow-slate-200/50 space-y-6">
          <div className="prose prose-slate max-w-none">
            {renderFormattedContent(page.content)}
          </div>

          {/* Direct Support CTA Box */}
          <div className="mt-12 pt-8 border-t border-slate-100 bg-slate-50/80 -mx-6 sm:-mx-12 -mb-6 sm:-mb-12 p-6 sm:p-10 rounded-b-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <h4 className="text-base font-bold text-slate-900 font-display">
                Need further assistance regarding {page.title}?
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Our diagnostic support team and medical desk are available to assist you 7 days a week.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={`https://wa.me/${labInfo.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${labInfo.tradeName}, I have an inquiry regarding: ${page.title}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-emerald-900/10"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp Inquiry</span>
              </a>

              <button
                onClick={() => onNavigate('book-test')}
                className="px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition-all"
              >
                Book a Test
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
