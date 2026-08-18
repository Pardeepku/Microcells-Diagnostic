import React from 'react';
import { 
  Clock, 
  Droplet, 
  Info, 
  Plus, 
  Check, 
  Calendar, 
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { TestItem, CartItem } from '../types';

interface TestCardProps {
  test: TestItem;
  isInCart: boolean;
  onAddToCart: (item: CartItem) => void;
  onRemoveFromCart: (id: string) => void;
  onBookNow: (item: CartItem) => void;
  onViewDetails: (test: TestItem) => void;
}

export const TestCard: React.FC<TestCardProps> = ({
  test,
  isInCart,
  onAddToCart,
  onRemoveFromCart,
  onBookNow,
  onViewDetails
}) => {
  const cartItem: CartItem = {
    id: test.id,
    type: 'test',
    name: test.name,
    code: test.code,
    price: test.price,
    sampleType: test.sampleType,
    fastingRequired: test.fastingRequired
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 hover:border-teal-500/40 p-5 shadow-xs hover:shadow-md hover:shadow-slate-200/60 transition-all duration-200 flex flex-col justify-between group relative">
      
      {test.isPopular && (
        <div className="absolute -top-2.5 right-4 bg-gradient-to-r from-teal-600 to-cyan-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
          <Sparkles className="w-2.5 h-2.5" />
          <span>Popular</span>
        </div>
      )}

      <div>
        {/* Category & Code */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md">
            {test.category}
          </span>
          <span className="text-[10px] font-mono text-slate-400 font-medium">
            {test.code}
          </span>
        </div>

        {/* Test Name */}
        <h3 
          onClick={() => onViewDetails(test)}
          className="text-base font-bold text-slate-900 group-hover:text-blue-900 cursor-pointer transition-colors line-clamp-2 leading-snug mb-2"
          title={test.name}
        >
          {test.name}
        </h3>

        {/* Short Description */}
        <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
          {test.description}
        </p>

        {/* Key Test Badges */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-[11px] text-slate-600">
          <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-lg border border-slate-100">
            <Droplet className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span className="truncate">Sample: <strong>{test.sampleType}</strong></span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-lg border border-slate-100">
            <Clock className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span className="truncate">TAT: <strong>{test.turnaroundTime}</strong></span>
          </div>
        </div>

        {/* Fasting & Parameters Notice */}
        <div className="flex items-center justify-between text-[11px] pb-4 border-b border-slate-100 text-slate-500">
          <div className="flex items-center gap-1">
            {test.fastingRequired ? (
              <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-medium">
                <AlertCircle className="w-3 h-3" />
                <span>{test.fastingHours ? `${test.fastingHours}h Fasting` : 'Fasting Req.'}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                <Check className="w-3 h-3" />
                <span>No Fasting Req.</span>
              </span>
            )}
          </div>

          <span className="text-slate-500 font-medium">
            <strong>{test.parametersCount}</strong> {test.parametersCount === 1 ? 'Parameter' : 'Parameters'}
          </span>
        </div>
      </div>

      {/* Pricing & CTAs */}
      <div className="pt-4 mt-2">
        <div className="flex items-baseline justify-between mb-3">
          <div>
            <span className="text-lg sm:text-xl font-extrabold text-slate-900">
              ₹{test.price}
            </span>
            {test.originalPrice && test.originalPrice > test.price && (
              <span className="text-xs text-slate-400 line-through ml-1.5">
                ₹{test.originalPrice}
              </span>
            )}
          </div>

          <button
            onClick={() => onViewDetails(test)}
            className="text-xs text-teal-700 hover:text-teal-800 font-semibold flex items-center gap-1 hover:underline"
          >
            <Info className="w-3.5 h-3.5" />
            <span>Details</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {isInCart ? (
            <button
              onClick={() => onRemoveFromCart(test.id)}
              className="py-2 px-3 rounded-xl border border-teal-600 bg-teal-50 text-teal-800 hover:bg-rose-50 hover:border-rose-300 hover:text-rose-700 text-xs font-semibold transition-all flex items-center justify-center gap-1"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Added</span>
            </button>
          ) : (
            <button
              onClick={() => onAddToCart(cartItem)}
              className="py-2 px-3 rounded-xl border border-slate-300 hover:border-teal-500 text-slate-700 hover:text-teal-700 hover:bg-teal-50/50 text-xs font-semibold transition-all flex items-center justify-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          )}

          <button
            onClick={() => onBookNow(cartItem)}
            className="py-2 px-3 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-1"
          >
            <Calendar className="w-3.5 h-3.5 text-teal-300" />
            <span>Book Now</span>
          </button>
        </div>
      </div>

    </div>
  );
};
