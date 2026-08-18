import React from 'react';
import { 
  CheckCircle2, 
  Sparkles, 
  Calendar, 
  Plus, 
  Check, 
  Clock, 
  Activity, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { HealthPackage, CartItem } from '../types';

interface PackageCardProps {
  pkg: HealthPackage;
  isInCart: boolean;
  onAddToCart: (item: CartItem) => void;
  onRemoveFromCart: (id: string) => void;
  onBookNow: (item: CartItem) => void;
  onViewDetails: (pkg: HealthPackage) => void;
}

export const PackageCard: React.FC<PackageCardProps> = ({
  pkg,
  isInCart,
  onAddToCart,
  onRemoveFromCart,
  onBookNow,
  onViewDetails
}) => {
  const cartItem: CartItem = {
    id: pkg.id,
    type: 'package',
    name: pkg.name,
    price: pkg.price,
    sampleType: pkg.sampleTypes.join(', '),
    fastingRequired: true
  };

  return (
    <div className={`rounded-3xl border transition-all duration-300 flex flex-col justify-between relative bg-white overflow-hidden ${
      pkg.isPopular 
        ? 'border-teal-500 ring-2 ring-teal-500/20 shadow-lg shadow-teal-900/5' 
        : 'border-slate-200/90 hover:border-blue-300 shadow-sm hover:shadow-md'
    }`}>
      
      {pkg.isPopular && (
        <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white text-center py-1 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Most Popular Checkup</span>
        </div>
      )}

      <div className="p-6">
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <span className="inline-block px-2.5 py-0.5 text-[11px] font-bold bg-blue-100/70 text-blue-900 rounded-full mb-1.5">
              {pkg.parametersCount} Vital Parameters Included
            </span>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              {pkg.name}
            </h3>
          </div>

          <div className="text-right">
            <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase rounded">
              {pkg.discountPercentage}% OFF
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-500 mb-5 leading-relaxed min-h-[36px]">
          {pkg.tagline}
        </p>

        {/* Pricing Block */}
        <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100 mb-5">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              ₹{pkg.price}
            </span>
            <span className="text-xs sm:text-sm text-slate-400 line-through">
              ₹{pkg.originalPrice}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>Includes free digital report & sample collection kit</span>
          </p>
        </div>

        {/* Key Included Tests (First 4-5) */}
        <div className="space-y-2 mb-5">
          <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
            Key Investigations Included:
          </span>
          <ul className="space-y-1.5">
            {pkg.testsIncluded.slice(0, 4).map((test, index) => (
              <li key={index} className="text-xs text-slate-600 flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                <span className="line-clamp-1">{test}</span>
              </li>
            ))}
            {pkg.testsIncluded.length > 4 && (
              <li className="pt-1">
                <button
                  onClick={() => onViewDetails(pkg)}
                  className="text-xs text-teal-700 font-semibold hover:underline flex items-center gap-1"
                >
                  <span>+{pkg.testsIncluded.length - 4} more test profiles</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </li>
            )}
          </ul>
        </div>

        {/* Fasting & Ideal For */}
        <div className="pt-3 border-t border-slate-100 text-[11px] space-y-1 text-slate-500">
          <div><strong className="text-slate-700">Ideal for:</strong> {pkg.idealFor}</div>
          <div><strong className="text-slate-700">Fasting:</strong> {pkg.fastingInfo}</div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-6 pt-0">
        <div className="grid grid-cols-2 gap-2.5">
          {isInCart ? (
            <button
              onClick={() => onRemoveFromCart(pkg.id)}
              className="py-2.5 px-3 rounded-xl border border-teal-600 bg-teal-50 text-teal-800 hover:bg-rose-50 hover:border-rose-300 hover:text-rose-700 text-xs font-semibold transition-all flex items-center justify-center gap-1"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Added</span>
            </button>
          ) : (
            <button
              onClick={() => onAddToCart(cartItem)}
              className="py-2.5 px-3 rounded-xl border border-slate-300 hover:border-teal-500 text-slate-700 hover:text-teal-700 hover:bg-teal-50/50 text-xs font-semibold transition-all flex items-center justify-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add to List</span>
            </button>
          )}

          <button
            onClick={() => onBookNow(cartItem)}
            className="py-2.5 px-3 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold shadow-md shadow-blue-950/10 transition-all flex items-center justify-center gap-1"
          >
            <Calendar className="w-3.5 h-3.5 text-teal-300" />
            <span>Book Package</span>
          </button>
        </div>
      </div>

    </div>
  );
};
