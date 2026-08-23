import React, { useState, useRef } from 'react';
import { 
  Image as ImageIcon, 
  Upload, 
  Link2, 
  RotateCcw, 
  Sparkles, 
  Check, 
  Copy, 
  ExternalLink, 
  Search, 
  Filter, 
  Eye, 
  CheckCircle2, 
  AlertCircle, 
  Camera, 
  Layers,
  Maximize2,
  X,
  RefreshCw
} from 'lucide-react';
import { SiteImagesConfig, SiteImageMeta } from '../../types';
import { useData } from '../../context/DataContext';
import { SITE_IMAGE_REGISTRY, DEFAULT_SITE_IMAGES } from '../../data/labData';
import { uploadFile } from '../../services/storageService';

interface AdminImagesTabProps {
  onShowToast: (message: string) => void;
}

// Curated presets for one-click swaps per image category
const CURATED_PRESETS: Record<keyof SiteImagesConfig, { label: string; url: string }[]> = {
  homeHeroBanner: [
    { label: 'Modern Clinical Lab', url: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1000&q=80' },
    { label: 'Automated Diagnostic Line', url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80' },
    { label: 'Microbiology Research Facility', url: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1000&q=80' },
    { label: 'Medical Scientist at Work', url: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=1000&q=80' }
  ],
  homeDoctorPortrait: [
    { label: 'Lead Doctor (Standing Folded Arms)', url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=1200&q=85' },
    { label: 'Senior Consultant Pathologist', url: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=1200&q=85' },
    { label: 'Female Medical Director', url: 'https://images.unsplash.com/photo-1594824813571-638f02614d3f?auto=format&fit=crop&w=1200&q=85' },
    { label: 'Clinical Specialist with Clipboard', url: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=1200&q=85' }
  ],
  homeAboutLab: [
    { label: 'Robotic Analyzer Line', url: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=900&q=80' },
    { label: 'Cleanroom Clinical Lab', url: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=900&q=80' },
    { label: 'Centrifuge & Sample Rack', url: 'https://images.unsplash.com/photo-1583912267670-6575ad4736f8?auto=format&fit=crop&w=900&q=80' }
  ],
  homeCollectionBanner: [
    { label: 'Phlebotomy Sample Collection', url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80' },
    { label: 'Gentle Blood Draw Protocol', url: 'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?auto=format&fit=crop&w=800&q=80' },
    { label: 'Sterile Vacuum Blood Tubes', url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80' }
  ],
  qualityLabEquipment: [
    { label: 'Hematology Analyzer System', url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80' },
    { label: 'High Resolution Optical Microscope', url: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=900&q=80' },
    { label: 'Immunochemistry CLIA Suite', url: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=900&q=80' }
  ],
  prescriptionBanner: [
    { label: 'Prescription & Stethoscope', url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80' },
    { label: 'Doctor Writing Rx Form', url: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80' }
  ],
  patientReportsBanner: [
    { label: 'Digital Medical Charts', url: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80' },
    { label: 'Diagnostic Tablet Analytics', url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80' }
  ],
  contactSupportBanner: [
    { label: 'Diagnostic Support Helpdesk', url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80' },
    { label: 'Laboratory Reception Lounge', url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80' }
  ],
  deptClinicalPathology: [
    { label: 'Urinalysis & Body Fluids', url: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80' },
    { label: 'Microscopic Cell Examination', url: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80' }
  ],
  deptHematology: [
    { label: 'Blood Cell Differential', url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80' },
    { label: 'Coagulation & Plasma Vials', url: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=800&q=80' }
  ],
  deptBiochemistry: [
    { label: 'Spectrophotometer Analysis', url: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80' },
    { label: 'Enzyme & Electrolyte Tubes', url: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80' }
  ],
  deptMicrobiology: [
    { label: 'Petri Dish Culture Isolates', url: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=800&q=80' },
    { label: 'Gram Stain Bacteriology', url: 'https://images.unsplash.com/photo-1583912267670-6575ad4736f8?auto=format&fit=crop&w=800&q=80' }
  ],
  deptSerology: [
    { label: 'ELISA Microplate Titration', url: 'https://images.unsplash.com/photo-1583912267670-6575ad4736f8?auto=format&fit=crop&w=800&q=80' },
    { label: 'Antibody & Antigen Wells', url: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80' }
  ],
  deptPreventive: [
    { label: 'Comprehensive Wellness Profile', url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80' },
    { label: 'Molecular Diagnostics & DNA', url: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=800&q=80' }
  ],
  doctorAnand: [
    { label: 'Dr. Anand (Indian Pathologist)', url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80' },
    { label: 'Senior MD Specialist', url: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=80' }
  ],
  doctorPriya: [
    { label: 'Dr. Priya (Indian Doctor / Microbiologist)', url: 'https://images.unsplash.com/photo-1594824813571-638f02614d3f?auto=format&fit=crop&w=600&q=80' },
    { label: 'Female Medical Director', url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80' }
  ],
  doctorRajesh: [
    { label: 'Dr. Rajesh (Clinical Biochemist)', url: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=80' },
    { label: 'Quality Control Lead', url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80' }
  ],
  brandLogoUrl: [],
  headerLogoUrl: [],
  footerLogoUrl: [],
  faviconUrl: []
};


export const AdminImagesTab: React.FC<AdminImagesTabProps> = ({ onShowToast }) => {
  const { siteImages, updateSiteImage, updateAllSiteImages, resetSiteImages } = useData();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState<string>('All');
  const [editingUrlKey, setEditingUrlKey] = useState<keyof SiteImagesConfig | null>(null);
  const [inputUrlValue, setInputUrlValue] = useState<string>('');
  const [previewModalImage, setPreviewModalImage] = useState<{ title: string; url: string; meta: SiteImageMeta } | null>(null);
  const [confirmResetAll, setConfirmResetAll] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // File input refs map
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const sections: ('All' | SiteImageMeta['section'])[] = [
    'All',
    'Home & Landing',
    'About & Team',
    'Services & Departments',
    'Patient Portals & Banners'
  ];

  // Filtered registry items
  const filteredImages = SITE_IMAGE_REGISTRY.filter(item => {
    const matchesSection = selectedSection === 'All' || item.section === selectedSection;
    const matchesQuery = !searchQuery || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.key.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSection && matchesQuery;
  });

  // Handle URL Save
  const handleSaveUrl = (key: keyof SiteImagesConfig) => {
    if (!inputUrlValue.trim()) {
      onShowToast('Please provide a valid image URL');
      return;
    }
    updateSiteImage(key, inputUrlValue.trim());
    setEditingUrlKey(null);
    setInputUrlValue('');
    onShowToast(`Image updated for "${key}"`);
  };

  // Handle direct file upload (uploads to Firebase Storage with local fallback)
  const handleFileUpload = async (key: keyof SiteImagesConfig, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB recommended)
    if (file.size > 5 * 1024 * 1024) {
      onShowToast('File size exceeds 5MB. Please choose a smaller image.');
      return;
    }

    try {
      const downloadUrl = await uploadFile(file, `site-images/${key}`);
      updateSiteImage(key, downloadUrl);
      onShowToast(`Image uploaded to cloud storage & saved for "${key}"`);
    } catch (storageErr) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        if (dataUrl) {
          updateSiteImage(key, dataUrl);
          onShowToast(`Image saved for "${key}"`);
        }
      };
      reader.onerror = () => {
        onShowToast('Failed to read uploaded image file');
      };
      reader.readAsDataURL(file);
    }

    // Reset input so same file can be selected again if needed
    e.target.value = '';
  };

  // Handle Drag & Drop on image card
  const handleDrop = async (key: keyof SiteImagesConfig, e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      try {
        const downloadUrl = await uploadFile(file, `site-images/${key}`);
        updateSiteImage(key, downloadUrl);
        onShowToast(`Image uploaded to cloud storage & saved for "${key}"`);
      } catch (storageErr) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const dataUrl = event.target?.result as string;
          if (dataUrl) {
            updateSiteImage(key, dataUrl);
            onShowToast(`Image saved for "${key}"`);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Handle Reset Single Image
  const handleResetSingle = (item: SiteImageMeta) => {
    updateSiteImage(item.key, item.defaultUrl);
    onShowToast(`Reset "${item.title}" to default image`);
  };

  // Handle Reset All
  const handleResetAllConfirm = () => {
    resetSiteImages();
    setConfirmResetAll(false);
    onShowToast('All website images have been reset to factory defaults');
  };

  // Handle Copy URL
  const handleCopyUrl = (key: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedKey(key);
    onShowToast('Image URL copied to clipboard');
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  // Count customized images
  const customizedCount = SITE_IMAGE_REGISTRY.filter(
    item => siteImages[item.key] && siteImages[item.key] !== item.defaultUrl
  ).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Banner & Header */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 bg-teal-500/20 text-teal-300 text-xs font-bold rounded-full border border-teal-500/30 uppercase tracking-wider inline-flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Media & Asset Management</span>
            </span>
            {customizedCount > 0 && (
              <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-300 text-xs font-bold rounded-full border border-blue-500/30">
                {customizedCount} Customized Image{customizedCount > 1 ? 's' : ''}
              </span>
            )}
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display">
            Site Images & Visual Assets Manager
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Change, upload, or swap <strong>each and every image</strong> across the website in real-time. Changes are immediately saved and reflected across all patient and clinical pages without writing any code.
          </p>
        </div>

        {/* Action Controls Top Right */}
        <div className="mt-5 sm:mt-0 sm:absolute sm:top-8 sm:right-8 flex items-center gap-3">
          <button
            onClick={() => setConfirmResetAll(true)}
            className="px-4 py-2.5 bg-slate-800/90 hover:bg-rose-950 text-slate-300 hover:text-rose-200 border border-slate-700 hover:border-rose-700 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm cursor-pointer"
            id="btn-reset-all-site-images"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All to Defaults</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Section Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto scrollbar-none pb-1 md:pb-0">
          {sections.map(sec => {
            const count = sec === 'All' 
              ? SITE_IMAGE_REGISTRY.length 
              : SITE_IMAGE_REGISTRY.filter(s => s.section === sec).length;
            const isSelected = selectedSection === sec;
            return (
              <button
                key={sec}
                onClick={() => setSelectedSection(sec)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>{sec}</span>
                <span className={`px-1.5 py-0.2 rounded-md text-[10px] ${
                  isSelected ? 'bg-blue-800 text-teal-300' : 'bg-slate-200 text-slate-600'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search image by section or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Images Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredImages.map((meta) => {
          const currentUrl = siteImages[meta.key] || meta.defaultUrl;
          const isCustomized = currentUrl !== meta.defaultUrl;
          const isEditing = editingUrlKey === meta.key;
          const presets = CURATED_PRESETS[meta.key] || [];

          return (
            <div
              key={meta.key}
              onDrop={(e) => handleDrop(meta.key, e)}
              onDragOver={handleDragOver}
              className={`bg-white rounded-3xl border transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md ${
                isCustomized ? 'border-teal-400/80 ring-2 ring-teal-500/10' : 'border-slate-200'
              }`}
              id={`card-image-${meta.key}`}
            >
              {/* Card Header */}
              <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-3 bg-slate-50/50">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-900 border border-blue-200/80 rounded-md text-[10px] font-bold">
                      {meta.section}
                    </span>
                    {isCustomized && (
                      <span className="px-2 py-0.5 bg-teal-100 text-teal-800 border border-teal-200 rounded-md text-[10px] font-bold flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        <span>Custom Active</span>
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {meta.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    {meta.description}
                  </p>
                </div>

                <span className="text-[10px] font-mono text-slate-400 bg-white px-2 py-1 rounded-lg border border-slate-200 shrink-0">
                  {meta.recommendedSize}
                </span>
              </div>

              {/* Card Body: Live Preview & Image Controls */}
              <div className="p-5 space-y-4 flex-1">
                
                {/* Visual Preview Box */}
                <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 group h-48 sm:h-56">
                  <img
                    src={currentUrl}
                    alt={meta.title}
                    className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                  {/* Top Preview Controls */}
                  <div className="absolute top-3 right-3 flex items-center gap-2">
                    <button
                      onClick={() => setPreviewModalImage({ title: meta.title, url: currentUrl, meta })}
                      className="p-1.5 bg-slate-900/80 backdrop-blur-xs hover:bg-slate-900 text-white rounded-lg border border-white/20 transition-all shadow-md"
                      title="Fullscreen Preview"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleCopyUrl(meta.key, currentUrl)}
                      className="p-1.5 bg-slate-900/80 backdrop-blur-xs hover:bg-slate-900 text-white rounded-lg border border-white/20 transition-all shadow-md"
                      title="Copy Image URL"
                    >
                      {copiedKey === meta.key ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Drag-and-drop overlay hint */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                    <span className="text-[11px] font-medium text-slate-300 truncate max-w-[240px]">
                      {currentUrl.startsWith('data:image') ? 'Uploaded Local File (Base64)' : currentUrl}
                    </span>
                    <span className="text-[10px] text-teal-300 font-bold bg-slate-900/80 px-2 py-0.5 rounded-md border border-teal-400/30">
                      Drop File Here
                    </span>
                  </div>
                </div>

                {/* Primary Action Buttons: Upload File & Edit URL */}
                <div className="grid grid-cols-2 gap-2.5">
                  {/* Local File Upload Button */}
                  <div>
                    <input
                      type="file"
                      ref={el => fileInputRefs.current[meta.key] = el}
                      onChange={(e) => handleFileUpload(meta.key, e)}
                      accept="image/png, image/jpeg, image/webp, image/svg+xml, image/gif"
                      className="hidden"
                      id={`file-upload-${meta.key}`}
                    />
                    <button
                      onClick={() => fileInputRefs.current[meta.key]?.click()}
                      className="w-full py-2 px-3 bg-blue-900 hover:bg-blue-950 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5 text-teal-300" />
                      <span>Upload Local Photo</span>
                    </button>
                  </div>

                  {/* Edit Custom URL Button */}
                  <button
                    onClick={() => {
                      if (isEditing) {
                        setEditingUrlKey(null);
                      } else {
                        setEditingUrlKey(meta.key);
                        setInputUrlValue(currentUrl.startsWith('data:image') ? '' : currentUrl);
                      }
                    }}
                    className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-slate-200 cursor-pointer"
                  >
                    <Link2 className="w-3.5 h-3.5 text-slate-600" />
                    <span>{isEditing ? 'Cancel URL Edit' : 'Paste Web Link'}</span>
                  </button>
                </div>

                {/* Inline URL Input Form when active */}
                {isEditing && (
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 animate-in fade-in duration-200">
                    <label className="block text-[11px] font-bold text-slate-700">
                      Direct Web Image URL (HTTPS link or CDN)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        value={inputUrlValue}
                        onChange={(e) => setInputUrlValue(e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-teal-500"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveUrl(meta.key)}
                        className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1 shrink-0"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Apply</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Quick 1-Click Presets */}
                {presets.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600">
                      <Sparkles className="w-3 h-3 text-teal-600" />
                      <span>Quick Replacement Presets:</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {presets.map((preset, idx) => {
                        const isPresetActive = currentUrl === preset.url;
                        return (
                          <button
                            key={idx}
                            onClick={() => {
                              updateSiteImage(meta.key, preset.url);
                              onShowToast(`Applied preset "${preset.label}"`);
                            }}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all flex items-center gap-1 cursor-pointer ${
                              isPresetActive
                                ? 'bg-teal-100 text-teal-900 border border-teal-300 font-bold'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80'
                            }`}
                          >
                            {isPresetActive && <Check className="w-2.5 h-2.5 text-teal-700" />}
                            <span>{preset.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

              </div>

              {/* Card Footer: Status & Reset */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                  {isCustomized ? (
                    <span className="text-teal-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Custom Image Active</span>
                    </span>
                  ) : (
                    <span className="text-slate-400 flex items-center gap-1">
                      <span>Default Preset</span>
                    </span>
                  )}
                </div>

                {isCustomized && (
                  <button
                    onClick={() => handleResetSingle(meta)}
                    className="px-2.5 py-1 text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-lg text-[11px] font-bold transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset to Default</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Fullscreen Image Preview Lightbox Modal */}
      {previewModalImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 text-white space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">{previewModalImage.title}</h3>
                <p className="text-xs text-slate-400">{previewModalImage.meta.description}</p>
              </div>
              <button
                onClick={() => setPreviewModalImage(null)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden bg-slate-950 max-h-[60vh] flex items-center justify-center border border-slate-800">
              <img
                src={previewModalImage.url}
                alt={previewModalImage.title}
                className="max-h-[60vh] w-auto object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="flex items-center justify-between pt-2 text-xs">
              <span className="text-slate-400">
                Target: <strong>{previewModalImage.meta.section}</strong> • Recommended: <strong>{previewModalImage.meta.recommendedSize}</strong>
              </span>
              <button
                onClick={() => setPreviewModalImage(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Reset All Modal */}
      {confirmResetAll && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            
            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-slate-900">Reset All Website Images?</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                This will restore all hero banners, doctor portraits, department graphics, and laboratory visuals back to their original factory defaults.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setConfirmResetAll(false)}
                className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleResetAllConfirm}
                className="py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md"
              >
                Yes, Reset All
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
