import React, { useState } from 'react';
import { 
  Package, 
  Plus, 
  Edit3, 
  Trash2, 
  Star, 
  Check, 
  X, 
  Clock, 
  ShieldCheck, 
  Sparkles,
  Layers,
  Percent
} from 'lucide-react';
import { HealthPackage, SampleType } from '../../types';
import { useData } from '../../context/DataContext';

interface AdminPackagesTabProps {
  onShowToast: (msg: string) => void;
}

export const AdminPackagesTab: React.FC<AdminPackagesTabProps> = ({ onShowToast }) => {
  const { packages, tests, addPackage, updatePackage, deletePackage, togglePopularPackage } = useData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPkgId, setEditingPkgId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [price, setPrice] = useState<number>(1499);
  const [originalPrice, setOriginalPrice] = useState<number>(2999);
  const [parametersCount, setParametersCount] = useState<number>(55);
  const [testsIncludedInput, setTestsIncludedInput] = useState('');
  const [idealFor, setIdealFor] = useState('Adults 25-50 years, annual preventive checkup');
  const [fastingInfo, setFastingInfo] = useState('10 to 12 hours overnight fasting mandatory');
  const [turnaroundTime, setTurnaroundTime] = useState('Same Day (8-12 Hours)');
  const [featuresInput, setFeaturesInput] = useState('Free Home Sample Collection, Doctor Consultation Assistance, Digital Smart PDF Report');
  const [isPopular, setIsPopular] = useState(false);

  const handleOpenAdd = () => {
    setEditingPkgId(null);
    setName('');
    setTagline('Comprehensive full body health screening package');
    setPrice(1499);
    setOriginalPrice(2999);
    setParametersCount(55);
    setTestsIncludedInput('CBC with ESR (24 params), Lipid Profile (8 params), Liver Function Test (11 params), Kidney Function Test (9 params), Fasting Blood Sugar (1 param)');
    setIdealFor('Adults of all age groups seeking comprehensive annual checkups');
    setFastingInfo('10 to 12 hours overnight fasting required');
    setTurnaroundTime('Same Day (8-12 Hours)');
    setFeaturesInput('Free Home Sample Collection, NABL Reference Standards, Smart QR Verified Report');
    setIsPopular(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (pkg: HealthPackage) => {
    setEditingPkgId(pkg.id);
    setName(pkg.name);
    setTagline(pkg.tagline);
    setPrice(pkg.price);
    setOriginalPrice(pkg.originalPrice);
    setParametersCount(pkg.parametersCount);
    setTestsIncludedInput(pkg.testsIncluded.join(', '));
    setIdealFor(pkg.idealFor);
    setFastingInfo(pkg.fastingInfo);
    setTurnaroundTime(pkg.turnaroundTime);
    setFeaturesInput(pkg.features.join(', '));
    setIsPopular(!!pkg.isPopular);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, pkgName: string) => {
    if (window.confirm(`Are you sure you want to delete health package "${pkgName}"?`)) {
      deletePackage(id);
      onShowToast(`Deleted package "${pkgName}"`);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter a valid package title.');
      return;
    }

    const testList = testsIncludedInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const featureList = featuresInput
      .split(',')
      .map(f => f.trim())
      .filter(f => f.length > 0);

    const discountPercentage = Math.max(
      0,
      Math.round(((originalPrice - price) / originalPrice) * 100)
    );

    const pkgPayload = {
      name: name.trim(),
      tagline: tagline.trim() || 'Comprehensive preventive health checkup package',
      price: Number(price) || 0,
      originalPrice: Number(originalPrice) || Number(price),
      discountPercentage,
      parametersCount: Number(parametersCount) || testList.length * 5,
      testsIncluded: testList.length > 0 ? testList : ['Complete Blood Count', 'Lipid Profile', 'Liver Function', 'Kidney Function'],
      categoryBreakdown: [
        { category: 'Hematology', count: 24, tests: ['CBC with ESR'] },
        { category: 'Biochemistry', count: 28, tests: ['Lipid Profile', 'LFT', 'KFT', 'Sugar'] }
      ],
      idealFor: idealFor.trim() || 'All adults seeking preventive wellness screening',
      fastingInfo: fastingInfo.trim() || 'Overnight fasting recommended',
      isPopular,
      sampleTypes: ['Blood', 'Urine'] as SampleType[],
      turnaroundTime: turnaroundTime.trim() || 'Same Day (8-12 Hours)',
      features: featureList.length > 0 ? featureList : ['Free Home Sample Pickup', 'Digital Report via WhatsApp', 'Certified Pathologists']
    };

    if (editingPkgId) {
      updatePackage(editingPkgId, pkgPayload);
      onShowToast(`Updated package "${pkgPayload.name}"`);
    } else {
      addPackage(pkgPayload);
      onShowToast(`Added new package "${pkgPayload.name}"`);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-teal-600" />
            <h2 className="text-xl font-bold text-slate-900 font-display">Health Packages Manager</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Build bundled wellness checkup packages, set discounts, specify included tests, and manage ideal patient criteria.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Package</span>
        </button>
      </div>

      {/* Grid of Packages */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div 
            key={pkg.id}
            className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-5 relative"
          >
            {pkg.isPopular && (
              <div className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-900 rounded-full text-[10px] font-bold">
                <Star className="w-3 h-3 fill-current text-amber-500" />
                <span>Featured</span>
              </div>
            )}

            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-teal-700 font-bold">
                  <Layers className="w-3.5 h-3.5" />
                  <span>{pkg.parametersCount} Parameters Included</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 font-display">{pkg.name}</h3>
                <p className="text-xs text-slate-500 line-clamp-2">{pkg.tagline}</p>
              </div>

              {/* Pricing banner */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-baseline justify-between">
                <div>
                  <span className="text-lg font-black text-slate-900">₹{pkg.price}</span>
                  {pkg.originalPrice > pkg.price && (
                    <span className="text-xs text-slate-400 line-through ml-2">₹{pkg.originalPrice}</span>
                  )}
                </div>
                {pkg.discountPercentage > 0 && (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    {pkg.discountPercentage}% OFF
                  </span>
                )}
              </div>

              {/* Tests Included Preview */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-600">Tests Included:</span>
                <div className="flex flex-wrap gap-1">
                  {pkg.testsIncluded.slice(0, 4).map((t, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      {t}
                    </span>
                  ))}
                  {pkg.testsIncluded.length > 4 && (
                    <span className="text-[10px] font-bold text-teal-700 px-1 py-0.5">
                      +{pkg.testsIncluded.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              <div className="text-[11px] text-slate-500 space-y-1 pt-1 border-t border-slate-100">
                <p><strong>Ideal For:</strong> {pkg.idealFor}</p>
                <p><strong>Fasting:</strong> {pkg.fastingInfo}</p>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                onClick={() => togglePopularPackage(pkg.id)}
                className={`text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  pkg.isPopular ? 'text-amber-600' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <Star className={`w-3.5 h-3.5 ${pkg.isPopular ? 'fill-current' : ''}`} />
                <span>{pkg.isPopular ? 'Featured' : 'Feature'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(pkg)}
                  className="px-3 py-1.5 text-xs font-bold text-sky-800 hover:bg-sky-50 rounded-xl transition-all flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => handleDelete(pkg.id, pkg.name)}
                  className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                  title="Delete Package"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Add / Edit Package Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8 space-y-6 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-display">
                  {editingPkgId ? 'Edit Health Package' : 'Create Health Package'}
                </h3>
                <p className="text-xs text-slate-500">Configure package tests, pricing, parameters, and features.</p>
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
                <label className="text-xs font-bold text-slate-700">Package Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Executive Full Body Health Package"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Tagline / Subtitle</label>
                <input
                  type="text"
                  placeholder="e.g. Comprehensive vital organ screening for adults"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
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
                  <label className="text-xs font-bold text-slate-700">Original Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Total Parameters *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={parametersCount}
                    onChange={(e) => setParametersCount(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Tests Included (Comma separated)</label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Complete Blood Count (24 params), Lipid Profile (8 params), Liver Function (11 params), Kidney Function (9 params), Thyroid Profile (3 params)"
                  value={testsIncludedInput}
                  onChange={(e) => setTestsIncludedInput(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Ideal For</label>
                  <input
                    type="text"
                    placeholder="e.g. Adults 25-50 years, annual preventive checkup"
                    value={idealFor}
                    onChange={(e) => setIdealFor(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Fasting Requirement</label>
                  <input
                    type="text"
                    placeholder="e.g. 10 to 12 hours overnight fasting mandatory"
                    value={fastingInfo}
                    onChange={(e) => setFastingInfo(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Package Features & Highlights (Comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Free Home Sample Collection, Doctor Tele-Consultation, Smart QR PDF Report"
                  value={featuresInput}
                  onChange={(e) => setFeaturesInput(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                <input
                  type="checkbox"
                  id="pkgPopularCheck"
                  checked={isPopular}
                  onChange={(e) => setIsPopular(e.target.checked)}
                  className="w-4 h-4 text-amber-600 rounded-md focus:ring-amber-500"
                />
                <label htmlFor="pkgPopularCheck" className="text-xs font-bold text-slate-700 cursor-pointer flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
                  <span>Feature as Highlight Package on Home Screen</span>
                </label>
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
                  {editingPkgId ? 'Save Changes' : 'Create Package'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
