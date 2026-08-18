import React from 'react';
import { 
  X, 
  Droplet, 
  Clock, 
  Calendar, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  Activity,
  Plus,
  Check
} from 'lucide-react';
import { TestItem, HealthPackage, CartItem } from '../types';

interface TestDetailsModalProps {
  item: TestItem | HealthPackage | null;
  type: 'test' | 'package';
  isOpen: boolean;
  onClose: () => void;
  isInCart: boolean;
  onAddToCart: (item: CartItem) => void;
  onBookNow: (item: CartItem) => void;
}

export const TestDetailsModal: React.FC<TestDetailsModalProps> = ({
  item,
  type,
  isOpen,
  onClose,
  isInCart,
  onAddToCart,
  onBookNow
}) => {
  if (!isOpen || !item) return null;

  const isTest = type === 'test';
  const testItem = item as TestItem;
  const packageItem = item as HealthPackage;

  const cartItem: CartItem = {
    id: item.id,
    type: isTest ? 'test' : 'package',
    name: item.name,
    price: item.price,
    sampleType: isTest ? testItem.sampleType : packageItem.sampleTypes.join(', '),
    fastingRequired: isTest ? testItem.fastingRequired : true
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200 relative my-6 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-950 to-slate-900 text-white p-6 flex items-start justify-between shrink-0">
          <div>
            <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold bg-teal-500/20 text-teal-300 mb-2 uppercase tracking-wide">
              {isTest ? `${testItem.category} • ${testItem.code}` : `${packageItem.parametersCount} Parameters Included`}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {item.name}
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              {isTest ? testItem.commonUses : packageItem.tagline}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors shrink-0 ml-3"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-700 text-xs">
          
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Specimen</span>
              <span className="font-semibold text-slate-800">
                {isTest ? testItem.sampleType : packageItem.sampleTypes.join(' & ')}
              </span>
            </div>

            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Turnaround</span>
              <span className="font-semibold text-slate-800">
                {isTest ? testItem.turnaroundTime : packageItem.turnaroundTime}
              </span>
            </div>

            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Fasting Req.</span>
              <span className="font-semibold text-slate-800">
                {isTest ? (testItem.fastingRequired ? `${testItem.fastingHours}h Fasting` : 'No Fasting') : '10-12h Fasting'}
              </span>
            </div>

            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Parameters</span>
              <span className="font-bold text-teal-700">
                {item.parametersCount} Parameters
              </span>
            </div>
          </div>

          {/* Description */}
          {isTest ? (
            <div className="space-y-2">
              <h3 className="font-bold text-sm text-slate-900">Clinical Purpose & Significance</h3>
              <p className="text-slate-600 leading-relaxed text-xs">
                {testItem.description}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <h3 className="font-bold text-sm text-slate-900">Who Should Take This Package?</h3>
              <p className="text-slate-600 leading-relaxed text-xs">
                {packageItem.idealFor}
              </p>
            </div>
          )}

          {/* Parameters / Tests Included */}
          <div className="space-y-2.5">
            <h3 className="font-bold text-sm text-slate-900 flex items-center justify-between">
              <span>{isTest ? 'Parameters Measured in this Investigation' : 'Test Panels Included in this Health Package'}</span>
              <span className="text-xs text-teal-700 font-bold font-mono">({item.parametersCount} Total)</span>
            </h3>

            {isTest ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-50/70 p-4 rounded-2xl border border-slate-200">
                {testItem.parametersList.map((param, index) => (
                  <div key={index} className="flex items-center gap-2 text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span>{param}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {packageItem.categoryBreakdown.map((cat, idx) => (
                  <div key={idx} className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                    <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-200">
                      <span className="font-bold text-blue-950 text-xs">{cat.category}</span>
                      <span className="text-[11px] text-slate-500 font-semibold">{cat.count} Parameters</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.tests.map((t, i) => (
                        <span key={i} className="bg-white px-2 py-0.5 rounded text-[11px] border border-slate-200 text-slate-700 font-medium">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Preparation & Instructions */}
          <div className="bg-amber-50/80 p-4 rounded-2xl border border-amber-200 text-amber-900 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-xs">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Patient Preparation Instructions:</span>
            </div>
            <p className="text-[11px] leading-relaxed pl-6">
              {isTest ? testItem.preparationNotes : packageItem.fastingInfo + ' Stay hydrated with drinking water. Please take prescription medicines as instructed by your doctor.'}
            </p>
          </div>

        </div>

        {/* Footer CTAs */}
        <div className="p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Special Lab Price:</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-blue-950">₹{item.price}</span>
              {item.originalPrice && item.originalPrice > item.price && (
                <span className="text-xs text-slate-400 line-through">₹{item.originalPrice}</span>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            {isInCart ? (
              <button
                disabled
                className="px-4 py-2.5 rounded-xl bg-teal-50 border border-teal-500 text-teal-800 text-xs font-semibold flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>In List</span>
              </button>
            ) : (
              <button
                onClick={() => onAddToCart(cartItem)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 hover:border-teal-500 text-slate-700 hover:text-teal-800 bg-white text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add to List</span>
              </button>
            )}

            <button
              onClick={() => {
                onClose();
                onBookNow(cartItem);
              }}
              className="px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold shadow-md shadow-blue-950/20 transition-all flex items-center gap-1.5"
            >
              <Calendar className="w-4 h-4 text-teal-300" />
              <span>Schedule Now</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
