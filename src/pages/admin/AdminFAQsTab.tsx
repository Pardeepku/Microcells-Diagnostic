import React, { useState } from 'react';
import { 
  HelpCircle, 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  X,
  Tag
} from 'lucide-react';
import { FAQItem } from '../../types';
import { useData } from '../../context/DataContext';

interface AdminFAQsTabProps {
  onShowToast: (msg: string) => void;
}

const FAQ_CATEGORIES: FAQItem['category'][] = [
  'General & Booking',
  'Fasting & Preparation',
  'Home Sample Collection',
  'Online Reports',
  'Quality & Safety'
];

export const AdminFAQsTab: React.FC<AdminFAQsTabProps> = ({ onShowToast }) => {
  const { faqs, addFAQ, updateFAQ, deleteFAQ } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);

  // Form State
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState<FAQItem['category']>('General & Booking');

  const filteredFaqs = faqs.filter(f => {
    const matchesSearch = 
      f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || f.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleOpenAdd = () => {
    setEditingFaqId(null);
    setQuestion('');
    setAnswer('');
    setCategory('General & Booking');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (f: FAQItem) => {
    setEditingFaqId(f.id);
    setQuestion(f.question);
    setAnswer(f.answer);
    setCategory(f.category);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, qText: string) => {
    if (window.confirm(`Are you sure you want to delete this FAQ question?\n"${qText}"`)) {
      deleteFAQ(id);
      onShowToast('FAQ question deleted');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) {
      alert('Please enter both question and answer.');
      return;
    }

    if (editingFaqId) {
      updateFAQ(editingFaqId, {
        question: question.trim(),
        answer: answer.trim(),
        category
      });
      onShowToast('Updated FAQ question');
    } else {
      addFAQ({
        question: question.trim(),
        answer: answer.trim(),
        category
      });
      onShowToast('Added new FAQ question');
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-purple-600" />
            <h2 className="text-xl font-bold text-slate-900 font-display">Patient FAQs Manager</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Answer frequent patient queries about fasting guidelines, home blood collection, report downloads, and lab accreditations.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-purple-900 hover:bg-purple-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4 text-purple-300" />
          <span>Add New FAQ</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search FAQs by question or answer keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {['All', ...FAQ_CATEGORIES].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-purple-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ Items List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700">
            Total FAQs: <strong className="text-purple-700">{filteredFaqs.length}</strong>
          </span>
          <span className="text-[11px] text-slate-400">Click row to preview answer</span>
        </div>

        {filteredFaqs.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700">No FAQs match your search</h3>
            <p className="text-xs text-slate-400">Click "Add New FAQ" to create one.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredFaqs.map((faq) => {
              const isExpanded = expandedFaqId === faq.id;
              return (
                <div key={faq.id} className="p-4 sm:p-6 hover:bg-slate-50/70 transition-all space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div 
                      onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                      className="flex-1 cursor-pointer space-y-1.5"
                    >
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-900 text-[10px] font-bold">
                          {faq.category}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <span>{faq.question}</span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        )}
                      </h4>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleOpenEdit(faq)}
                        className="p-2 text-purple-700 hover:bg-purple-50 rounded-xl transition-all"
                        title="Edit FAQ"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(faq.id, faq.question)}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                        title="Delete FAQ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 text-xs text-slate-700 leading-relaxed animate-in fade-in duration-150">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add / Edit FAQ Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8 space-y-6 animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-display">
                  {editingFaqId ? 'Edit FAQ Item' : 'Add New FAQ Item'}
                </h3>
                <p className="text-xs text-slate-500">Provide clear and concise medical answers for patients.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">FAQ Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as FAQItem['category'])}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
                >
                  {FAQ_CATEGORIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Question *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. How many hours of fasting are required for a Lipid Profile test?"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Detailed Answer *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide an informative and reassuring response for patients..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-purple-900 hover:bg-purple-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all"
                >
                  {editingFaqId ? 'Save Changes' : 'Create FAQ'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
