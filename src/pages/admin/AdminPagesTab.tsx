import React, { useState, useRef } from 'react';
import { 
  FileText, 
  Plus, 
  Trash2, 
  Edit3, 
  Eye, 
  EyeOff, 
  Save, 
  Sparkles, 
  ExternalLink, 
  Layers, 
  CheckCircle2, 
  Image as ImageIcon, 
  Upload, 
  Compass, 
  Globe, 
  X,
  Search,
  BookOpen
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { CustomPageItem, PageType } from '../../types';
import { uploadFile } from '../../services/storageService';

interface AdminPagesTabProps {
  onShowToast: (message: string) => void;
  onNavigateToPage?: (page: PageType, param?: string) => void;
}

export const AdminPagesTab: React.FC<AdminPagesTabProps> = ({ onShowToast, onNavigateToPage }) => {
  const { customPages, addCustomPage, updateCustomPage, deleteCustomPage, menuItems, updateMenuItems } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPageId, setEditingPageId] = useState<string | null>(null);

  // Form State for Adding / Editing Custom Page
  const [pageTitle, setPageTitle] = useState('');
  const [pageSlug, setPageSlug] = useState('');
  const [pageSubtitle, setPageSubtitle] = useState('');
  const [pageContent, setPageContent] = useState('');
  const [pageBannerImage, setPageBannerImage] = useState('');
  const [pageIsPublished, setPageIsPublished] = useState(true);
  const [pageShowInNav, setPageShowInNav] = useState(true);
  const [pageShowInFooter, setPageShowInFooter] = useState(true);
  const [pageMetaDescription, setPageMetaDescription] = useState('');
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);

  const bannerFileRef = useRef<HTMLInputElement>(null);

  const corePages: { name: string; slug: string; target: PageType; desc: string }[] = [
    { name: 'Home Page', slug: '/', target: 'home', desc: 'Main landing page, hero banners, popular tests & packages' },
    { name: 'About Us', slug: '/about', target: 'about', desc: 'Laboratory history, medical team, accreditations & story' },
    { name: 'Diagnostic Departments', slug: '/services', target: 'services', desc: 'Clinical Pathology, Hematology, Biochemistry, Microbiology' },
    { name: 'Health Packages', slug: '/packages', target: 'packages', desc: 'Preventive checkups, full body health profiles, senior packages' },
    { name: 'Tests Catalog', slug: '/tests', target: 'tests', desc: 'Searchable comprehensive pathology test directory' },
    { name: 'Home Sample Collection', slug: '/home-collection', target: 'home-collection', desc: 'Doorstep phlebotomy booking, timings & guidelines' },
    { name: 'Why Choose Us', slug: '/why-choose-us', target: 'why-choose-us', desc: 'Quality accreditations, barcoded tracking & accuracy standards' },
    { name: 'Download Reports', slug: '/reports', target: 'reports', desc: 'Patient online report lookup by UHID and Phone Number' },
    { name: 'Health Blog', slug: '/blog', target: 'blog', desc: 'Articles, wellness guides, and health awareness posts' },
    { name: 'Patient FAQs', slug: '/faq', target: 'faq', desc: 'Test preparation, fasting guidelines, reporting times' },
    { name: 'Contact & Branches', slug: '/contact', target: 'contact', desc: 'Headquarters, regional collection centres, Google map & phone' }
  ];

  const handleOpenAdd = () => {
    setEditingPageId(null);
    setPageTitle('');
    setPageSlug('');
    setPageSubtitle('');
    setPageContent('## Introduction\n\nWrite your page content here in clear markdown or structured text.\n\n### Key Highlights\n- Certified laboratory testing\n- Automated reporting\n- Doorstep home pickup available');
    setPageBannerImage('https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1200&q=80');
    setPageIsPublished(true);
    setPageShowInNav(true);
    setPageShowInFooter(true);
    setPageMetaDescription('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (page: CustomPageItem) => {
    setEditingPageId(page.id);
    setPageTitle(page.title);
    setPageSlug(page.slug);
    setPageSubtitle(page.subtitle || '');
    setPageContent(page.content);
    setPageBannerImage(page.bannerImageUrl || '');
    setPageIsPublished(page.published);
    setPageShowInNav(page.showInMenu);
    setPageShowInFooter(page.showInFooter);
    setPageMetaDescription(page.metaDescription || '');
    setIsModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setPageTitle(val);
    if (!editingPageId) {
      // Auto generate slug
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setPageSlug(generatedSlug);
    }
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingBanner(true);
    try {
      const downloadUrl = await uploadFile(file, 'page-banners');
      setPageBannerImage(downloadUrl);
      onShowToast('Banner image uploaded successfully');
    } catch (err) {
      console.error('Banner upload error:', err);
      onShowToast('Failed to process image');
    } finally {
      setIsUploadingBanner(false);
      e.target.value = '';
    }
  };

  const handleSavePage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pageTitle.trim() || !pageSlug.trim()) {
      onShowToast('Title and URL slug are required');
      return;
    }

    const cleanSlug = pageSlug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');

    if (editingPageId) {
      updateCustomPage(editingPageId, {
        title: pageTitle.trim(),
        slug: cleanSlug,
        subtitle: pageSubtitle.trim(),
        content: pageContent,
        bannerImageUrl: pageBannerImage.trim(),
        published: pageIsPublished,
        showInMenu: pageShowInNav,
        showInFooter: pageShowInFooter,
        metaDescription: pageMetaDescription.trim()
      });
      onShowToast(`Page "${pageTitle}" updated successfully`);
    } else {
      const created = addCustomPage({
        title: pageTitle.trim(),
        slug: cleanSlug,
        subtitle: pageSubtitle.trim(),
        content: pageContent,
        bannerImageUrl: pageBannerImage.trim(),
        published: pageIsPublished,
        showInMenu: pageShowInNav,
        showInFooter: pageShowInFooter,
        metaDescription: pageMetaDescription.trim()
      });

      // If user enabled showInNav, auto-create menu item
      if (pageShowInNav) {
        const newMenuItem = {
          id: `menu-${Date.now()}`,
          label: pageTitle.trim(),
          page: 'custom-page' as PageType,
          customSlug: cleanSlug,
          enabled: true,
          order: menuItems.length + 1
        };
        updateMenuItems([...menuItems, newMenuItem]);
      }

      onShowToast(`Page "${pageTitle}" published successfully`);
    }

    setIsModalOpen(false);
  };


  const handleDelete = (page: CustomPageItem) => {
    if (window.confirm(`Are you sure you want to delete the custom page "${page.title}"?`)) {
      deleteCustomPage(page.id);
      // Remove from menu items if present
      const filteredMenu = menuItems.filter(m => m.customSlug !== page.slug);
      if (filteredMenu.length !== menuItems.length) {
        updateMenuItems(filteredMenu);
      }
      onShowToast(`Page "${page.title}" deleted`);
    }
  };

  const filteredCustomPages = customPages.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="p-2 bg-teal-500/10 text-teal-600 rounded-xl">
              <Layers className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
              Website Pages CMS (Add & Remove Pages)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
            Create new custom pages with rich content and banner images, customize URL slugs, and configure menu/footer integration.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-6 py-3.5 bg-teal-600 hover:bg-teal-500 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-lg shadow-teal-900/15 hover:shadow-teal-900/25 active:scale-98 transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Custom Page</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400 shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search pages by title or URL slug..."
          className="w-full text-xs sm:text-sm bg-transparent border-none focus:outline-none text-slate-900 placeholder:text-slate-400"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Custom Pages Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <h3 className="text-base font-bold text-slate-900">Custom Managed Pages ({filteredCustomPages.length})</h3>
          </div>
          <span className="text-xs text-slate-500">Live dynamic URL routing</span>
        </div>

        {filteredCustomPages.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-3xl space-y-3">
            <FileText className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-700">No Custom Pages Found</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Create your first custom page (e.g. Corporate Wellness, Terms, Biomedical Guidelines) to expand the website.
            </p>
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Page</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCustomPages.map((page) => (
              <div
                key={page.id}
                className="p-5 rounded-2xl border border-slate-200/80 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50 transition-all flex flex-col justify-between gap-4 group"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                          {page.title}
                        </h4>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          page.published ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {page.published ? 'Published' : 'Draft'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-mono text-teal-600 mt-0.5">
                        <Globe className="w-3 h-3 text-slate-400" />
                        <span>/{page.slug}</span>
                      </div>
                    </div>

                    {page.bannerImageUrl && (
                      <img
                        src={page.bannerImageUrl}
                        alt={page.title}
                        className="w-14 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                      />
                    )}
                  </div>

                  {page.subtitle && (
                    <p className="text-xs text-slate-500 line-clamp-1">{page.subtitle}</p>
                  )}

                  <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-400">
                    {page.showInMenu && (
                      <span className="flex items-center gap-1 text-slate-600">
                        <Compass className="w-3 h-3 text-teal-600" />
                        <span>In Header Menu</span>
                      </span>
                    )}
                    {page.showInFooter && (
                      <span className="flex items-center gap-1 text-slate-600">
                        <FileText className="w-3 h-3 text-indigo-600" />
                        <span>In Footer</span>
                      </span>
                    )}
                  </div>

                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-200/60">
                  <button
                    onClick={() => onNavigateToPage?.('custom-page', page.slug)}
                    className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Live Page</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(page)}
                      className="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-all"
                      title="Edit Page"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(page)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                      title="Delete Page"
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

      {/* Core Built-In Pages Directory */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">Core Built-in Website Pages ({corePages.length})</h3>
          <p className="text-xs text-slate-500">Standard diagnostic modules and interactive patient services built into the website.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {corePages.map((core) => (
            <div
              key={core.slug}
              className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200/70 hover:border-slate-300 transition-all flex flex-col justify-between gap-3"
            >
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900">{core.name}</h4>
                  <span className="font-mono text-[10px] text-teal-600 font-semibold">{core.slug}</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{core.desc}</p>
              </div>

              <button
                onClick={() => onNavigateToPage?.(core.target)}
                className="text-[11px] font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1 self-start"
              >
                <span>Visit Page</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Add / Edit Page Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6 my-8 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="p-2 bg-teal-50 text-teal-600 rounded-xl">
                  <FileText className="w-5 h-5" />
                </span>
                <h3 className="text-lg font-bold text-slate-900 font-display">
                  {editingPageId ? 'Edit Custom Page' : 'Create New Custom Page'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePage} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Page Title *</label>
                  <input
                    type="text"
                    required
                    value={pageTitle}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. Corporate Health & Wellness"
                    className="w-full text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">URL Slug * (Unique)</label>
                  <div className="flex items-center">
                    <span className="px-3 py-2.5 bg-slate-100 border border-r-0 border-slate-200 rounded-l-xl text-xs text-slate-500 font-mono">
                      /
                    </span>
                    <input
                      type="text"
                      required
                      value={pageSlug}
                      onChange={(e) => setPageSlug(e.target.value)}
                      placeholder="corporate-wellness"
                      className="w-full text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-r-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono text-xs"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Subtitle / Hero Tagline</label>
                <input
                  type="text"
                  value={pageSubtitle}
                  onChange={(e) => setPageSubtitle(e.target.value)}
                  placeholder="Tailored on-site employee medical checkups, pre-employment screenings, and corporate diagnostic plans."
                  className="w-full text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Banner Image */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Header Banner Image</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={pageBannerImage}
                    onChange={(e) => setPageBannerImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <input
                    ref={bannerFileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleBannerUpload}
                  />
                  <button
                    type="button"
                    onClick={() => bannerFileRef.current?.click()}
                    disabled={isUploadingBanner}
                    className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isUploadingBanner ? 'Uploading...' : 'Upload Image'}</span>
                  </button>
                </div>
              </div>

              {/* Rich Markdown Content */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700">Page Content (Supports Markdown & Headings)</label>
                  <span className="text-[10px] text-slate-400">Use ## for Headings, - for Bullet lists</span>
                </div>
                <textarea
                  rows={8}
                  required
                  value={pageContent}
                  onChange={(e) => setPageContent(e.target.value)}
                  placeholder="Write full article / page text here..."
                  className="w-full text-xs font-mono px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 leading-relaxed"
                />
              </div>

              {/* Toggles & Settings */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <label className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pageIsPublished}
                    onChange={(e) => setPageIsPublished(e.target.checked)}
                    className="rounded text-teal-600 focus:ring-teal-500"
                  />
                  <span className="text-xs font-semibold text-slate-700">Publish (Live)</span>
                </label>

                <label className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pageShowInNav}
                    onChange={(e) => setPageShowInNav(e.target.checked)}
                    className="rounded text-teal-600 focus:ring-teal-500"
                  />
                  <span className="text-xs font-semibold text-slate-700">Add to Top Menu</span>
                </label>

                <label className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pageShowInFooter}
                    onChange={(e) => setPageShowInFooter(e.target.checked)}
                    className="rounded text-teal-600 focus:ring-teal-500"
                  />
                  <span className="text-xs font-semibold text-slate-700">Show in Footer</span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold shadow-md shadow-teal-900/10 flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingPageId ? 'Update Page' : 'Save & Publish Page'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
