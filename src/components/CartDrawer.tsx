import React from 'react';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  Calendar, 
  Plus, 
  ShieldCheck, 
  Sparkles,
  Droplet,
  Clock
} from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onProceedToBooking: () => void;
  onExploreMore: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart = [],
  onRemoveItem,
  onClearCart,
  onProceedToBooking,
  onExploreMore
}) => {
  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
  const isEligibleForFreeHomeCollection = subtotal >= 999;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200 border-l border-slate-200">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Selected Tests & Packages
              </h3>
              <p className="text-xs text-slate-500">
                {cart.length} {cart.length === 1 ? 'item' : 'items'} in your test list
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Item List */}
        <div className="p-5 flex-1 overflow-y-auto space-y-3">
          {cart.length === 0 ? (
            <div className="text-center py-16 px-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-800">Your test list is empty</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
                  Explore our popular blood tests or comprehensive health checkup packages to build your personalized diagnostic list.
                </p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onExploreMore();
                }}
                className="px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold rounded-xl transition-all inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Browse All Tests</span>
              </button>
            </div>
          ) : (
            <>
              {/* Free Home Collection Notification Banner */}
              <div className={`p-3 rounded-xl text-xs flex items-center gap-2.5 ${
                isEligibleForFreeHomeCollection 
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' 
                  : 'bg-amber-50 border border-amber-200 text-amber-800'
              }`}>
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>
                  {isEligibleForFreeHomeCollection ? (
                    <strong>Free doorstep sample collection included!</strong>
                  ) : (
                    <span>Add ₹{999 - subtotal} more for <strong>Free Home Collection</strong></span>
                  )}
                </span>
              </div>

              {cart.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl border border-slate-200/90 bg-white shadow-2xs hover:border-slate-300 transition-all flex items-center justify-between gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                        item.type === 'package' ? 'bg-teal-100 text-teal-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {item.type}
                      </span>
                      {item.code && (
                        <span className="text-[10px] font-mono text-slate-400">
                          {item.code}
                        </span>
                      )}
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      {item.name}
                    </h4>

                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                      <span>₹{item.price}</span>
                      {item.sampleType && (
                        <>
                          <span>•</span>
                          <span className="truncate">{item.sampleType}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              <div className="pt-2 text-right">
                <button
                  onClick={onClearCart}
                  className="text-xs text-rose-600 hover:underline font-medium"
                >
                  Clear all selected items
                </button>
              </div>
            </>
          )}
        </div>

        {/* Footer with Subtotal & Proceed CTA */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-4">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Selected Items Total:</span>
                <span className="font-semibold text-slate-900">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Home Collection Protocol:</span>
                <span className="font-semibold text-emerald-700">
                  {isEligibleForFreeHomeCollection ? 'FREE' : '₹150 (Free over ₹999)'}
                </span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                <span>Estimated Total:</span>
                <span className="text-blue-900">₹{subtotal + (isEligibleForFreeHomeCollection ? 0 : 150)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  onClose();
                  onProceedToBooking();
                }}
                className="w-full py-3 bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-950/20 transition-all flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4 text-teal-300" />
                <span>Proceed to Schedule Appointment</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[10px] text-center text-slate-500">
                Pay on sample collection (Cash / UPI / Cards supported)
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
