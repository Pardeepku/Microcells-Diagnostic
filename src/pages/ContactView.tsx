import React, { useState } from 'react';
import { 
  Building2, 
  Phone, 
  MessageSquare, 
  Mail, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Send, 
  CheckCircle2, 
  Map,
  ChevronRight,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { PageType } from '../types';
import { useData } from '../context/DataContext';

interface ContactViewProps {
  onNavigate: (page: PageType, param?: string) => void;
}

export const ContactView: React.FC<ContactViewProps> = ({ onNavigate }) => {
  const { labInfo, siteContent } = useData();

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    subject: 'General Diagnostic Inquiry',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  const whatsappClean = labInfo.whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <div className="min-h-screen bg-slate-50/60 pb-24">
      
      {/* Breadcrumb Header */}
      <div className="bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <button onClick={() => onNavigate('home')} className="hover:text-teal-600 transition-colors">
              Home
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-bold">Contact & Diagnostic Centres</span>
          </div>
        </div>
      </div>

      {/* Hero Header */}
      <section className="bg-slate-900 text-white py-14 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-radial from-teal-900/30 to-slate-950/80 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-500/20 text-teal-300 border border-teal-500/30 rounded-full text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Customer Desk & Phlebotomy Support</span>
          </span>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white font-display">
            {siteContent.contact?.headline || 'We Are Here To Assist You'}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            {siteContent.contact?.subheadline || 'Have inquiries about tests, sample preparation, report delivery, or doorstep collection? Reach our clinical team directly.'}
          </p>
        </div>
      </section>

      {/* Main Grid: Direct Contact Cards + Form */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 space-y-8">
        
        {/* 4 Fast Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* WhatsApp Direct */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-lg shadow-slate-200/50 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">WhatsApp Instant Chat</h3>
                <p className="text-xs text-slate-500 mt-0.5">Quick booking & report inquiries</p>
              </div>
              <p className="text-sm font-mono font-bold text-slate-900">{labInfo.whatsappDisplay}</p>
            </div>
            <a
              href={`https://wa.me/${whatsappClean}?text=Hello%20Microcells%20Diagnostics,%20I%20have%20an%20inquiry`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5"
            >
              <span>Chat on WhatsApp</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Primary Phone */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-lg shadow-slate-200/50 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Laboratory Helpline</h3>
                <p className="text-xs text-slate-500 mt-0.5">Direct phone assistance</p>
              </div>
              <p className="text-sm font-mono font-bold text-slate-900">{labInfo.phone}</p>
            </div>
            <a
              href={`tel:${labInfo.phone.replace(/[^0-9+]/g, '')}`}
              className="py-2.5 px-4 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition-all text-center"
            >
              Call Helpline
            </a>
          </div>

          {/* Email Support */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-lg shadow-slate-200/50 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Email Inquiries</h3>
                <p className="text-xs text-slate-500 mt-0.5">Corporate & diagnostic reports</p>
              </div>
              <p className="text-xs font-medium text-slate-900 truncate">{labInfo.email}</p>
            </div>
            <a
              href={`mailto:${labInfo.email}`}
              className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all text-center"
            >
              Send Email
            </a>
          </div>

          {/* Operational Timings */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-lg shadow-slate-200/50 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Operating Hours</h3>
                <p className="text-xs text-slate-500 mt-0.5">Daily home collection & lab visits</p>
              </div>
              <p className="text-xs text-slate-700 leading-snug">{labInfo.timings}</p>
            </div>
            <div className="py-2 px-3 bg-amber-50 rounded-xl text-[11px] font-bold text-amber-800 text-center">
              Open 7 Days a Week
            </div>
          </div>

        </div>

        {/* Contact Form & Main Headquarters Address */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Message Inquiry Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xl shadow-slate-200/40 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900 font-display">
                Send an Online Inquiry
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Fill in the details below and our medical team will get in touch with you shortly.
              </p>
            </div>

            {formSubmitted ? (
              <div className="p-8 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-emerald-900">Inquiry Received Successfully</h4>
                <p className="text-xs text-emerald-700 max-w-sm mx-auto">
                  Thank you, {formData.fullName}. Our diagnostic coordinator will contact you at {formData.phone} shortly.
                </p>
                <button
                  onClick={() => {
                    setFormSubmitted(false);
                    setFormData({ fullName: '', phone: '', email: '', subject: 'General Diagnostic Inquiry', message: '' });
                  }}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">Email Address</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your.email@example.com"
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">Inquiry Subject</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="General Diagnostic Inquiry">General Diagnostic Inquiry</option>
                      <option value="Home Sample Collection Booking">Home Sample Collection Booking</option>
                      <option value="Health Package Consultation">Health Package Consultation</option>
                      <option value="Report Status or Clarification">Report Status or Clarification</option>
                      <option value="Corporate / Institutional Testing">Corporate / Institutional Testing</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Message / Details *</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about the tests you require, preferred appointment date, or specific health inquiries..."
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-teal-900/15 transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Inquiry</span>
                </button>
              </form>
            )}
          </div>

          {/* Right: Headquarters & Collection Branches */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Headquarters Card */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-teal-500/20 text-teal-400 rounded-xl">
                  <Building2 className="w-5 h-5" />
                </span>
                <div>
                  <h4 className="text-base font-bold text-white font-display">
                    {labInfo.tradeName} Headquarters
                  </h4>
                  <span className="text-[11px] text-teal-400 font-semibold">Central Processing Laboratory</span>
                </div>
              </div>

              <div className="space-y-3 pt-2 text-xs text-slate-300">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <span>{labInfo.address}</span>
                </div>

                {labInfo.landmark && (
                  <div className="flex items-center gap-2.5 text-slate-400">
                    <span className="font-semibold text-slate-300">Landmark:</span>
                    <span>{labInfo.landmark}</span>
                  </div>
                )}

                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>{labInfo.timings}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">{labInfo.nablAccreditationText}</span>
                <button
                  onClick={() => onNavigate('book-test')}
                  className="px-3.5 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-lg text-xs transition-all"
                >
                  Book Appointment
                </button>
              </div>
            </div>

            {/* Collection Branches List */}
            {labInfo.branches && labInfo.branches.length > 0 && (
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                <h4 className="text-sm font-bold text-slate-900">Regional Collection Centres</h4>
                <div className="space-y-3">
                  {labInfo.branches.map((branch, idx) => (
                    <div key={branch.id || idx} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">{branch.name}</span>
                        <span className="text-[10px] font-semibold text-teal-700">{branch.hours}</span>
                      </div>
                      <p className="text-[11px] text-slate-500">{branch.address}</p>
                      <p className="text-[11px] font-mono text-slate-600">Ph: {branch.phone}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </section>

    </div>
  );
};
