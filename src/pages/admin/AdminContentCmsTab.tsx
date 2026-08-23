import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  Save, 
  RotateCcw, 
  Layers, 
  Home, 
  Info, 
  Truck, 
  ShieldCheck, 
  PhoneCall, 
  Megaphone, 
  CheckCircle2, 
  Plus, 
  Trash2,
  HelpCircle,
  Award,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { SiteContentConfig } from '../../types';
import { DEFAULT_SITE_CONTENT } from '../../data/labData';

interface AdminContentCmsTabProps {
  onShowToast: (message: string) => void;
}

type ContentSectionId = 'hero' | 'about' | 'homeCollection' | 'whyChooseUs' | 'contact' | 'announcement' | 'footer';

export const AdminContentCmsTab: React.FC<AdminContentCmsTabProps> = ({ onShowToast }) => {
  const { 
    siteContent, 
    updateSiteContent, 
    announcement, 
    updateAnnouncement,
    footerConfig,
    updateFooterConfig 
  } = useData();

  const [activeSection, setActiveSection] = useState<ContentSectionId>('hero');
  const [contentForm, setContentForm] = useState<SiteContentConfig>(siteContent);
  const [announcementForm, setAnnouncementForm] = useState(announcement);
  const [footerForm, setFooterForm] = useState(footerConfig);

  React.useEffect(() => {
    setContentForm(siteContent);
  }, [siteContent]);

  React.useEffect(() => {
    setAnnouncementForm(announcement);
  }, [announcement]);

  React.useEffect(() => {
    setFooterForm(footerConfig);
  }, [footerConfig]);

  const handleHeroChange = (field: keyof typeof contentForm.hero, value: any) => {
    setContentForm(prev => ({
      ...prev,
      hero: { ...prev.hero, [field]: value }
    }));
  };

  const handleAboutChange = (field: keyof typeof contentForm.about, value: any) => {
    setContentForm(prev => ({
      ...prev,
      about: { ...prev.about, [field]: value }
    }));
  };

  const handleHomeCollectionChange = (field: keyof typeof contentForm.homeCollection, value: any) => {
    setContentForm(prev => ({
      ...prev,
      homeCollection: { ...prev.homeCollection, [field]: value }
    }));
  };

  const handleWhyChooseUsChange = (field: keyof typeof contentForm.whyChooseUs, value: any) => {
    setContentForm(prev => ({
      ...prev,
      whyChooseUs: { ...prev.whyChooseUs, [field]: value }
    }));
  };

  const handleContactChange = (field: keyof typeof contentForm.contact, value: any) => {
    setContentForm(prev => ({
      ...prev,
      contact: { ...prev.contact, [field]: value }
    }));
  };

  const handleSaveAll = () => {
    updateSiteContent(contentForm);
    updateAnnouncement(announcementForm);
    updateFooterConfig(footerForm);
    onShowToast('All website text changes saved and synchronized across the site');
  };

  const handleResetToDefaults = () => {
    setContentForm(DEFAULT_SITE_CONTENT);
    updateSiteContent(DEFAULT_SITE_CONTENT);
    onShowToast('Website content restored to standard laboratory defaults');
  };

  const navigationSections: { id: ContentSectionId; label: string; icon: React.FC<{ className?: string }>; desc: string }[] = [
    { id: 'hero', label: 'Homepage Hero Section', icon: Home, desc: 'Headlines, call-to-actions, and trust metrics' },
    { id: 'about', label: 'About Us Page & Story', icon: Info, desc: 'Mission, vision, quality standards & story' },
    { id: 'homeCollection', label: 'Home Collection Section', icon: Truck, desc: 'Doorstep phlebotomy features & steps' },
    { id: 'whyChooseUs', label: 'Why Choose Us Features', icon: ShieldCheck, desc: 'Key advantages & laboratory differentiators' },
    { id: 'contact', label: 'Contact & Helpdesk', icon: PhoneCall, desc: 'Customer support headers & help desk notes' },
    { id: 'announcement', label: 'Top Announcement Banner', icon: Megaphone, desc: 'Special promo ribbon across the header' },
    { id: 'footer', label: 'Footer & Medical Legal Disclaimers', icon: FileText, desc: 'Summary bio, accreditation banner, & legal notices' }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="p-2 bg-teal-500/10 text-teal-600 rounded-xl">
              <FileText className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
              Website CMS (Edit All Text)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
            Modify and customize every headline, paragraph, marketing text, guarantee, and disclaimer across all pages.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            onClick={handleResetToDefaults}
            className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-xs transition-all flex items-center gap-1.5"
            title="Reset to default text copy"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={handleSaveAll}
            className="px-6 py-3.5 bg-teal-600 hover:bg-teal-500 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-lg shadow-teal-900/15 hover:shadow-teal-900/25 active:scale-98 transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save All Text Changes</span>
          </button>
        </div>
      </div>

      {/* Main CMS Layout: Left Side Navigation, Right Content Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Sub-Navigation */}
        <div className="lg:col-span-4 space-y-2">
          <div className="bg-white rounded-3xl p-3 border border-slate-200/80 shadow-sm space-y-1">
            {navigationSections.map((sec) => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  className={`w-full text-left p-3.5 rounded-2xl transition-all flex items-center justify-between group ${
                    isActive 
                      ? 'bg-slate-900 text-white shadow-md' 
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`p-2 rounded-xl shrink-0 ${
                      isActive ? 'bg-teal-500/20 text-teal-400' : 'bg-slate-100 text-slate-600 group-hover:text-slate-900'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs font-bold truncate leading-tight">{sec.label}</div>
                      <div className={`text-[10px] truncate ${isActive ? 'text-slate-400' : 'text-slate-500'}`}>
                        {sec.desc}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isActive ? 'text-teal-400 translate-x-0.5' : 'text-slate-400 opacity-0 group-hover:opacity-100'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Editor Area */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          
          {/* SECTION 1: HERO SECTION */}
          {activeSection === 'hero' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-base font-bold text-slate-900">Homepage Hero Section Text</h3>
                <p className="text-xs text-slate-500">The primary above-the-fold banner on the homepage.</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Top Badge Pill Text</label>
                  <input
                    type="text"
                    value={contentForm.hero?.badge || ''}
                    onChange={(e) => handleHeroChange('badge', e.target.value)}
                    placeholder="e.g. Accredited Pathology Laboratory"
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">Main Headline (Part 1)</label>
                    <input
                      type="text"
                      value={contentForm.hero?.headline || ''}
                      onChange={(e) => handleHeroChange('headline', e.target.value)}
                      placeholder="Precision Pathology & Diagnostics You Can"
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">Headline Highlighted Text (Teal Colored)</label>
                    <input
                      type="text"
                      value={contentForm.hero?.headlineHighlight || ''}
                      onChange={(e) => handleHeroChange('headlineHighlight', e.target.value)}
                      placeholder="Trust With Every Report"
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 font-bold text-teal-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Sub-Headline Description</label>
                  <textarea
                    rows={3}
                    value={contentForm.hero?.subheadline || ''}
                    onChange={(e) => handleHeroChange('subheadline', e.target.value)}
                    placeholder="State-of-the-art fully automated analyzers, certified barcoded sample tracking..."
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">Primary Button Text</label>
                    <input
                      type="text"
                      value={contentForm.hero?.primaryCtaText || ''}
                      onChange={(e) => handleHeroChange('primaryCtaText', e.target.value)}
                      placeholder="Book Test / Home Collection"
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">Secondary Button Text</label>
                    <input
                      type="text"
                      value={contentForm.hero?.secondaryCtaText || ''}
                      onChange={(e) => handleHeroChange('secondaryCtaText', e.target.value)}
                      placeholder="Explore Health Packages"
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                {/* Key Stat Counters */}
                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Key Statistics (4 Metrics)</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                      <input
                        type="text"
                        value={contentForm.hero?.stat1Value || ''}
                        onChange={(e) => handleHeroChange('stat1Value', e.target.value)}
                        placeholder="99.8%"
                        className="w-full text-xs font-bold text-teal-700 bg-white px-2 py-1 rounded-lg border border-slate-200"
                      />
                      <input
                        type="text"
                        value={contentForm.hero?.stat1Label || ''}
                        onChange={(e) => handleHeroChange('stat1Label', e.target.value)}
                        placeholder="Clinical Accuracy"
                        className="w-full text-[11px] text-slate-600 bg-white px-2 py-1 rounded-lg border border-slate-200"
                      />
                    </div>

                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                      <input
                        type="text"
                        value={contentForm.hero?.stat2Value || ''}
                        onChange={(e) => handleHeroChange('stat2Value', e.target.value)}
                        placeholder="6-8 Hrs"
                        className="w-full text-xs font-bold text-teal-700 bg-white px-2 py-1 rounded-lg border border-slate-200"
                      />
                      <input
                        type="text"
                        value={contentForm.hero?.stat2Label || ''}
                        onChange={(e) => handleHeroChange('stat2Label', e.target.value)}
                        placeholder="Average Turnaround"
                        className="w-full text-[11px] text-slate-600 bg-white px-2 py-1 rounded-lg border border-slate-200"
                      />
                    </div>

                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                      <input
                        type="text"
                        value={contentForm.hero?.stat3Value || ''}
                        onChange={(e) => handleHeroChange('stat3Value', e.target.value)}
                        placeholder="100%"
                        className="w-full text-xs font-bold text-teal-700 bg-white px-2 py-1 rounded-lg border border-slate-200"
                      />
                      <input
                        type="text"
                        value={contentForm.hero?.stat3Label || ''}
                        onChange={(e) => handleHeroChange('stat3Label', e.target.value)}
                        placeholder="Barcoded Tracking"
                        className="w-full text-[11px] text-slate-600 bg-white px-2 py-1 rounded-lg border border-slate-200"
                      />
                    </div>

                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                      <input
                        type="text"
                        value={contentForm.hero?.stat4Value || ''}
                        onChange={(e) => handleHeroChange('stat4Value', e.target.value)}
                        placeholder="50,000+"
                        className="w-full text-xs font-bold text-teal-700 bg-white px-2 py-1 rounded-lg border border-slate-200"
                      />
                      <input
                        type="text"
                        value={contentForm.hero?.stat4Label || ''}
                        onChange={(e) => handleHeroChange('stat4Label', e.target.value)}
                        placeholder="Satisfied Patients"
                        className="w-full text-[11px] text-slate-600 bg-white px-2 py-1 rounded-lg border border-slate-200"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: ABOUT US */}
          {activeSection === 'about' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-base font-bold text-slate-900">About Us Page & Story Content</h3>
                <p className="text-xs text-slate-500">Mission statements, laboratory heritage, and quality philosophies.</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Page Title</label>
                  <input
                    type="text"
                    value={contentForm.about?.title || ''}
                    onChange={(e) => handleAboutChange('title', e.target.value)}
                    placeholder="About Microcells Diagnostics"
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Subtitle / Proposition</label>
                  <input
                    type="text"
                    value={contentForm.about?.subtitle || ''}
                    onChange={(e) => handleAboutChange('subtitle', e.target.value)}
                    placeholder="Built on Clinical Integrity, Precision Technology, and Patient Dignity"
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Mission Statement</label>
                  <textarea
                    rows={2}
                    value={contentForm.about?.missionStatement || ''}
                    onChange={(e) => handleAboutChange('missionStatement', e.target.value)}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Vision Statement</label>
                  <textarea
                    rows={2}
                    value={contentForm.about?.visionStatement || ''}
                    onChange={(e) => handleAboutChange('visionStatement', e.target.value)}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Quality & Clinical Commitment</label>
                  <textarea
                    rows={3}
                    value={contentForm.about?.qualityCommitment || ''}
                    onChange={(e) => handleAboutChange('qualityCommitment', e.target.value)}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Story & Founding Background (Paragraph 1)</label>
                  <textarea
                    rows={3}
                    value={contentForm.about?.storyParagraph1 || ''}
                    onChange={(e) => handleAboutChange('storyParagraph1', e.target.value)}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Operations & Automation (Paragraph 2)</label>
                  <textarea
                    rows={3}
                    value={contentForm.about?.storyParagraph2 || ''}
                    onChange={(e) => handleAboutChange('storyParagraph2', e.target.value)}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: HOME COLLECTION */}
          {activeSection === 'homeCollection' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-base font-bold text-slate-900">Home Sample Collection Text</h3>
                <p className="text-xs text-slate-500">Copywriting for the doorstep phlebotomy feature and booking guidance.</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Section Headline</label>
                  <input
                    type="text"
                    value={contentForm.homeCollection?.headline || ''}
                    onChange={(e) => handleHomeCollectionChange('headline', e.target.value)}
                    placeholder="Doorstep Home Sample Collection"
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Sub-Headline</label>
                  <input
                    type="text"
                    value={contentForm.homeCollection?.subheadline || ''}
                    onChange={(e) => handleHomeCollectionChange('subheadline', e.target.value)}
                    placeholder="Comfortable, safe, and hygienic blood and urine collection at your home or workplace..."
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Availability Badge Text</label>
                  <input
                    type="text"
                    value={contentForm.homeCollection?.badge || ''}
                    onChange={(e) => handleHomeCollectionChange('badge', e.target.value)}
                    placeholder="Available 7 Days a Week (6:30 AM – 7:30 PM)"
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {/* Phlebotomy Perks (4 items) */}
                <div className="pt-2">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Phlebotomy Key Perks</h4>
                  <div className="space-y-3">
                    {contentForm.homeCollection?.perks?.map((perk, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block mb-1">Perk #{idx + 1} Title</label>
                          <input
                            type="text"
                            value={perk.title}
                            onChange={(e) => {
                              const perks = [...contentForm.homeCollection.perks];
                              perks[idx] = { ...perks[idx], title: e.target.value };
                              handleHomeCollectionChange('perks', perks);
                            }}
                            className="w-full text-xs font-bold px-2 py-1.5 bg-white border border-slate-200 rounded-lg"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="text-[10px] font-bold text-slate-500 block mb-1">Description</label>
                          <input
                            type="text"
                            value={perk.desc}
                            onChange={(e) => {
                              const perks = [...contentForm.homeCollection.perks];
                              perks[idx] = { ...perks[idx], desc: e.target.value };
                              handleHomeCollectionChange('perks', perks);
                            }}
                            className="w-full text-xs px-2 py-1.5 bg-white border border-slate-200 rounded-lg"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: WHY CHOOSE US */}
          {activeSection === 'whyChooseUs' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-base font-bold text-slate-900">Why Choose Us Value Propositions</h3>
                <p className="text-xs text-slate-500">The 6 trust pillars and technological advantages featured across the site.</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Section Headline</label>
                  <input
                    type="text"
                    value={contentForm.whyChooseUs?.headline || ''}
                    onChange={(e) => handleWhyChooseUsChange('headline', e.target.value)}
                    placeholder="Why Clinicians & Families Trust Microcells"
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Section Sub-Headline</label>
                  <input
                    type="text"
                    value={contentForm.whyChooseUs?.subheadline || ''}
                    onChange={(e) => handleWhyChooseUsChange('subheadline', e.target.value)}
                    placeholder="Every step of our laboratory workflow is engineered for clinical accuracy..."
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {/* 6 Features */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">6 Advantage Feature Cards</h4>
                  {contentForm.whyChooseUs?.features?.map((feat, idx) => (
                    <div key={feat.id || idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <input
                          type="text"
                          value={feat.title}
                          onChange={(e) => {
                            const features = [...contentForm.whyChooseUs.features];
                            features[idx] = { ...features[idx], title: e.target.value };
                            handleWhyChooseUsChange('features', features);
                          }}
                          placeholder="Feature Title"
                          className="flex-1 text-xs font-bold px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                        />
                      </div>
                      <textarea
                        rows={2}
                        value={feat.description}
                        onChange={(e) => {
                          const features = [...contentForm.whyChooseUs.features];
                          features[idx] = { ...features[idx], description: e.target.value };
                          handleWhyChooseUsChange('features', features);
                        }}
                        placeholder="Feature Description"
                        className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SECTION 5: CONTACT & HELPDESK */}
          {activeSection === 'contact' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-base font-bold text-slate-900">Contact Page & Diagnostic Helpdesk Content</h3>
                <p className="text-xs text-slate-500">Copywriting on the Contact & Branch locations view.</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Contact Page Main Headline</label>
                  <input
                    type="text"
                    value={contentForm.contact?.headline || ''}
                    onChange={(e) => handleContactChange('headline', e.target.value)}
                    placeholder="We Are Here To Assist You"
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Contact Sub-Headline</label>
                  <textarea
                    rows={2}
                    value={contentForm.contact?.subheadline || ''}
                    onChange={(e) => handleContactChange('subheadline', e.target.value)}
                    placeholder="Have questions about test preparation, report delivery, home collection..."
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Helpdesk Card Title</label>
                  <input
                    type="text"
                    value={contentForm.contact?.helpdeskTitle || ''}
                    onChange={(e) => handleContactChange('helpdeskTitle', e.target.value)}
                    placeholder="Central Diagnostic Helpdesk"
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Helpdesk Card Subtext</label>
                  <textarea
                    rows={2}
                    value={contentForm.contact?.helpdeskDesc || ''}
                    onChange={(e) => handleContactChange('helpdeskDesc', e.target.value)}
                    placeholder="Our customer desk and pathology support team are available 7 days a week..."
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION 6: ANNOUNCEMENT */}
          {activeSection === 'announcement' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-base font-bold text-slate-900">Header Announcement Banner</h3>
                <p className="text-xs text-slate-500">The animated top notification banner displayed above the header navigation.</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Enable Announcement Banner</span>
                    <span className="text-[11px] text-slate-500">Show or hide the banner on the public site</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={announcementForm.enabled}
                    onChange={(e) => setAnnouncementForm(prev => ({ ...prev, enabled: e.target.checked }))}
                    className="rounded text-teal-600 focus:ring-teal-500 w-5 h-5"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Announcement Badge Label</label>
                  <input
                    type="text"
                    value={announcementForm.badgeText || ''}
                    onChange={(e) => setAnnouncementForm(prev => ({ ...prev, badgeText: e.target.value }))}
                    placeholder="Health Special / Notice"
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Announcement Message Text</label>
                  <textarea
                    rows={2}
                    value={announcementForm.text}
                    onChange={(e) => setAnnouncementForm(prev => ({ ...prev, text: e.target.value }))}
                    placeholder="Free Vitamin D & B12 screening available with all Senior packages..."
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">Action Button Link Text</label>
                    <input
                      type="text"
                      value={announcementForm.linkText || ''}
                      onChange={(e) => setAnnouncementForm(prev => ({ ...prev, linkText: e.target.value }))}
                      placeholder="View Packages"
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">Target Destination Page</label>
                    <select
                      value={announcementForm.linkPage || 'packages'}
                      onChange={(e) => setAnnouncementForm(prev => ({ ...prev, linkPage: e.target.value as any }))}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="packages">Health Packages</option>
                      <option value="tests">All Tests</option>
                      <option value="home-collection">Home Collection</option>
                      <option value="reports">Download Report</option>
                      <option value="contact">Contact Us</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 7: FOOTER & LEGAL DISCLAIMERS */}
          {activeSection === 'footer' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-base font-bold text-slate-900">Footer Text, Accreditations & Medical Disclaimers</h3>
                <p className="text-xs text-slate-500">Customize the footer summary, copyright statement, and mandatory statutory notices.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Footer About Laboratory Summary</label>
                  <textarea
                    rows={3}
                    value={footerForm.aboutText || ''}
                    onChange={(e) => setFooterForm(prev => ({ ...prev, aboutText: e.target.value }))}
                    placeholder="Microcells Diagnostics Pvt. Ltd. is a dedicated diagnostic and pathology testing laboratory..."
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">Accreditation Banner Headline</label>
                    <input
                      type="text"
                      value={footerForm.accreditationHeadline || ''}
                      onChange={(e) => setFooterForm(prev => ({ ...prev, accreditationHeadline: e.target.value }))}
                      placeholder="Committed to Clinical Precision & Patient Safety"
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">Copyright Statement</label>
                    <input
                      type="text"
                      value={footerForm.copyrightText || ''}
                      onChange={(e) => setFooterForm(prev => ({ ...prev, copyrightText: e.target.value }))}
                      placeholder="© 2026 Microcells Diagnostics Pvt. Ltd. All rights reserved."
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Accreditation Banner Subtext</label>
                  <input
                    type="text"
                    value={footerForm.accreditationSubtext || ''}
                    onChange={(e) => setFooterForm(prev => ({ ...prev, accreditationSubtext: e.target.value }))}
                    placeholder="Standardized diagnostic protocols, barcoded sample tracking, automated analyzers..."
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Statutory Medical Advice Disclaimer</label>
                  <textarea
                    rows={3}
                    value={footerForm.medicalDisclaimer || ''}
                    onChange={(e) => setFooterForm(prev => ({ ...prev, medicalDisclaimer: e.target.value }))}
                    placeholder="Medical Disclaimer: Diagnostic test results and online reports are intended solely to assist clinical medical practitioners..."
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {/* Footer Section Toggles */}
                <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <label className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={footerForm.showQuickLinks}
                      onChange={(e) => setFooterForm(prev => ({ ...prev, showQuickLinks: e.target.checked }))}
                      className="rounded text-teal-600 focus:ring-teal-500"
                    />
                    <span className="text-xs font-semibold text-slate-700">Quick Links</span>
                  </label>

                  <label className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={footerForm.showDepartments}
                      onChange={(e) => setFooterForm(prev => ({ ...prev, showDepartments: e.target.checked }))}
                      className="rounded text-teal-600 focus:ring-teal-500"
                    />
                    <span className="text-xs font-semibold text-slate-700">Departments</span>
                  </label>

                  <label className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={footerForm.showContactInfo}
                      onChange={(e) => setFooterForm(prev => ({ ...prev, showContactInfo: e.target.checked }))}
                      className="rounded text-teal-600 focus:ring-teal-500"
                    />
                    <span className="text-xs font-semibold text-slate-700">Contact Box</span>
                  </label>

                  <label className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={footerForm.showAccreditationBanner}
                      onChange={(e) => setFooterForm(prev => ({ ...prev, showAccreditationBanner: e.target.checked }))}
                      className="rounded text-teal-600 focus:ring-teal-500"
                    />
                    <span className="text-xs font-semibold text-slate-700">Trust Strip</span>
                  </label>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
