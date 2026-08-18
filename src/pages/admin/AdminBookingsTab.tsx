import React, { useState } from 'react';
import { 
  CalendarCheck, 
  Search, 
  Plus, 
  Trash2, 
  Phone, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  X,
  ExternalLink,
  DollarSign
} from 'lucide-react';
import { BookingRequest } from '../../types';
import { useData } from '../../context/DataContext';

interface AdminBookingsTabProps {
  onShowToast: (msg: string) => void;
}

const STATUS_LIST: BookingRequest['status'][] = [
  'Confirmed',
  'Sample Collection Scheduled',
  'Sample Received',
  'Processing',
  'Report Ready'
];

export const AdminBookingsTab: React.FC<AdminBookingsTabProps> = ({ onShowToast }) => {
  const { bookings, addBooking, updateBookingStatus, deleteBooking } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<'all' | 'home' | 'lab'>('all');

  const [activeBooking, setActiveBooking] = useState<BookingRequest | null>(null);
  const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState(false);

  // New Booking Form State
  const [patientName, setPatientName] = useState('');
  const [age, setAge] = useState<number>(35);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [serviceType, setServiceType] = useState<'home' | 'lab'>('home');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('400001');
  const [preferredDate, setPreferredDate] = useState(new Date().toISOString().slice(0, 10));
  const [preferredTimeSlot, setPreferredTimeSlot] = useState('07:00 AM – 08:00 AM');
  const [testsInput, setTestsInput] = useState('Complete Blood Count (CBC)');
  const [totalAmount, setTotalAmount] = useState<number>(350);
  const [notes, setNotes] = useState('');

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = 
      b.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.mobile.includes(searchQuery) ||
      b.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || b.status === selectedStatus;
    const matchesType = selectedType === 'all' || b.serviceType === selectedType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleDelete = (id: string, ref: string) => {
    if (window.confirm(`Are you sure you want to delete appointment record "${ref}"?`)) {
      deleteBooking(id);
      if (activeBooking?.id === id) setActiveBooking(null);
      onShowToast(`Deleted appointment ${ref}`);
    }
  };

  const handleCreateManualBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim() || !mobile.trim()) {
      alert('Please fill in patient name and contact number.');
      return;
    }

    const testArray = testsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const refNumber = `MCD-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    addBooking({
      referenceNumber: refNumber,
      patientName: patientName.trim(),
      age: Number(age) || 30,
      gender,
      mobile: mobile.trim(),
      email: email.trim() || `${mobile.trim()}@patient.microcells.com`,
      serviceType,
      address: serviceType === 'home' ? address.trim() : undefined,
      city: 'Central District',
      pincode: serviceType === 'home' ? pincode.trim() : undefined,
      preferredDate,
      preferredTimeSlot,
      selectedTests: testArray,
      selectedPackages: [],
      totalAmount: Number(totalAmount) || 500,
      notes: notes.trim(),
      status: 'Confirmed'
    });

    onShowToast(`Created booking ${refNumber} for ${patientName}`);
    setIsNewBookingModalOpen(false);
  };

  const getStatusColor = (status: BookingRequest['status']) => {
    switch (status) {
      case 'Confirmed': return 'bg-sky-100 text-sky-800 border-sky-200';
      case 'Sample Collection Scheduled': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Sample Received': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Processing': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Report Ready': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-amber-600" />
            <h2 className="text-xl font-bold text-slate-900 font-display">Patient Appointments & Home Visits</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Track and process doorstep sample collections, laboratory walk-ins, and phlebotomy routing.
          </p>
        </div>

        <button
          onClick={() => setIsNewBookingModalOpen(true)}
          className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Manual Appointment</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search patient name, mobile, reference ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Type Filter */}
          <div className="flex rounded-xl bg-slate-100 p-1">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                selectedType === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setSelectedType('home')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                selectedType === 'home' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              🏠 Home Visit
            </button>
            <button
              onClick={() => setSelectedType('lab')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                selectedType === 'lab' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              🏥 Lab Walk-in
            </button>
          </div>

          {/* Status Dropdown */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="All">All Statuses</option>
            {STATUS_LIST.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700">
            Total Appointments: <strong className="text-amber-700">{filteredBookings.length}</strong>
          </span>
          <span className="text-[11px] text-slate-400">Update status directly using dropdown</span>
        </div>

        {filteredBookings.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <CalendarCheck className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700">No appointments found</h3>
            <p className="text-xs text-slate-400">All filtered bookings have been resolved or none match.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredBookings.map((b) => (
              <div 
                key={b.id}
                className="p-4 sm:p-6 hover:bg-slate-50/70 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                {/* Patient Info */}
                <div className="space-y-2 min-w-0 max-w-xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900">
                      {b.patientName}
                    </span>
                    <span className="text-xs text-slate-400">({b.gender}, {b.age} yrs)</span>

                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                      b.serviceType === 'home' ? 'bg-purple-50 text-purple-800 border-purple-200' : 'bg-sky-50 text-sky-800 border-sky-200'
                    }`}>
                      {b.serviceType === 'home' ? '🏠 Home Collection' : '🏥 Lab Visit'}
                    </span>

                    <span className="text-[11px] font-mono text-slate-500">
                      Ref: {b.referenceNumber}
                    </span>
                  </div>

                  <p className="text-xs font-medium text-slate-700">
                    <strong>Tests:</strong> {b.selectedTests.concat(b.selectedPackages).join(', ') || 'Prescription Attached'}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{b.preferredDate} ({b.preferredTimeSlot})</span>
                    </span>

                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <a href={`tel:${b.mobile}`} className="hover:underline text-teal-700 font-semibold">{b.mobile}</a>
                    </span>

                    {b.address && (
                      <span className="flex items-center gap-1 truncate max-w-xs">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{b.address} (PIN: {b.pincode})</span>
                      </span>
                    )}
                  </div>

                  {b.notes && (
                    <p className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200/60 inline-block">
                      <strong>Patient Note:</strong> {b.notes}
                    </p>
                  )}
                </div>

                {/* Status selector & Actions */}
                <div className="flex items-center justify-between lg:justify-end gap-4 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-900 block">₹{b.totalAmount}</span>
                    <span className="text-[10px] text-slate-400">Booked: {b.createdAt}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={b.status}
                      onChange={(e) => updateBookingStatus(b.id, e.target.value as BookingRequest['status'])}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-teal-500 ${getStatusColor(b.status)}`}
                    >
                      {STATUS_LIST.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>

                    <button
                      onClick={() => setActiveBooking(b)}
                      className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
                    >
                      Details
                    </button>

                    <button
                      onClick={() => handleDelete(b.id, b.referenceNumber)}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                      title="Delete Record"
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

      {/* Booking Details Modal */}
      {activeBooking && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-display">
                  Appointment Reference: {activeBooking.referenceNumber}
                </h3>
                <p className="text-xs text-slate-500">Created on {activeBooking.createdAt}</p>
              </div>
              <button
                onClick={() => setActiveBooking(null)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Patient Name:</span>
                  <span className="font-bold text-slate-900">{activeBooking.patientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Age / Gender:</span>
                  <span className="font-bold text-slate-900">{activeBooking.age} yrs / {activeBooking.gender}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Contact Number:</span>
                  <span className="font-bold text-teal-700">{activeBooking.mobile}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Email:</span>
                  <span className="font-bold text-slate-900">{activeBooking.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Service Mode:</span>
                  <span className="font-bold text-slate-900">
                    {activeBooking.serviceType === 'home' ? 'Home Sample Collection' : 'Lab Diagnostic Center'}
                  </span>
                </div>
                {activeBooking.address && (
                  <div className="pt-2 border-t border-slate-200/80">
                    <span className="text-slate-500 block mb-1">Collection Address:</span>
                    <p className="font-semibold text-slate-800">{activeBooking.address}, PIN: {activeBooking.pincode}</p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <span className="font-bold text-slate-800">Selected Pathology Tests & Packages:</span>
                <ul className="list-disc pl-5 space-y-1 text-slate-700 font-medium">
                  {activeBooking.selectedTests.concat(activeBooking.selectedPackages).map((t, idx) => (
                    <li key={idx}>{t}</li>
                  ))}
                  {activeBooking.selectedTests.length === 0 && activeBooking.selectedPackages.length === 0 && (
                    <li>Doctor Prescription Uploaded (Tests to be verified by lab)</li>
                  )}
                </ul>
              </div>

              {activeBooking.notes && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900">
                  <p className="font-bold">Patient Special Instructions:</p>
                  <p className="mt-0.5">{activeBooking.notes}</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 font-bold text-sm">
                <span>Total Amount:</span>
                <span className="text-teal-800">₹{activeBooking.totalAmount}</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <a
                href={`https://wa.me/91${activeBooking.mobile}?text=Hello%20${encodeURIComponent(activeBooking.patientName)},%20your%20Micro%20Cells%20Diagnostics%20appointment%20(${activeBooking.referenceNumber})%20is%20status:%20${encodeURIComponent(activeBooking.status)}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs transition-all flex items-center gap-1.5"
              >
                <span>WhatsApp Patient</span>
              </a>
              <button
                onClick={() => setActiveBooking(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Booking Modal */}
      {isNewBookingModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8 space-y-6 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-display">
                  Record Manual / Walk-in Appointment
                </h3>
                <p className="text-xs text-slate-500">Record a patient booking received via telephone or desk counter.</p>
              </div>
              <button
                onClick={() => setIsNewBookingModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateManualBooking} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-700">Patient Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rameshwar Dayal"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Age</label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit mobile"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Service Mode</label>
                  <select
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                  >
                    <option value="home">Home Sample Collection</option>
                    <option value="lab">Lab Walk-in</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Preferred Date</label>
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              {serviceType === 'home' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs font-bold text-slate-700">Address</label>
                    <input
                      type="text"
                      placeholder="Door / Building / Street"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Pincode</label>
                    <input
                      type="text"
                      placeholder="400001"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Tests (Comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Complete Blood Count (CBC), Lipid Profile, Fasting Blood Sugar"
                  value={testsInput}
                  onChange={(e) => setTestsInput(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Total Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={totalAmount}
                    onChange={(e) => setTotalAmount(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Time Slot</label>
                  <input
                    type="text"
                    value={preferredTimeSlot}
                    onChange={(e) => setPreferredTimeSlot(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewBookingModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  Confirm Booking
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
