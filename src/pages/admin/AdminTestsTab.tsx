import React, { useState } from 'react';
import { 
  FlaskConical, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  Star, 
  Check, 
  X, 
  Tag, 
  Clock, 
  DollarSign, 
  Copy,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { TestItem, ServiceCategory, SampleType } from '../../types';
import { useData } from '../../context/DataContext';

interface AdminTestsTabProps {
  onShowToast: (msg: string) => void;
}

const CATEGORIES: ServiceCategory[] = [
  'Hematology',
  'Biochemistry',
  'Immunology & Serology',
  'Clinical Pathology',
  'Microbiology',
  'Histopathology & Cytology'
];

const SAMPLE_TYPES: SampleType[] = [
  'Blood',
  'Serum',
  'Plasma',
  'Urine',
  'Stool',
  'Swab',
  'Body Fluid',
  'Tissue / Biopsy'
];

const HEALTH_CONCERNS = [
  'General Wellness',
  'Diabetes',
  'Heart',
  'Liver',
  'Kidney',
  'Thyroid',
  'Vitamins',
  'Infection',
  'Fever'
] as const;

export const AdminTestsTab: React.FC<AdminTestsTabProps> = ({ onShowToast }) => {
  const { tests, addTest, updateTest, deleteTest, togglePopularTest } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestId, setEditingTestId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [category, setCategory] = useState<ServiceCategory>('Hematology');
  const [sampleType, setSampleType] = useState<SampleType>('Blood');
  const [fastingRequired, setFastingRequired] = useState(false);
  const [fastingHours, setFastingHours] = useState<number>(8);
  const [turnaroundTime, setTurnaroundTime] = useState('Same Day (6 Hours)');
  const [price, setPrice] = useState<number>(500);
  const [originalPrice, setOriginalPrice] = useState<number>(750);
  const [description, setDescription] = useState('');
  const [parametersInput, setParametersInput] = useState('');
  const [commonUses, setCommonUses] = useState('');
  const [preparationNotes, setPreparationNotes] = useState('');
  const [isPopular, setIsPopular] = useState(false);
  const [healthConcern, setHealthConcern] = useState<typeof HEALTH_CONCERNS[number]>('General Wellness');

  const filteredTests = tests.filter(t => {
    const matchesSearch = 
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleOpenAddModal = () => {
    setEditingTestId(null);
    setName('');
    setCode(`TST-${Math.floor(100 + Math.random() * 900)}`);
    setCategory('Hematology');
    setSampleType('Blood');
    setFastingRequired(false);
    setFastingHours(8);
    setTurnaroundTime('Same Day (6 Hours)');
    setPrice(450);
    setOriginalPrice(650);
    setDescription('');
    setParametersInput('');
    setCommonUses('');
    setPreparationNotes('Stay normally hydrated before sample collection.');
    setIsPopular(false);
    setHealthConcern('General Wellness');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (t: TestItem) => {
    setEditingTestId(t.id);
    setName(t.name);
    setCode(t.code);
    setCategory(t.category);
    setSampleType(t.sampleType);
    setFastingRequired(t.fastingRequired);
    setFastingHours(t.fastingHours || 8);
    setTurnaroundTime(t.turnaroundTime);
    setPrice(t.price);
    setOriginalPrice(t.originalPrice || Math.round(t.price * 1.3));
    setDescription(t.description);
    setParametersInput(t.parametersList.join(', '));
    setCommonUses(t.commonUses);
    setPreparationNotes(t.preparationNotes);
    setIsPopular(!!t.isPopular);
    setHealthConcern(t.healthConcern || 'General Wellness');
    setIsModalOpen(true);
  };

  const handleDuplicate = (t: TestItem) => {
    const cloneData = {
      name: `${t.name} (Copy)`,
      code: `${t.code}-CPY`,
      category: t.category,
      sampleType: t.sampleType,
      fastingRequired: t.fastingRequired,
      fastingHours: t.fastingHours,
      turnaroundTime: t.turnaroundTime,
      price: t.price,
      originalPrice: t.originalPrice,
      description: t.description,
      parametersCount: t.parametersCount,
      parametersList: [...t.parametersList],
      commonUses: t.commonUses,
      preparationNotes: t.preparationNotes,
      isPopular: false,
      healthConcern: t.healthConcern
    };
    addTest(cloneData);
    onShowToast(`Duplicated "${t.name}"`);
  };

  const handleDelete = (id: string, testName: string) => {
    if (window.confirm(`Are you sure you want to delete test "${testName}"?`)) {
      deleteTest(id);
      onShowToast(`Deleted "${testName}"`);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter a valid test name.');
      return;
    }

    const paramArray = parametersInput
      .split(',')
      .map(p => p.trim())
      .filter(p => p.length > 0);

    const testPayload = {
      name: name.trim(),
      code: code.trim() || 'TST-000',
      category,
      sampleType,
      fastingRequired,
      fastingHours: fastingRequired ? Number(fastingHours) : undefined,
      turnaroundTime: turnaroundTime.trim() || 'Same Day',
      price: Number(price) || 0,
      originalPrice: Number(originalPrice) || Number(price),
      description: description.trim() || 'Comprehensive laboratory investigation.',
      parametersCount: paramArray.length > 0 ? paramArray.length : 1,
      parametersList: paramArray.length > 0 ? paramArray : [name.trim()],
      commonUses: commonUses.trim() || 'General health evaluation and clinical screening.',
      preparationNotes: preparationNotes.trim() || 'Standard sample preparation guidelines apply.',
      isPopular,
      healthConcern
    };

    if (editingTestId) {
      updateTest(editingTestId, testPayload);
      onShowToast(`Updated test "${testPayload.name}"`);
    } else {
      addTest(testPayload);
      onShowToast(`Added new test "${testPayload.name}"`);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-teal-600" />
            <h2 className="text-xl font-bold text-slate-900 font-display">Pathology Tests Catalog Manager</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage your entire diagnostic test menu, pricing, parameters, fasting requirements, and turnaround times.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 bg-sky-900 hover:bg-sky-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4 text-teal-400" />
          <span>Add New Test</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search test name, code (e.g. HEM-101), category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {['All', ...CATEGORIES].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-sky-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tests Table / Cards */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700">
            Total Tests in Directory: <strong className="text-teal-700">{filteredTests.length}</strong>
          </span>
          <span className="text-[11px] text-slate-400">Click star to feature test on homepage</span>
        </div>

        {filteredTests.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <FlaskConical className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700">No tests match your filter</h3>
            <p className="text-xs text-slate-400">Try changing your search terms or add a new test.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredTests.map((t) => (
              <div 
                key={t.id}
                className="p-4 sm:p-6 hover:bg-slate-50/70 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Left info */}
                <div className="space-y-2 min-w-0 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => togglePopularTest(t.id)}
                      title={t.isPopular ? "Featured Popular Test" : "Mark as Popular"}
                      className={`p-1 rounded-lg transition-colors ${
                        t.isPopular ? 'text-amber-500 bg-amber-50' : 'text-slate-300 hover:text-slate-400'
                      }`}
                    >
                      <Star className="w-4 h-4 fill-current" />
                    </button>

                    <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      {t.code}
                    </span>

                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-sky-50 text-sky-900">
                      {t.category}
                    </span>

                    <span className="text-[11px] px-2 py-0.5 rounded-md bg-teal-50 text-teal-800">
                      🧪 {t.sampleType}
                    </span>

                    {t.fastingRequired && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900">
                        {t.fastingHours ? `${t.fastingHours}h Fasting` : 'Fasting Required'}
                      </span>
                    )}

                    {t.healthConcern && (
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                        Tag: {t.healthConcern}
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-slate-900">{t.name}</h4>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{t.description}</p>
                  </div>

                  {/* Parameter chips */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[11px] text-slate-400 font-medium">{t.parametersCount} Parameters:</span>
                    {t.parametersList.slice(0, 5).map((p, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                        {p}
                      </span>
                    ))}
                    {t.parametersList.length > 5 && (
                      <span className="text-[10px] text-teal-700 font-bold">
                        +{t.parametersList.length - 5} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Right pricing & actions */}
                <div className="flex items-center justify-between md:justify-end gap-6 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <div className="text-right">
                    <div className="flex items-baseline gap-1.5 justify-end">
                      <span className="text-base font-black text-slate-900">₹{t.price}</span>
                      {t.originalPrice && t.originalPrice > t.price && (
                        <span className="text-xs text-slate-400 line-through">₹{t.originalPrice}</span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 flex items-center gap-1 justify-end">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{t.turnaroundTime}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleDuplicate(t)}
                      title="Duplicate Test"
                      className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleOpenEditModal(t)}
                      title="Edit Test"
                      className="p-2 text-sky-700 hover:text-sky-900 hover:bg-sky-50 rounded-xl transition-all"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(t.id, t.name)}
                      title="Delete Test"
                      className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Test Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8 space-y-6 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-display">
                  {editingTestId ? 'Edit Pathology Test' : 'Add New Diagnostic Test'}
                </h3>
                <p className="text-xs text-slate-500">Configure parameters, sample requirements, and pricing.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-700">Test Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Complete Blood Count (CBC) with ESR"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Test Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. HEM-101"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ServiceCategory)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Sample Specimen *</label>
                  <select
                    value={sampleType}
                    onChange={(e) => setSampleType(e.target.value as SampleType)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  >
                    {SAMPLE_TYPES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Health Concern Tag</label>
                  <select
                    value={healthConcern}
                    onChange={(e) => setHealthConcern(e.target.value as typeof HEALTH_CONCERNS[number])}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  >
                    {HEALTH_CONCERNS.map(h => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Offer Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Original Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Turnaround Time *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Same Day (6 Hours)"
                    value={turnaroundTime}
                    onChange={(e) => setTurnaroundTime(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="fastingCheck"
                    checked={fastingRequired}
                    onChange={(e) => setFastingRequired(e.target.checked)}
                    className="w-4 h-4 text-teal-600 rounded-md focus:ring-teal-500"
                  />
                  <label htmlFor="fastingCheck" className="text-xs font-bold text-slate-700 cursor-pointer">
                    Overnight Fasting Mandatory
                  </label>
                </div>

                {fastingRequired && (
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-slate-600">Hours:</label>
                    <input
                      type="number"
                      min="4"
                      max="16"
                      value={fastingHours}
                      onChange={(e) => setFastingHours(Number(e.target.value))}
                      className="w-20 px-2 py-1 text-xs bg-white border border-slate-300 rounded-lg"
                    />
                  </div>
                )}

                <div className="flex items-center gap-3 sm:col-span-2">
                  <input
                    type="checkbox"
                    id="popularCheck"
                    checked={isPopular}
                    onChange={(e) => setIsPopular(e.target.checked)}
                    className="w-4 h-4 text-amber-600 rounded-md focus:ring-amber-500"
                  />
                  <label htmlFor="popularCheck" className="text-xs font-bold text-slate-700 cursor-pointer flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
                    <span>Feature as Popular Test on Home Screen</span>
                  </label>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Included Parameters (Comma separated list)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Hemoglobin (Hb), Total Leukocyte Count (TLC), Platelet Count, ESR"
                  value={parametersInput}
                  onChange={(e) => setParametersInput(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Description & Clinical Purpose</label>
                <textarea
                  rows={2}
                  placeholder="Brief clinical description of what this test measures..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Common Indications</label>
                  <input
                    type="text"
                    placeholder="e.g. Screening for anemia, infections"
                    value={commonUses}
                    onChange={(e) => setCommonUses(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Preparation & Patient Instructions</label>
                  <input
                    type="text"
                    placeholder="e.g. Morning sample preferred"
                    value={preparationNotes}
                    onChange={(e) => setPreparationNotes(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
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
                  className="px-6 py-2.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl shadow-xs transition-all"
                >
                  {editingTestId ? 'Save Changes' : 'Create Test'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
