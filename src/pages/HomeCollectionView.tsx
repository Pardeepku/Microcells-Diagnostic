import React, { useState } from 'react';
import { 
  Home, 
  Clock, 
  ShieldCheck, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  Thermometer, 
  Users, 
  Check, 
  AlertCircle,
  Phone,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { PageType, CartItem } from '../types';
import { LAB_INFO } from '../data/labData';

interface HomeCollectionViewProps {
  onNavigate: (page: PageType) => void;
  onOpenBooking: () => void;
  onOpenWhatsApp: () => void;
}

export const HomeCollectionView: React.FC<HomeCollectionViewProps> = ({
  onNavigate,
  onOpenBooking,
  onOpenWhatsApp
}) => {
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState<'idle' | 'checking' | 'available' | 'unavailable'>('idle');

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode || pincode.length < 6) return;

    setPincodeStatus('checking');
    setTimeout(() => {
      // Provide positive serviceability for any valid 6-digit code
      setPincodeStatus('available');
    }, 400);
  };

  return (
    <div className="space-y-16 py-8">
      
      {/* Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-teal-950 text-white rounded-3xl p-8 sm:p-14 relative overflow-hidden">
          <div className="max-w-3xl space-y-4 relative z-10">
            <span className="px-3 py-1 bg-teal-500/20 text-teal-300 text-xs font-bold rounded-full border border-teal-500/30 uppercase tracking-wider inline-block">
              Doorstep Diagnostic Service
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display">
              Home Sample Collection
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Experience the utmost convenience of certified phlebotomists collecting your blood and pathology samples right at your doorstep with stringent biosafety and temperature control.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onOpenBooking}
                className="px-6 py-3.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Home Collection Now</span>
              </button>

              <button
                onClick={onOpenWhatsApp}
                className="px-5 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs sm:text-sm rounded-xl border border-slate-700 transition-all flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp Booking</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pincode Serviceability Checker */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md">
          <div className="text-center max-w-xl mx-auto space-y-2 mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Check Home Collection Service in Your Area
            </h2>
            <p className="text-xs text-slate-500">
              Enter your 6-digit pincode to check our phlebotomy coverage and early morning slot availability.
            </p>
          </div>

          <form onSubmit={handleCheckPincode} className="max-w-md mx-auto flex items-center gap-2">
            <div className="relative flex-1">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Enter 6-Digit Pincode (e.g. 110001)"
                value={pincode}
                onChange={(e) => {
                  setPincode(e.target.value.replace(/[^0-9]/g, ''));
                  setPincodeStatus('idle');
                }}
                maxLength={6}
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <button
              type="submit"
              disabled={pincodeStatus === 'checking' || pincode.length < 6}
              className="px-5 py-2.5 bg-blue-900 hover:bg-blue-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-all shrink-0"
            >
              {pincodeStatus === 'checking' ? 'Checking...' : 'Check Availability'}
            </button>
          </form>

          {pincodeStatus === 'available' && (
            <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs flex items-center justify-between gap-3 animate-in fade-in duration-200 max-w-md mx-auto">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <strong className="block text-slate-900">Home Collection Available in {pincode}!</strong>
                  <span className="text-[11px] text-emerald-700">Early slots from 6:30 AM are currently open.</span>
                </div>
              </div>

              <button
                onClick={onOpenBooking}
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-[11px] rounded-lg shrink-0"
              >
                Book Slot
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 6 Key Benefits of Microcells Home Sample Collection */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="px-3 py-1 bg-teal-100 text-teal-800 text-xs font-bold rounded-full">
            The Microcells Advantage
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
            Why Book Home Collection With Us?
          </h2>
          <p className="text-xs text-slate-500">
            Professional diagnostic care with zero compromise on sample viability or patient safety.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center">
              <Users className="w-5 h-5 text-teal-700" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Certified Phlebotomists</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Trained in gentle pediatric and geriatric venipuncture to ensure a painless and swift blood draw.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-teal-700" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Sterile Single-Use Kits</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Sealed needle packs and pre-evacuated vacutainers opened exclusively in front of the patient.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-800 flex items-center justify-center">
              <Thermometer className="w-5 h-5 text-teal-700" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Cold-Chain Temperature Loggers</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Samples travel in sealed ice gel carrier boxes maintained between 2°C to 8°C during transit.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <Clock className="w-5 h-5 text-teal-700" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Convenient Early Slots</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Slots start from 6:30 AM to facilitate 10-12h overnight fasting blood sugar and lipid tests without disruption.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-800 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-teal-700" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Free Collection on ₹999+</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Enjoy 100% free doorstep pickup for all wellness packages or test orders exceeding ₹999.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-800 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-teal-700" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Flexible Rescheduling</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Need to shift your morning slot? Modify or reschedule your appointment with a simple call or WhatsApp message.
            </p>
          </div>
        </div>
      </section>

      {/* Safety Protocol Steps */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-teal-400 text-xs font-bold uppercase tracking-wider">Safety First</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display">
              Our 5-Step Phlebotomy Protocol at Your Home
            </h2>
            <p className="text-xs text-slate-400">
              Every phlebotomy visit strictly follows standard operating biosafety procedures:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-2">
              <span className="text-teal-400 font-mono text-lg font-black">01</span>
              <h4 className="text-xs font-bold text-white">ID & Sanitization</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Phlebotomist arrives with digital identity badge and sanitizes hands with 70% alcohol solution.
              </p>
            </div>

            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-2">
              <span className="text-teal-400 font-mono text-lg font-black">02</span>
              <h4 className="text-xs font-bold text-white">Patient Verification</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Verifies patient name, age, and confirms adherence to 10-12 hour fasting prerequisites.
              </p>
            </div>

            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-2">
              <span className="text-teal-400 font-mono text-lg font-black">03</span>
              <h4 className="text-xs font-bold text-white">Unboxing Sterile Kit</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Opens fresh sterile vacutainers and needles in front of the patient.
              </p>
            </div>

            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-2">
              <span className="text-teal-400 font-mono text-lg font-black">04</span>
              <h4 className="text-xs font-bold text-white">Direct Barcoding</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Immediately labels primary collection tubes with your unique accession barcode.
              </p>
            </div>

            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-2">
              <span className="text-teal-400 font-mono text-lg font-black">05</span>
              <h4 className="text-xs font-bold text-white">Cold-Chain Storage</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Stores tubes in insulated thermal containers for direct dispatch to the central lab.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Book CTA bottom */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
        <h3 className="text-xl font-bold text-slate-900">
          Ready to Book Home Collection?
        </h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Choose your preferred morning slot in less than 60 seconds with our online scheduler.
        </p>
        <button
          onClick={onOpenBooking}
          className="px-8 py-3.5 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-lg transition-all inline-flex items-center gap-2"
        >
          <Calendar className="w-4 h-4 text-teal-300" />
          <span>Schedule Doorstep Appointment</span>
        </button>
      </section>

    </div>
  );
};
