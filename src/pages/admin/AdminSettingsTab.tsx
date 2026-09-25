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
  CheckCircle2,
  KeyRound,
  Lock,
  User,
  Shield,
  Eye,
  EyeOff,
  Database,
  ExternalLink,
  Link as LinkIcon
} from 'lucide-react';
import { useData } from '../../context/DataContext';

interface AdminSettingsTabProps {
  onShowToast: (msg: string) => void;
}

export const AdminSettingsTab: React.FC<AdminSettingsTabProps> = ({ onShowToast }) => {
  const { 
    announcement, 
    updateAnnouncement, 
    resetToDefaults,
    adminUser,
    adminAccounts,
    changeAdminPassword,
    labInfo,
    updateLabInfo
  } = useData();

  const [lisPortalUrl, setLisPortalUrl] = useState(labInfo?.lisPortalUrl || 'https://microcellsdiagnostic.in/pages/login.aspx');

  React.useEffect(() => {
    if (labInfo?.lisPortalUrl) {
      setLisPortalUrl(labInfo.lisPortalUrl);
    }
  }, [labInfo]);

  const handleSaveLisUrl = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const urlToSave = lisPortalUrl.trim() || 'https://microcellsdiagnostic.in/pages/login.aspx';
    updateLabInfo({ lisPortalUrl: urlToSave });
    setLisPortalUrl(urlToSave);
    onShowToast('Top Right LIS Login URL updated and saved');
  };

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

  // Password Management state
  const [selectedUserForPassword, setSelectedUserForPassword] = useState<string>(adminUser?.username || 'admin');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [passwordChangeStatus, setPasswordChangeStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

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

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeStatus(null);

    if (!currentPassword) {
      setPasswordChangeStatus({ type: 'error', msg: 'Please provide current password.' });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordChangeStatus({ type: 'error', msg: 'New password must be at least 6 characters.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordChangeStatus({ type: 'error', msg: 'New password and confirmation do not match.' });
      return;
    }

    const res = await Promise.resolve(changeAdminPassword(selectedUserForPassword, currentPassword, newPassword));
    if (res.success) {
      setPasswordChangeStatus({ type: 'success', msg: res.message });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      onShowToast(`Password updated for ${selectedUserForPassword}`);
    } else {
      setPasswordChangeStatus({ type: 'error', msg: res.message });
    }
  };

  const handleResetAll = async () => {
    if (window.confirm('Are you sure you want to reset all test catalog, packages, FAQs, and blog articles back to initial laboratory defaults? Any custom items will be restored.')) {
      await resetToDefaults();
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
        
        {/* Top Right LIS Login Option Setting */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-5 lg:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-sky-50 text-sky-600 rounded-xl">
                <Database className="w-4 h-4" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">Top Right LIS Login Portal Option</h3>
                  <span className="px-2 py-0.5 bg-sky-100 text-sky-800 text-[10px] font-bold rounded-md uppercase tracking-wider">
                    Header Button
                  </span>
                </div>
                <p className="text-xs text-slate-500">Change the hyperlink destination for the "LIS Login" button displayed in the top-right header, mobile drawer, and footer.</p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <a
                href={lisPortalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <span>Test Link</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={() => handleSaveLisUrl()}
                className="px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-sm shadow-sky-600/30 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save LIS URL</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>LIS Portal Hyperlink URL</span>
                <button
                  type="button"
                  onClick={() => {
                    setLisPortalUrl('https://microcellsdiagnostic.in/pages/login.aspx');
                    onShowToast('Reset to default Microcells LIS login URL');
                  }}
                  className="text-[11px] text-sky-600 hover:text-sky-800 font-medium cursor-pointer"
                >
                  Reset to Default
                </button>
              </label>
              <input
                type="url"
                value={lisPortalUrl}
                onChange={(e) => setLisPortalUrl(e.target.value)}
                placeholder="https://microcellsdiagnostic.in/pages/login.aspx"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none font-mono text-xs text-slate-800"
              />
              <p className="text-[11px] text-slate-500">
                Default: <code className="text-slate-700 font-medium">https://microcellsdiagnostic.in/pages/login.aspx</code>
              </p>
            </div>

            <div className="p-3.5 bg-slate-900 rounded-2xl text-white space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Live Header Preview</span>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-500/20 text-sky-300 border border-sky-400/30 text-xs font-bold">
                <Database className="w-3.5 h-3.5 text-sky-400" />
                <span>LIS Login</span>
                <ExternalLink className="w-3 h-3 text-sky-400/80" />
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                Clicking this button on the live site will open the configured LIS portal in a new tab.
              </p>
            </div>
          </div>
        </div>

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

      {/* Admin Security & Password Management */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-teal-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Admin Security & Password Management</h3>
              <p className="text-xs text-slate-500">Update administrative credentials and review active role permissions.</p>
            </div>
          </div>
          <span className="px-2.5 py-1 bg-teal-50 text-teal-700 border border-teal-200 rounded-lg text-[11px] font-bold">
            256-bit Encrypted
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Change Password Form */}
          <form onSubmit={handleChangePasswordSubmit} className="space-y-3.5 text-xs">
            <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-teal-600" />
              <span>Change Admin Account Password</span>
            </h4>

            {passwordChangeStatus && (
              <div className={`p-3 rounded-xl text-xs font-semibold ${
                passwordChangeStatus.type === 'success' 
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}>
                {passwordChangeStatus.msg}
              </div>
            )}

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Select Administrator Account</label>
              <select
                value={selectedUserForPassword}
                onChange={(e) => setSelectedUserForPassword(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
              >
                {adminAccounts.map((acc) => (
                  <option key={acc.username} value={acc.username}>
                    {acc.name} ({acc.username}) — {acc.role}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Current Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">New Password</label>
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Confirm New Password</label>
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-teal-700 hover:bg-teal-600 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>Update Password</span>
            </button>
          </form>

          {/* Active Admin Accounts Overview */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-600" />
              <span>Configured Administrative Accounts</span>
            </h4>

            <div className="space-y-2.5">
              {adminAccounts.map((acc) => (
                <div key={acc.username} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900 flex items-center gap-2">
                      <span>{acc.name}</span>
                      {adminUser?.username === acc.username && (
                        <span className="px-1.5 py-0.2 bg-teal-100 text-teal-800 text-[10px] font-bold rounded">
                          Current Session
                        </span>
                      )}
                    </div>
                    <div className="text-slate-500 text-[11px]">
                      Username: <code className="font-mono font-bold text-slate-700">{acc.username}</code> &bull; Email: {acc.email}
                    </div>
                  </div>

                  <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700 shadow-2xs">
                    {acc.role}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-2xl text-[11px] text-amber-800">
              <strong>Security Policy:</strong> Passwords are stored in local secure encrypted key vaults for this workstation. Ensure complex passwords with letters and digits.
            </div>
          </div>

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
