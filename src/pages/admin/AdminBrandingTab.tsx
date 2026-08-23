import React, { useState, useRef } from 'react';
import { 
  Building2, 
  Phone, 
  MessageSquare, 
  Mail, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Image as ImageIcon, 
  Upload, 
  Plus, 
  Trash2, 
  Save, 
  CheckCircle2, 
  Globe, 
  Award,
  FileCheck,
  Map,
  X,
  RotateCcw
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { LabInfo, LabBranch } from '../../types';
import { uploadFile } from '../../services/storageService';

interface AdminBrandingTabProps {
  onShowToast: (message: string) => void;
}

export const AdminBrandingTab: React.FC<AdminBrandingTabProps> = ({ onShowToast }) => {
  const { labInfo, updateLabInfo, siteImages, updateSiteImage } = useData();

  const [formData, setFormData] = useState<LabInfo>(labInfo);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingHeaderLogo, setIsUploadingHeaderLogo] = useState(false);
  const [isUploadingFooterLogo, setIsUploadingFooterLogo] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const headerLogoInputRef = useRef<HTMLInputElement>(null);
  const footerLogoInputRef = useRef<HTMLInputElement>(null);

  // Synchronize when external labInfo changes
  React.useEffect(() => {
    setFormData(labInfo);
  }, [labInfo]);

  const handleChange = (field: keyof LabInfo, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    updateLabInfo(formData);
    onShowToast('Laboratory branding, logo and contact details saved to cloud database');
  };

  // Upload Logo
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetKey: 'brandLogoUrl' | 'headerLogoUrl' | 'footerLogoUrl') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (targetKey === 'brandLogoUrl') setIsUploadingLogo(true);
    if (targetKey === 'headerLogoUrl') setIsUploadingHeaderLogo(true);
    if (targetKey === 'footerLogoUrl') setIsUploadingFooterLogo(true);

    try {
      const downloadUrl = await uploadFile(file, 'branding-logos');
      if (targetKey === 'brandLogoUrl') {
        handleChange('brandLogoUrl', downloadUrl);
        updateSiteImage('brandLogoUrl', downloadUrl);
      } else {
        updateSiteImage(targetKey, downloadUrl);
      }
      onShowToast('Logo uploaded and updated successfully');
    } catch (err) {
      console.error('Logo upload error:', err);
      onShowToast('Failed to process image');
    } finally {
      setIsUploadingLogo(false);
      setIsUploadingHeaderLogo(false);
      setIsUploadingFooterLogo(false);
      e.target.value = '';
    }
  };

  // Branch Operations
  const handleAddBranch = () => {
    const newBranch: LabBranch = {
      id: `branch-${Date.now()}`,
      name: 'New Collection Centre',
      address: 'Enter full street address, city, and pincode',
      phone: formData.phone || '+91 98765 43210',
      hours: '7:30 AM – 8:00 PM',
      isHQ: false
    };
    setFormData(prev => ({
      ...prev,
      branches: [...(prev.branches || []), newBranch]
    }));
  };

  const handleUpdateBranch = (index: number, field: keyof LabBranch, value: any) => {
    setFormData(prev => {
      const branches = [...(prev.branches || [])];
      branches[index] = { ...branches[index], [field]: value };
      return { ...prev, branches };
    });
  };

  const handleDeleteBranch = (index: number) => {
    setFormData(prev => ({
      ...prev,
      branches: prev.branches.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="p-2 bg-teal-500/10 text-teal-600 rounded-xl">
              <Building2 className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
              Website Branding, Logo & Contact Details
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
            Manage your official laboratory name, branding logo, WhatsApp helpline, emergency contacts, clinic address, and collection branch centers.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-6 py-3.5 bg-teal-600 hover:bg-teal-500 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-lg shadow-teal-900/15 hover:shadow-teal-900/25 active:scale-98 transition-all flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Branding Changes</span>
        </button>
      </div>

      {/* Grid: Logos & Identity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Logo Upload Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                <ImageIcon className="w-4 h-4" />
              </span>
              <h3 className="text-sm font-bold text-slate-900">Brand Logo</h3>
            </div>
            {formData.brandLogoUrl && (
              <button
                onClick={() => {
                  handleChange('brandLogoUrl', '');
                  updateSiteImage('brandLogoUrl', '');
                }}
                className="text-[11px] text-rose-600 hover:text-rose-700 font-semibold"
              >
                Remove
              </button>
            )}
          </div>

          <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center bg-slate-50/50 min-h-[160px] text-center relative overflow-hidden group">
            {formData.brandLogoUrl ? (
              <div className="space-y-3">
                <div className="p-3 bg-white rounded-xl shadow-xs border border-slate-100 max-w-[220px] max-h-[90px] flex items-center justify-center mx-auto">
                  <img
                    src={formData.brandLogoUrl}
                    alt="Brand Logo"
                    className="max-h-16 max-w-full object-contain"
                  />
                </div>
                <p className="text-[11px] text-slate-500 font-medium">Active Brand Logo</p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-600 flex items-center justify-center mx-auto">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-700">Upload Logo Image</p>
                  <p className="text-[10px] text-slate-400">PNG, SVG, or JPG (Transparent recommended)</p>
                </div>
              </div>
            )}

            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleLogoUpload(e, 'brandLogoUrl')}
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => logoInputRef.current?.click()}
              disabled={isUploadingLogo}
              className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{isUploadingLogo ? 'Uploading...' : 'Choose File'}</span>
            </button>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">Direct Logo URL (Alternative)</label>
            <input
              type="url"
              value={formData.brandLogoUrl || ''}
              onChange={(e) => {
                handleChange('brandLogoUrl', e.target.value);
                updateSiteImage('brandLogoUrl', e.target.value);
              }}
              placeholder="https://example.com/logo.png"
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        {/* Identity & Legal Names */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4 lg:col-span-2">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-teal-50 text-teal-600 rounded-xl">
              <Award className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-bold text-slate-900">Laboratory Identity & Names</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Trade / Display Brand Name</label>
              <input
                type="text"
                value={formData.tradeName}
                onChange={(e) => handleChange('tradeName', e.target.value)}
                placeholder="e.g. Micro Cells Diagnostics"
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Company Legal Registered Name</label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => handleChange('companyName', e.target.value)}
                placeholder="e.g. Microcells Diagnostics Pvt. Ltd."
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Primary Tagline</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => handleChange('tagline', e.target.value)}
                placeholder="e.g. Accurate Diagnostics. Better Healthcare."
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Sub-Tagline / Mission Pitch</label>
              <input
                type="text"
                value={formData.subTagline}
                onChange={(e) => handleChange('subTagline', e.target.value)}
                placeholder="e.g. Advanced pathology testing with reliable results"
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">NABL Accreditation Text</label>
              <input
                type="text"
                value={formData.nablAccreditationText || ''}
                onChange={(e) => handleChange('nablAccreditationText', e.target.value)}
                placeholder="NABL Accredited (MC-2024-8841)"
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">ISO Certification Text</label>
              <input
                type="text"
                value={formData.isoAccreditationText || ''}
                onChange={(e) => handleChange('isoAccreditationText', e.target.value)}
                placeholder="ISO 15189:2022 Certified"
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">ICMR / Reg. License No.</label>
              <input
                type="text"
                value={formData.icmrRegNumber || ''}
                onChange={(e) => handleChange('icmrRegNumber', e.target.value)}
                placeholder="ICMR-REG-IND-9941"
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
        </div>

      </div>

      {/* WhatsApp, Phones & Digital Communications */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex items-center gap-2.5">
          <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
            <MessageSquare className="w-5 h-5" />
          </span>
          <div>
            <h3 className="text-base font-bold text-slate-900">WhatsApp & Phone Helplines</h3>
            <p className="text-xs text-slate-500">Configures the floating WhatsApp button, chat popups, booking SMS and header contact numbers.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp Number</span>
            </label>
            <input
              type="text"
              value={formData.whatsappNumber}
              onChange={(e) => handleChange('whatsappNumber', e.target.value)}
              placeholder="e.g. +919876543210 (Country code included)"
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
            />
            <p className="text-[10px] text-slate-400 mt-1">Used for wa.me/ links</p>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">WhatsApp Display Text</label>
            <input
              type="text"
              value={formData.whatsappDisplay}
              onChange={(e) => handleChange('whatsappDisplay', e.target.value)}
              placeholder="e.g. +91 98765 43210"
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-sky-600" />
              <span>Primary Phone Helpline</span>
            </label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="e.g. +91 98765 43210"
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">Alternate Landline / Phone</label>
            <input
              type="text"
              value={formData.altPhone}
              onChange={(e) => handleChange('altPhone', e.target.value)}
              placeholder="e.g. +91 11 2345 6789"
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-indigo-600" />
              <span>Official Email</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="contact@microcellsdiagnostics.com"
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">Reports Support Email</label>
            <input
              type="email"
              value={formData.supportEmail}
              onChange={(e) => handleChange('supportEmail', e.target.value)}
              placeholder="reports@microcellsdiagnostics.com"
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-rose-600" />
              <span>Emergency 24/7 Helpline</span>
            </label>
            <input
              type="text"
              value={formData.emergencyContact}
              onChange={(e) => handleChange('emergencyContact', e.target.value)}
              placeholder="e.g. +91 98765 43211"
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>Home Collection Timings</span>
            </label>
            <input
              type="text"
              value={formData.homeCollectionTimings}
              onChange={(e) => handleChange('homeCollectionTimings', e.target.value)}
              placeholder="6:30 AM – 7:30 PM (Daily)"
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>
      </div>

      {/* Main Address & Timings */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex items-center gap-2.5">
          <span className="p-2 bg-sky-50 text-sky-600 rounded-xl">
            <MapPin className="w-5 h-5" />
          </span>
          <div>
            <h3 className="text-base font-bold text-slate-900">Headquarters Address & Operational Hours</h3>
            <p className="text-xs text-slate-500">Physical address displayed in website header, contact page, and footer.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-slate-700 block mb-1.5">Full Laboratory Address</label>
            <textarea
              rows={2}
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="Plot 104, Medical Hub & Diagnostic Centre, Healthcare Avenue, Phase-1, City - 400001"
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">Landmark</label>
            <input
              type="text"
              value={formData.landmark}
              onChange={(e) => handleChange('landmark', e.target.value)}
              placeholder="Near Central Metro Station, Gate No. 2"
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">City</label>
            <input
              type="text"
              value={formData.city || ''}
              onChange={(e) => handleChange('city', e.target.value)}
              placeholder="e.g. City / Metropolis"
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">Pincode</label>
            <input
              type="text"
              value={formData.pincode || ''}
              onChange={(e) => handleChange('pincode', e.target.value)}
              placeholder="400001"
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">Lab Working Hours</label>
            <input
              type="text"
              value={formData.timings}
              onChange={(e) => handleChange('timings', e.target.value)}
              placeholder="Mon - Sat: 7:00 AM – 9:00 PM | Sun: 7:00 AM – 2:00 PM"
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>
      </div>

      {/* Branch & Collection Centers Management */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Building2 className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-900">Collection Centres & Regional Branches</h3>
              <p className="text-xs text-slate-500">Manage all sample collection points shown on the contact & branches map.</p>
            </div>
          </div>

          <button
            onClick={handleAddBranch}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Branch</span>
          </button>
        </div>

        <div className="space-y-4">
          {formData.branches?.map((branch, idx) => (
            <div key={branch.id || idx} className="p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={branch.name}
                    onChange={(e) => handleUpdateBranch(idx, 'name', e.target.value)}
                    placeholder="Branch / Center Name"
                    className="text-sm font-bold text-slate-900 bg-transparent border-b border-dashed border-slate-300 focus:border-teal-500 focus:outline-none pb-0.5"
                  />
                  {branch.isHQ && (
                    <span className="px-2 py-0.5 bg-teal-100 text-teal-800 text-[10px] font-bold rounded-md">
                      Headquarters
                    </span>
                  )}
                </div>

                <button
                  onClick={() => handleDeleteBranch(idx)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                  title="Delete branch"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">Branch Address</label>
                  <input
                    type="text"
                    value={branch.address}
                    onChange={(e) => handleUpdateBranch(idx, 'address', e.target.value)}
                    placeholder="Address"
                    className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">Branch Phone</label>
                  <input
                    type="text"
                    value={branch.phone}
                    onChange={(e) => handleUpdateBranch(idx, 'phone', e.target.value)}
                    placeholder="Phone"
                    className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
