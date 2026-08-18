import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  Home, 
  Building2, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  FileText, 
  CheckCircle2, 
  ShieldCheck, 
  AlertCircle,
  UploadCloud,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import { CartItem, BookingRequest } from '../types';
import { POPULAR_TESTS, HEALTH_PACKAGES, LAB_INFO } from '../data/labData';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialItem?: CartItem | null;
  cartItems?: CartItem[];
  defaultServiceType?: 'home' | 'lab';
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  initialItem,
  cartItems = [],
  defaultServiceType = 'home'
}) => {
  const [serviceType, setServiceType] = useState<'home' | 'lab'>(defaultServiceType);
  const [patientName, setPatientName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTimeSlot, setPreferredTimeSlot] = useState('07:00 AM - 08:30 AM');
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null);
  const [notes, setNotes] = useState('');
  
  const [submittedBooking, setSubmittedBooking] = useState<BookingRequest | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Set default date to tomorrow
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');
    setPreferredDate(`${yyyy}-${mm}-${dd}`);
  }, []);

  // Update selected items based on props
  useEffect(() => {
    if (initialItem) {
      setSelectedItemIds([initialItem.id]);
    } else if (cartItems.length > 0) {
      setSelectedItemIds(cartItems.map(item => item.id));
    } else if (HEALTH_PACKAGES.length > 0) {
      setSelectedItemIds([HEALTH_PACKAGES[1].id]); // default comprehensive
    }
  }, [initialItem, cartItems, isOpen]);

  useEffect(() => {
    setServiceType(defaultServiceType);
  }, [defaultServiceType, isOpen]);

  if (!isOpen) return null;

  const timeSlots = [
    '06:30 AM - 08:00 AM (Early Morning)',
    '08:00 AM - 09:30 AM (Peak Fasting)',
    '09:30 AM - 11:00 AM',
    '11:00 AM - 01:00 PM',
    '02:00 PM - 04:00 PM',
    '04:00 PM - 06:30 PM (Evening Slot)'
  ];

  // Calculate combined selected items
  const allAvailableItems = [
    ...POPULAR_TESTS.map(t => ({ id: t.id, name: t.name, price: t.price, type: 'test' })),
    ...HEALTH_PACKAGES.map(p => ({ id: p.id, name: p.name, price: p.price, type: 'package' }))
  ];

  const selectedItemsData = allAvailableItems.filter(item => selectedItemIds.includes(item.id));
  const subtotal = selectedItemsData.reduce((sum, item) => sum + item.price, 0);
  const homeCollectionFee = serviceType === 'home' ? (subtotal >= 1000 ? 0 : 150) : 0;
  const totalAmount = subtotal + homeCollectionFee;

  const handleToggleItem = (id: string) => {
    if (selectedItemIds.includes(id)) {
      if (selectedItemIds.length > 1) {
        setSelectedItemIds(selectedItemIds.filter(itemId => itemId !== id));
      }
    } else {
      setSelectedItemIds([...selectedItemIds, id]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPrescriptionFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!patientName.trim()) {
      setErrorMsg('Please enter the patient name.');
      return;
    }
    if (!mobile.trim() || mobile.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!preferredDate) {
      setErrorMsg('Please select a preferred appointment date.');
      return;
    }
    if (serviceType === 'home' && (!address.trim() || !pincode.trim())) {
      setErrorMsg('Please provide your complete address and pincode for home sample collection.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const refNumber = `MCD-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
      const bookingData: BookingRequest = {
        id: `bk-${Date.now()}`,
        referenceNumber: refNumber,
        patientName,
        age: Number(age) || 30,
        gender,
        mobile,
        email: email || `${mobile}@patient.microcells.com`,
        serviceType,
        address,
        city: city || 'Central District',
        pincode,
        preferredDate,
        preferredTimeSlot,
        selectedTests: selectedItemsData.filter(i => i.type === 'test').map(i => i.name),
        selectedPackages: selectedItemsData.filter(i => i.type === 'package').map(i => i.name),
        totalAmount,
        notes,
        prescriptionAttached: !!prescriptionFile,
        prescriptionFileName: prescriptionFile ? prescriptionFile.name : undefined,
        createdAt: new Date().toISOString(),
        status: 'Confirmed'
      };

      setSubmittedBooking(bookingData);
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200 relative my-8">
        
        {/* Modal Top Bar */}
        <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-teal-900 text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-teal-300">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold tracking-tight">
                {submittedBooking ? 'Booking Confirmation' : 'Schedule Diagnostic Test / Package'}
              </h3>
              <p className="text-xs text-teal-200">
                {submittedBooking ? 'Your appointment has been registered successfully' : 'Accurate testing with trained phlebotomists & timely reporting'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {submittedBooking ? (
          <div className="p-6 sm:p-8 space-y-6 text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="inline-block px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-full mb-2">
                Booking Confirmed
              </span>
              <h4 className="text-2xl font-extrabold text-slate-900">
                Thank You, {submittedBooking.patientName}!
              </h4>
              <p className="text-sm text-slate-500 mt-1">
                Your diagnostic booking request has been securely registered.
              </p>
            </div>

            {/* Reference Box */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-left space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <span className="text-xs text-slate-500 font-medium">Booking Reference ID:</span>
                <span className="text-sm font-mono font-extrabold text-blue-900 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                  {submittedBooking.referenceNumber}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block">Service Type:</span>
                  <span className="font-semibold text-slate-800 capitalize">
                    {submittedBooking.serviceType === 'home' ? 'Home Sample Collection' : 'Laboratory Walk-in'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Scheduled Slot:</span>
                  <span className="font-semibold text-slate-800">
                    {submittedBooking.preferredDate} ({submittedBooking.preferredTimeSlot.split(' ')[0]})
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Mobile Number:</span>
                  <span className="font-semibold text-slate-800">{submittedBooking.mobile}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Total Payable:</span>
                  <span className="font-bold text-slate-900 text-sm">₹{submittedBooking.totalAmount}</span>
                </div>
              </div>

              {submittedBooking.serviceType === 'home' && (
                <div className="pt-2 border-t border-slate-200 text-xs">
                  <span className="text-slate-400 block">Collection Address:</span>
                  <span className="text-slate-700 font-medium">
                    {submittedBooking.address}, {submittedBooking.city} - {submittedBooking.pincode}
                  </span>
                </div>
              )}
            </div>

            {/* Next Steps Notification */}
            <div className="bg-blue-50/70 p-4 rounded-xl text-left border border-blue-100 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-600 space-y-1">
                <p className="font-semibold text-blue-950">What happens next?</p>
                <p>1. An SMS & WhatsApp confirmation has been dispatched to {submittedBooking.mobile}.</p>
                <p>2. Our phlebotomist team will call 30 minutes prior to arrival for sample collection.</p>
                <p>3. Reports will be available within 4–8 hours online via your UHID.</p>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={onClose}
                className="flex-1 py-3 bg-blue-900 hover:bg-blue-800 text-white rounded-xl font-semibold text-sm transition-all"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-7 space-y-5 max-h-[80vh] overflow-y-auto">
            
            {errorMsg && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* 1. Service Type Switch */}
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                Select Service Location:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setServiceType('home')}
                  className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all text-left ${
                    serviceType === 'home'
                      ? 'border-teal-600 bg-teal-50/70 text-teal-950 ring-2 ring-teal-500/20'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    serviceType === 'home' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    <Home className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold block">Home Collection</span>
                    <span className="text-[10px] text-slate-500">Phlebotomist visits you</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setServiceType('lab')}
                  className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all text-left ${
                    serviceType === 'lab'
                      ? 'border-blue-700 bg-blue-50/70 text-blue-950 ring-2 ring-blue-500/20'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    serviceType === 'lab' ? 'bg-blue-900 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold block">Visit Laboratory</span>
                    <span className="text-[10px] text-slate-500">Walk-in at reference center</span>
                  </div>
                </button>
              </div>
            </div>

            {/* 2. Selected Items Summary */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700">
                  Selected Tests / Packages ({selectedItemsData.length})
                </span>
                <span className="text-xs font-bold text-blue-900">
                  Subtotal: ₹{subtotal}
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                {selectedItemsData.map(item => (
                  <span 
                    key={item.id}
                    className="inline-flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-xs text-slate-800 shadow-2xs font-medium"
                  >
                    <span>{item.name}</span>
                    <span className="text-slate-400 font-mono text-[10px]">₹{item.price}</span>
                    {selectedItemsData.length > 1 && (
                      <button 
                        type="button"
                        onClick={() => handleToggleItem(item.id)}
                        className="text-slate-400 hover:text-rose-500 ml-1"
                      >
                        ×
                      </button>
                    )}
                  </span>
                ))}
              </div>
            </div>

            {/* 3. Patient Details */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Patient Information:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-600 block mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-600 block mb-1">
                    Mobile Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      placeholder="10-digit mobile number"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value.replace(/[^0-9]/g, ''))}
                      maxLength={10}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-600 block mb-1">
                    Age <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 35"
                    min="1"
                    max="110"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-600 block mb-1">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-600 block mb-1">
                    Email Address (Optional)
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      placeholder="For PDF reports"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Schedule Date & Time Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1">
                  Preferred Date <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="date"
                    required
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1">
                  Preferred Time Slot
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <select
                    value={preferredTimeSlot}
                    onChange={(e) => setPreferredTimeSlot(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                  >
                    {timeSlots.map((slot, i) => (
                      <option key={i} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* 5. Address (if home collection) */}
            {serviceType === 'home' && (
              <div className="space-y-3 pt-1">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Collection Address:
                </span>
                <div>
                  <textarea
                    required
                    rows={2}
                    placeholder="House/Flat No., Street, Building/Apartment, Landmark"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="City / Area"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Pincode (e.g. 400001)"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/[^0-9]/g, ''))}
                    maxLength={6}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
                  />
                </div>
              </div>
            )}

            {/* 6. Prescription Upload & Notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1">
                  Upload Doctor's Prescription (Optional)
                </label>
                <div className="border border-dashed border-slate-300 rounded-xl p-2.5 text-center hover:bg-slate-50 transition-colors relative cursor-pointer">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <div className="flex items-center justify-center gap-2 text-xs text-slate-600">
                    <UploadCloud className="w-4 h-4 text-teal-600 shrink-0" />
                    <span className="truncate">
                      {prescriptionFile ? prescriptionFile.name : 'Select or drop Rx file'}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1">
                  Special Instructions / Symptoms
                </label>
                <input
                  type="text"
                  placeholder="e.g., Hard to find vein, senior citizen"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* Summary & Submit Button */}
            <div className="pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between mb-3 text-xs">
                <span className="text-slate-500">
                  {serviceType === 'home' ? 'Home Collection Fee:' : 'Walk-in Collection:'}
                </span>
                <span className="font-semibold text-slate-700">
                  {serviceType === 'home' ? (homeCollectionFee === 0 ? 'FREE' : `₹${homeCollectionFee}`) : 'FREE'}
                </span>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-xs text-slate-500 block">Total Payable at Collection:</span>
                  <span className="text-xl font-extrabold text-blue-950">₹{totalAmount}</span>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-950/20 transition-all flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <span>Processing...</span>
                    ) : (
                      <>
                        <span>Submit Booking Request</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
