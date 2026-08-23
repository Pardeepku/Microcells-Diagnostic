import React, { useState } from 'react';
import { 
  HelpCircle, 
  Search, 
  ChevronDown, 
  MessageSquare, 
  Phone, 
  Sparkles, 
  ChevronRight,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { PageType } from '../types';
import { useData } from '../context/DataContext';

interface FAQViewProps {
  onNavigate: (page: PageType, param?: string) => void;
}

export const FAQView: React.FC<FAQViewProps> = ({ onNavigate }) => {
  const { faqs, labInfo } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);

  const categories = ['All', ...Array.from(new Set(faqs.map(f => f.category)))];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCat = selectedCategory === 'All' || faq.category === selectedCategory;
    const matchesQuery = !searchQuery || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const toggleFaq = (id: string) => {
    setExpandedFaqId(prev => prev === id ? null : id);
  };

  const whatsappClean = labInfo.whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <div className="min-h-screen bg-slate-50/60 pb-24">
      
      {/* Breadcrumb Bar */}
      <div className="bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <button onClick={() => onNavigate('home')} className="hover:text-teal-600 transition-colors">
              Home
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-bold">Frequently Asked Questions</span>
          </div>
        </div>
      </div>

      {/* Hero Header */}
      <section className="bg-slate-900 text-white py-14 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-radial from-teal-900/30 to-slate-950/80 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-500/20 text-teal-300 border border-teal-500/30 rounded-full text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Patient Diagnostic Guide & Guidelines</span>
          </span>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white font-display">
            Frequently Asked Questions
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Find immediate answers on fasting guidelines, test preparation, home sample pickup protocols, and online diagnostic report downloads.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 space-y-6">
        
        {/* Search & Category Filter Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xl shadow-slate-200/40 space-y-4">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by questions (e.g. fasting, sugar test, reports, timings)..."
              className="w-full text-sm pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-900/10'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* FAQs Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.map((faq) => {
            const isExpanded = expandedFaqId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <span className="p-1.5 bg-teal-50 text-teal-600 rounded-lg shrink-0 mt-0.5">
                      <HelpCircle className="w-4 h-4" />
                    </span>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                        {faq.question}
                      </h3>
                      <span className="text-[10px] font-semibold text-slate-400 mt-1 block">
                        Category: {faq.category}
                      </span>
                    </div>
                  </div>

                  <ChevronDown className={`w-5 h-5 text-slate-400 shrink-0 transition-transform ${isExpanded ? 'rotate-180 text-teal-600' : ''}`} />
                </button>

                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 border-t border-slate-100 bg-slate-50/40 text-xs sm:text-sm text-slate-600 leading-relaxed pl-12">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still Have Questions? Banner */}
        <div className="bg-linear-to-r from-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl">
          <div>
            <h4 className="text-base sm:text-lg font-bold font-display">
              Still have a specific test question?
            </h4>
            <p className="text-xs text-slate-300 mt-1 max-w-md">
              Our clinical pathologists and diagnostic desk are available to guide you on pre-test fasting, prescriptions, and report interpretation.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <a
              href={`https://wa.me/${whatsappClean}?text=Hello%20Microcells%20Diagnostics,%20I%20have%20a%20question%20about%20my%20test`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp Help</span>
            </a>

            <button
              onClick={() => onNavigate('contact')}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs transition-all"
            >
              Contact Lab
            </button>
          </div>
        </div>

      </section>

    </div>
  );
};
