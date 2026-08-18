import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  Calendar, 
  ShieldCheck, 
  ArrowRight, 
  Clock, 
  Droplet, 
  Info,
  Layers,
  Check
} from 'lucide-react';
import { PageType, CartItem, HealthPackage, TestItem } from '../types';
import { HEALTH_PACKAGES } from '../data/labData';
import { PackageCard } from '../components/PackageCard';

interface PackagesViewProps {
  onNavigate: (page: PageType, param?: string) => void;
  cart?: CartItem[];
  onAddToCart: (item: CartItem) => void;
  onRemoveFromCart: (id: string) => void;
  onBookNow: (item: CartItem) => void;
  onViewDetails?: (pkg: HealthPackage) => void;
  onViewPackageDetails?: (pkg: HealthPackage) => void;
}

export const PackagesView: React.FC<PackagesViewProps> = ({
  onNavigate,
  cart = [],
  onAddToCart,
  onRemoveFromCart,
  onBookNow,
  onViewDetails,
  onViewPackageDetails
}) => {
  const [selectedAudience, setSelectedAudience] = useState<string>('All');

  const cartItemIds = new Set(cart.map(c => c.id));

  const handleDetails = (pkg: HealthPackage) => {
    if (onViewDetails) onViewDetails(pkg);
    else if (onViewPackageDetails) onViewPackageDetails(pkg);
  };

  const filteredPackages = HEALTH_PACKAGES.filter(pkg => {
    if (selectedAudience === 'All') return true;
    if (selectedAudience === 'Senior' && pkg.id.includes('senior')) return true;
    if (selectedAudience === 'Women' && pkg.id.includes('women')) return true;
    if (selectedAudience === 'Diabetic' && pkg.id.includes('diabetic')) return true;
    if (selectedAudience === 'Executive' && pkg.id.includes('executive')) return true;
    return true;
  });

  return (
    <div className="space-y-16 py-8">
      
      {/* Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-teal-950 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          <div className="max-w-3xl space-y-3 relative z-10">
            <span className="px-3 py-1 bg-teal-500/20 text-teal-300 text-xs font-bold rounded-full border border-teal-500/30 uppercase tracking-wider inline-block">
              Preventive Health Checkups
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display">
              Health Checkup Packages
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Comprehensive preventive wellness profiles combining vital organ evaluations, metabolic risk indices, and key vitamin metrics at transparent bundled prices.
            </p>
          </div>
        </div>
      </section>

      {/* Package Filter & Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Audience Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {['All', 'Executive', 'Diabetic', 'Women', 'Senior'].map(aud => (
            <button
              key={aud}
              onClick={() => setSelectedAudience(aud)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedAudience === aud
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {aud === 'All' ? 'All Health Packages' : `${aud} Focused`}
            </button>
          ))}
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPackages.map(pkg => (
            <PackageCard
              key={pkg.id}
              pkg={pkg}
              isInCart={cartItemIds.has(pkg.id)}
              onAddToCart={onAddToCart}
              onRemoveFromCart={onRemoveFromCart}
              onBookNow={onBookNow}
              onViewDetails={(p) => handleDetails(p as HealthPackage)}
            />
          ))}
        </div>

      </section>

      {/* Package Comparison Table */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
              Health Package Feature Comparison
            </h2>
            <p className="text-xs text-slate-500">
              Quick comparison of key organ parameter inclusions across our primary wellness packages.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-900 font-bold">
                  <th className="py-3 px-4">Panel / Organ System</th>
                  <th className="py-3 px-4 text-center">Basic (48 Params)</th>
                  <th className="py-3 px-4 text-center">Comprehensive (72 Params)</th>
                  <th className="py-3 px-4 text-center">Executive (95 Params)</th>
                  <th className="py-3 px-4 text-center">Senior Citizen (82 Params)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-900">Complete Blood Count (CBC + ESR)</td>
                  <td className="py-3 px-4 text-center text-teal-600 font-bold">✓ (24 params)</td>
                  <td className="py-3 px-4 text-center text-teal-600 font-bold">✓ (24 params)</td>
                  <td className="py-3 px-4 text-center text-teal-600 font-bold">✓ (24 params)</td>
                  <td className="py-3 px-4 text-center text-teal-600 font-bold">✓ (24 params)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-900">Liver Function Profile (LFT Extended)</td>
                  <td className="py-3 px-4 text-center text-teal-600 font-bold">✓ (8 params)</td>
                  <td className="py-3 px-4 text-center text-teal-600 font-bold">✓ (12 params)</td>
                  <td className="py-3 px-4 text-center text-teal-600 font-bold">✓ (12 params)</td>
                  <td className="py-3 px-4 text-center text-teal-600 font-bold">✓ (12 params)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-900">Kidney / Renal Profile (KFT + Electrolytes)</td>
                  <td className="py-3 px-4 text-center text-teal-600 font-bold">✓ (Basic)</td>
                  <td className="py-3 px-4 text-center text-teal-600 font-bold">✓ (Full)</td>
                  <td className="py-3 px-4 text-center text-teal-600 font-bold">✓ (Full + Electrolytes)</td>
                  <td className="py-3 px-4 text-center text-teal-600 font-bold">✓ (Full + eGFR)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-900">Lipid Profile & Cardiac Risk Ratios</td>
                  <td className="py-3 px-4 text-center text-teal-600 font-bold">✓</td>
                  <td className="py-3 px-4 text-center text-teal-600 font-bold">✓</td>
                  <td className="py-3 px-4 text-center text-teal-600 font-bold">✓ + hs-CRP</td>
                  <td className="py-3 px-4 text-center text-teal-600 font-bold">✓</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-900">Blood Sugar & 3-Month HbA1c</td>
                  <td className="py-3 px-4 text-center text-slate-400">Glucose Only</td>
                  <td className="py-3 px-4 text-center text-teal-600 font-bold">✓ Glucose + HbA1c</td>
                  <td className="py-3 px-4 text-center text-teal-600 font-bold">✓ Glucose + HbA1c</td>
                  <td className="py-3 px-4 text-center text-teal-600 font-bold">✓ Glucose + HbA1c</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-900">Thyroid Profile (T3, T4, TSH Ultra)</td>
                  <td className="py-3 px-4 text-center text-slate-400">TSH Only</td>
                  <td className="py-3 px-4 text-center text-teal-600 font-bold">✓ Complete T3/T4/TSH</td>
                  <td className="py-3 px-4 text-center text-teal-600 font-bold">✓ Complete T3/T4/TSH</td>
                  <td className="py-3 px-4 text-center text-teal-600 font-bold">✓ Complete T3/T4/TSH</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-900">Vitamin D (25-OH) & Vitamin B12</td>
                  <td className="py-3 px-4 text-center text-slate-400">-</td>
                  <td className="py-3 px-4 text-center text-teal-600 font-bold">✓ Both Included</td>
                  <td className="py-3 px-4 text-center text-teal-600 font-bold">✓ Both Included</td>
                  <td className="py-3 px-4 text-center text-teal-600 font-bold">✓ Both Included</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-900">Free Home Sample Collection</td>
                  <td className="py-3 px-4 text-center text-slate-500">Add ₹150</td>
                  <td className="py-3 px-4 text-center text-emerald-600 font-bold">FREE</td>
                  <td className="py-3 px-4 text-center text-emerald-600 font-bold">FREE</td>
                  <td className="py-3 px-4 text-center text-emerald-600 font-bold">FREE</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Preparation Guidelines for Packages */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-4 text-xs text-slate-700">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
            <Info className="w-5 h-5 text-teal-700 shrink-0" />
            <span>Preparation Guidelines for Preventive Health Checkups:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 block">10-12 Hours Fasting</span>
              <p className="text-slate-500 leading-relaxed">
                Do not consume food, tea, coffee, or milk for 10-12 hours before sample collection. Plain drinking water is permitted.
              </p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 block">Morning Medication</span>
              <p className="text-slate-500 leading-relaxed">
                If you take thyroid medication or diabetes medication, please consult our phlebotomist regarding timing of morning dosages.
              </p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 block">Sample Transit Protocol</span>
              <p className="text-slate-500 leading-relaxed">
                Serum samples are separated immediately and placed in insulated cool containers to protect sensitive enzymes and lipid stability.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
