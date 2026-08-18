import React, { useState } from 'react';
import { 
  Settings, 
  Megaphone, 
  Building2, 
  Phone, 
  Mail, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Save, 
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { useData } from '../../context/DataContext';

interface AdminSettingsTabProps {
  onShowToast: (msg: string) => void;
}

export const AdminSettingsTab: React.FC<AdminSettingsTabProps> = ({ onShowToast }) => {
  const { announcement, updateAnnouncement, resetToDefaults } = useData();

  // Announcement state
  const [enabled, setEnabled] = useState(announcement.enabled);
  const [message, setMessage] = useState(announcement.message);
  const [type, setType] = useState(announcement.type);
  const [linkText, setLinkText] = useState(announcement.linkText || '');
  const [linkPage, setLinkPage] = useState(announcement.linkPage || '');

  // Lab general details
  const [labPhone, setLabPhone] = useState('+91 98765 43210');
  const [labEmail, setLabEmail] = useState('care@microcells.com');
  const [labAddress, setLabAddress] = useState('Shop 12-14, Health Plaza, Central Medical Enclave, Mumbai - 400001');
  const [nablCert, setNablCert] = useState('NABL Accreditation No: MC-2024-8841');
  const [timings, setTimings] = useState('Mon - Sat: 06:30 AM – 09:00 PM | Sun: 07:00 AM – 02:00 PM');
  const [homeCollectionMin, setHomeCollectionMin] = useState<number>(500);

  const handleSaveAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    updateAnnouncement({
      enabled,
      message,
      type,
      linkText: linkText.trim() || undefined,
      linkPage: linkPage.trim() || undefined
    });
    onShowToast('Announcement banner updated successfully');
  };

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    onShowToast('Lab configuration parameters saved');
  };

  const handleResetAll = () => {
    if (window.confirm('Are you sure you want to reset all test catalog, packages, FAQs, and blog articles back to initial laboratory defaults? Any custom items will be restored.')) {
      resetToDefaults();
      onShowToast('Reset all database records to initial default state');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-slate-700" />
          <h2 className="text-xl font-bold text-slate-900 font-display">Laboratory & Website Settings</h2>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Control top announcement ribbons, emergency contact lines, diagnostic centers, and operational hours.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Top Announcement Banner Settings */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Megaphone className="w-4 h-4 text-amber-600" />
            <h3 className="text-sm font-bold text-slate-900">Website Announcement Ribbon</h3>
          </div>

          <form onSubmit={handleSaveAnnouncement} className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-700">Display Top Announcement Bar</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => setEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-600"></div>
              </label>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Announcement Message</label>
              <textarea
                rows={2}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="e.g. Special Monsoon Health Checkup @ 50% Off. Book home visit today!"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Banner Style / Tone</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                >
                  <option value="promotional">Promotional (Teal/Emerald)</option>
                  <option value="info">Informational (Sky Blue)</option>
                  <option value="warning">Important Alert (Amber)</option>
                  <option value="success">Accreditation Milestone (Green)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Action Button Label</label>
                <input
                  type="text"
                  placeholder="e.g. Book Home Visit"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>
            </div>

            {/* Live Preview */}
            <div className="pt-2">
              <span className="text-[11px] font-bold text-slate-400 block mb-1">Live Banner Preview:</span>
              <div className={`p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between ${
                type === 'promotional' ? 'bg-teal-900 text-teal-100' :
                type === 'warning' ? 'bg-amber-800 text-amber-100' :
                type === 'success' ? 'bg-emerald-900 text-emerald-100' :
                'bg-sky-950 text-sky-100'
              }`}>
                <span className="line-clamp-1">{message || 'Announcement message preview'}</span>
                {linkText && (
                  <span className="px-2 py-0.5 bg-white/20 rounded-md text-[10px] whitespace-nowrap ml-2">
                    {linkText} →
                  </span>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4 text-teal-400" />
              <span>Save Announcement Settings</span>
            </button>
          </form>
        </div>

        {/* General Lab Configuration */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Building2 className="w-4 h-4 text-sky-700" />
            <h3 className="text-sm font-bold text-slate-900">Laboratory Contact & Accreditations</h3>
          </div>

          <form onSubmit={handleSaveGeneral} className="space-y-3.5 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Helpline / WhatsApp</label>
                <input
                  type="text"
                  value={labPhone}
                  onChange={(e) => setLabPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Official Support Email</label>
                <input
                  type="email"
                  value={labEmail}
                  onChange={(e) => setLabEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Headquarters / Main Processing Facility</label>
              <input
                type="text"
                value={labAddress}
                onChange={(e) => setLabAddress(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Accreditation Certifications</label>
              <input
                type="text"
                value={nablCert}
                onChange={(e) => setNablCert(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Operating Lab Hours</label>
              <input
                type="text"
                value={timings}
                onChange={(e) => setTimings(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Free Home Collection Minimum Cart (₹)</label>
              <input
                type="number"
                value={homeCollectionMin}
                onChange={(e) => setHomeCollectionMin(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-sky-900 hover:bg-sky-800 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4 text-sky-300" />
              <span>Update Laboratory Info</span>
            </button>
          </form>
        </div>

      </div>

      {/* Danger Zone: Factory Reset */}
      <div className="p-6 rounded-3xl bg-rose-50/50 border border-rose-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-rose-950">Factory Default Reset</h4>
          <p className="text-xs text-rose-700 mt-0.5">
            Reset tests catalog, wellness packages, blog articles, and sample FAQs back to default clinical datasets.
          </p>
        </div>

        <button
          onClick={handleResetAll}
          className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 shrink-0"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset All Datasets</span>
        </button>
      </div>

    </div>
  );
};
