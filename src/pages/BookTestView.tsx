import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Home, 
  Building2, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  UploadCloud, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { CartItem, PageType } from '../types';
import { POPULAR_TESTS, HEALTH_PACKAGES, LAB_INFO } from '../data/labData';

interface BookTestViewProps {
  onNavigate: (page: PageType) => void;
  cart: CartItem[];
  onAddToCart: (item: CartItem) => void;
  onRemoveFromCart: (id: string) => void;
  onClearCart: () => void;
}

export const BookTestView: React.FC<BookTestViewProps> = ({
  onNavigate,
  cart = [],
  onAddToCart,
  onRemoveFromCart,
  onClearCart
}) => {
  const [serviceType, setServiceType] = useState<'home' | 'lab'>('home');
  const [patientName, setPatientName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTimeSlot, setPreferredTimeSlot] = useState('07:00 AM - 08:00 AM');
  const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null);
  const [additionalNotes, setAdditionalNotes] = useState('');
  
  const [selectedAddonTest, setSelectedAddonTest] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bookingRef, setBookingRef] = useState('');

  const cartSubtotal = cart.reduce((sum, item) => sum + item.price, 0);
  const homeCollectionFee = serviceType === 'home' ? (cartSubtotal >= 999 ? 0 : 150) : 0;
  const estimatedTotal = cartSubtotal + homeCollectionFee;

  const timeSlots = [
    '06:30 AM - 07:30 AM (Fasting Preferred)',
    '07:30 AM - 08:30 AM (Fasting Preferred)',
    '08:30 AM - 09:30 AM',
    '09:30 AM - 10:30 AM',
    '10:30 AM - 11:30 AM',
    '11:30 AM - 12:30 PM',
    '04:00 PM - 05:00 PM (Post-Prandial / Routine)',
    '05:00 PM - 06:30 PM'
  ];

  const handleAddQuickTest = () => {
    if (!selectedAddonTest) return;
    const test = POPULAR_TESTS.find(t => t.id === selectedAddonTest);
    if (test) {
      onAddToCart({
        id: test.id,
        type: 'test',
        name: test.name,
        price: test.price,
        code: test.code,
        sampleType: test.sampleType,
        fastingRequired: test.fastingRequired
      });
      setSelectedAddonTest('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0 && !prescriptionFile) {
      alert('Please select at least one test/package or attach a doctor’s prescription.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setBookingRef(`MC-APT-${Math.floor(100000 + Math.random() * 900000)}`);
      onClearCart();
    }, 700);
  };

  return (
    <div className="space-y-12 py-8">
      
      {/* Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-teal-950 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          <div className="max-w-3xl space-y-3 relative z-10">
            <span className="px-3 py-1 bg-teal-500/20 text-teal-300 text-xs font-bold rounded-full border border-teal-500/30 uppercase tracking-wider inline-block">
              Diagnostic Appointment Scheduling
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display">
              Book a Diagnostic Test or Health Package
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Schedule doorstep sample collection or laboratory visit with trained healthcare professionals.
            </p>
          </div>
        </div>
      </section>

      {/* Main Booking Container */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        {isSubmitted ? (
          <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl text-center space-y-6 animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-slate-900 font-display">
                Appointment Successfully Scheduled!
              </h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Thank you, <strong>{patientName}</strong>. Your diagnostic appointment request has been recorded in our LIMS system.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 max-w-md mx-auto space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-slate-500">Booking Reference ID:</span>
                <strong className="font-mono text-blue-900">{bookingRef}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Service Mode:</span>
                <span className="font-semibold text-slate-900">
                  {serviceType === 'home' ? 'Doorstep Sample Collection' : 'Lab Center Visit'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Scheduled Date:</span>
                <span className="font-semibold">{preferredDate || 'Tomorrow'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Time Slot:</span>
                <span className="font-semibold">{preferredTimeSlot}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Contact Number:</span>
                <span className="font-mono">{mobile}</span>
              </div>
            </div>

            <div className="p-4 bg-teal-50 rounded-2xl border border-teal-200 text-xs text-teal-900 text-left space-y-1">
              <span className="font-bold block">Next Steps:</span>
              <p>1. Our clinical coordinator will call you to confirm location landmarks and fasting instructions.</p>
              <p>2. A certified phlebotomist with sterile sealed kits will arrive at your scheduled time slot.</p>
              <p>3. Pay securely upon sample collection (Cash / UPI / Cards accepted).</p>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  onNavigate('home');
                }}
                className="px-6 py-3 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-md transition-all"
              >
                Return to Homepage
              </button>

              <button
                onClick={() => onNavigate('tests')}
                className="px-6 py-3 bg-white border border-slate-300 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50 transition-all"
              >
                Browse More Tests
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Form Fields */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Step 1: Service Mode Selection */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-900 text-white text-xs flex items-center justify-center font-bold">1</span>
                  <span>Choose Service Mode</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setServiceType('home')}
                    className={`p-4 rounded-2xl border-2 text-left flex items-start gap-3 transition-all ${
                      serviceType === 'home'
                        ? 'border-teal-600 bg-teal-50/50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      serviceType === 'home' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      <Home className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Home Sample Collection</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Trained phlebotomist collects blood at your home address.
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setServiceType('lab')}
                    className={`p-4 rounded-2xl border-2 text-left flex items-start gap-3 transition-all ${
                      serviceType === 'lab'
                        ? 'border-blue-900 bg-blue-50/50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      serviceType === 'lab' ? 'bg-blue-900 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Visit Laboratory Center</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Walk-in directly to our central diagnostic laboratory facility.
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Step 2: Patient Demographics */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-900 text-white text-xs flex items-center justify-center font-bold">2</span>
                  <span>Patient Details</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Full Name of Patient <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        placeholder="Patient Full Name"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Mobile Number <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="tel"
                        required
                        placeholder="10-digit mobile number"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value.replace(/[^0-9]/g, ''))}
                        maxLength={10}
                        className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Age (Years) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="number"
                        required
                        placeholder="e.g. 42"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Gender <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Email Address (Optional)
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="email"
                        placeholder="For digital report copy"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Home Address details if Home collection selected */}
                {serviceType === 'home' && (
                  <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          Complete Doorstep Address <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required={serviceType === 'home'}
                          placeholder="House / Flat No, Street, Landmark"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          Pincode <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required={serviceType === 'home'}
                          placeholder="6-digit pincode"
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value.replace(/[^0-9]/g, ''))}
                          maxLength={6}
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Step 3: Date & Slot Selection */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-900 text-white text-xs flex items-center justify-center font-bold">3</span>
                  <span>Preferred Date & Time Slot</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Preferred Date <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Preferred Time Slot <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={preferredTimeSlot}
                      onChange={(e) => setPreferredTimeSlot(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      {timeSlots.map(slot => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Special Medical Notes / Fasting Status / Doctor Reference
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Patient is fasting for 10 hours, referred by Dr. Sharma"
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

            </div>

            {/* Right Column: Selected Tests Order Summary */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-5 sticky top-28">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <h3 className="text-base font-bold text-slate-900">
                    Selected Tests & Packages
                  </h3>
                  <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                    {cart.length} Selected
                  </span>
                </div>

                {/* Quick Test Add dropdown inside form */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Add Test to this Booking:
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={selectedAddonTest}
                      onChange={(e) => setSelectedAddonTest(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50"
                    >
                      <option value="">-- Choose a test to add --</option>
                      {POPULAR_TESTS.map(t => (
                        <option key={t.id} value={t.id}>{t.name} (₹{t.price})</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={handleAddQuickTest}
                      disabled={!selectedAddonTest}
                      className="px-3 py-2 bg-blue-900 hover:bg-blue-800 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all shrink-0"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Item List */}
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {cart.length === 0 ? (
                    <div className="p-4 bg-slate-50 rounded-2xl text-center text-xs text-slate-500 space-y-1">
                      <p>No tests selected yet.</p>
                      <p className="text-[11px] text-slate-400">Select tests above or attach prescription below.</p>
                    </div>
                  ) : (
                    cart.map(item => (
                      <div
                        key={item.id}
                        className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-2 text-xs"
                      >
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-slate-900 truncate">{item.name}</h4>
                          <span className="text-[10px] text-slate-400 font-mono">₹{item.price}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => onRemoveFromCart(item.id)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* Upload Prescription option */}
                <div className="pt-2 border-t border-slate-100">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                    Attach Doctor's Prescription (Optional):
                  </label>
                  <label className="border border-dashed border-slate-300 hover:border-teal-500 rounded-xl p-3 text-center cursor-pointer block bg-slate-50/50 hover:bg-teal-50/30 transition-colors">
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setPrescriptionFile(e.target.files[0]);
                        }
                      }}
                      className="hidden"
                    />
                    <div className="flex items-center justify-center gap-2 text-xs text-slate-600">
                      <UploadCloud className="w-4 h-4 text-teal-600" />
                      <span>{prescriptionFile ? prescriptionFile.name : 'Upload Prescription File'}</span>
                    </div>
                  </label>
                </div>

                {/* Financial Summary */}
                <div className="space-y-1.5 pt-3 border-t border-slate-200 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Tests Subtotal:</span>
                    <span className="font-semibold text-slate-900">₹{cartSubtotal}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Home Collection:</span>
                    <span className="font-semibold text-emerald-700">
                      {serviceType === 'home' 
                        ? (cartSubtotal >= 999 ? 'FREE (Cart > ₹999)' : '₹150')
                        : 'N/A (Lab Visit)'}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                    <span>Estimated Total:</span>
                    <span className="text-blue-900">₹{estimatedTotal}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-gradient-to-r from-blue-900 to-teal-800 hover:from-blue-800 hover:to-teal-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Confirming Appointment...</span>
                  ) : (
                    <>
                      <Calendar className="w-4 h-4 text-teal-300" />
                      <span>Confirm & Schedule Appointment</span>
                    </>
                  )}
                </button>

                <p className="text-[10px] text-center text-slate-400">
                  Pay securely at sample collection. No upfront payment required.
                </p>

              </div>

            </div>

          </form>
        )}
      </section>

    </div>
  );
};
