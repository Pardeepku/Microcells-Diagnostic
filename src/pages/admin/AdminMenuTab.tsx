import React, { useState } from 'react';
import { 
  Compass, 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Save, 
  RotateCcw, 
  Link as LinkIcon, 
  FileText, 
  Globe, 
  Check, 
  ExternalLink,
  Layers,
  Edit2,
  X,
  Database
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { MenuItem, PageType } from '../../types';
import { DEFAULT_MENU_ITEMS } from '../../data/labData';

interface AdminMenuTabProps {
  onShowToast: (message: string) => void;
}

export const AdminMenuTab: React.FC<AdminMenuTabProps> = ({ onShowToast }) => {
  const { menuItems, updateMenuItems, customPages, labInfo, updateLabInfo } = useData();

  const [items, setItems] = useState<MenuItem[]>(menuItems);
  const [lisPortalUrl, setLisPortalUrl] = useState(labInfo?.lisPortalUrl || 'https://microcellsdiagnostic.in/pages/login.aspx');

  React.useEffect(() => {
    if (labInfo?.lisPortalUrl) {
      setLisPortalUrl(labInfo.lisPortalUrl);
    }
  }, [labInfo]);

  const handleSaveLis = () => {
    const urlToSave = lisPortalUrl.trim() || 'https://microcellsdiagnostic.in/pages/login.aspx';
    updateLabInfo({ lisPortalUrl: urlToSave });
    setLisPortalUrl(urlToSave);
    onShowToast('Top Right LIS Login URL updated and saved');
  };
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  // New Item Form State
  const [newLabel, setNewLabel] = useState('');
  const [newTargetType, setNewTargetType] = useState<'core' | 'custom' | 'external'>('core');
  const [newCorePage, setNewCorePage] = useState<PageType>('home');
  const [newCustomSlug, setNewCustomSlug] = useState<string>('');
  const [newExternalUrl, setNewExternalUrl] = useState('');
  const [newHighlight, setNewHighlight] = useState(false);

  // Synchronize when external menuItems change
  React.useEffect(() => {
    setItems(menuItems);
  }, [menuItems]);

  const handleSaveAll = () => {
    updateMenuItems(items);
    onShowToast('Menu bar configuration saved and live on website');
  };

  const handleToggle = (id: string) => {
    const updated = items.map(item => item.id === id ? { ...item, enabled: !item.enabled } : item);
    setItems(updated);
    updateMenuItems(updated);
    onShowToast('Menu item visibility updated');
  };

  const handleToggleHighlight = (id: string) => {
    const updated = items.map(item => item.id === id ? { ...item, highlight: !item.highlight } : item);
    setItems(updated);
    updateMenuItems(updated);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...items];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    // Reassign order
    const ordered = updated.map((it, i) => ({ ...it, order: i + 1 }));
    setItems(ordered);
    updateMenuItems(ordered);
  };

  const handleMoveDown = (index: number) => {
    if (index === items.length - 1) return;
    const updated = [...items];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    const ordered = updated.map((it, i) => ({ ...it, order: i + 1 }));
    setItems(ordered);
    updateMenuItems(ordered);
  };

  const handleDelete = (id: string) => {
    const updated = items.filter(item => item.id !== id);
    setItems(updated);
    updateMenuItems(updated);
    onShowToast('Menu item removed');
  };

  const handleUpdateLabel = (id: string, label: string) => {
    const updated = items.map(item => item.id === id ? { ...item, label } : item);
    setItems(updated);
    updateMenuItems(updated);
  };

  const handleResetToDefaults = () => {
    setItems(DEFAULT_MENU_ITEMS);
    updateMenuItems(DEFAULT_MENU_ITEMS);
    onShowToast('Menu restored to default structure');
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim()) {
      onShowToast('Please provide a menu title/label');
      return;
    }

    const id = `menu-${Date.now()}`;
    let pageTarget: PageType = newCorePage;
    let isExternal = false;
    let customSlug: string | undefined = undefined;

    if (newTargetType === 'custom') {
      pageTarget = 'custom-page';
      customSlug = newCustomSlug || (customPages[0]?.slug ?? 'corporate-wellness');
    } else if (newTargetType === 'external') {
      isExternal = true;
    }

    const newItem: MenuItem = {
      id,
      label: newLabel.trim(),
      page: pageTarget,
      customSlug,
      enabled: true,
      order: items.length + 1,
      isExternal,
      externalUrl: isExternal ? newExternalUrl.trim() : undefined,
      highlight: newHighlight
    };

    const updated = [...items, newItem];
    setItems(updated);
    updateMenuItems(updated);
    setIsAddModalOpen(false);

    // Reset Form
    setNewLabel('');
    setNewTargetType('core');
    setNewExternalUrl('');
    setNewHighlight(false);
    onShowToast(`"${newItem.label}" added to menu bar`);
  };

  const corePagesList: { value: PageType; label: string }[] = [
    { value: 'home', label: 'Home Page' },
    { value: 'about', label: 'About Us' },
    { value: 'services', label: 'Services & Departments' },
    { value: 'packages', label: 'Health Packages' },
    { value: 'tests', label: 'All Tests Catalog' },
    { value: 'home-collection', label: 'Home Sample Collection' },
    { value: 'why-choose-us', label: 'Why Choose Us' },
    { value: 'reports', label: 'Patient Reports Portal' },
    { value: 'blog', label: 'Health Blog & Articles' },
    { value: 'faq', label: 'Patient FAQs & Support' },
    { value: 'contact', label: 'Contact & Branch Locations' },
    { value: 'book-test', label: 'Test Booking Flow' }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Top Header Action Buttons: LIS Login */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-sky-50 text-sky-600 rounded-xl">
              <Database className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Header Top-Right LIS Login Option</h3>
                <span className="px-2 py-0.5 bg-sky-100 text-sky-800 text-[10px] font-bold rounded-md">
                  Top Bar Action
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Change the destination link for the "LIS Login" button located at the top right of the website.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <a
              href={lisPortalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <span>Test Link</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              type="button"
              onClick={handleSaveLis}
              className="px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm shadow-sky-600/30 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save LIS URL</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex-1 space-y-1">
            <label className="text-xs font-bold text-slate-700 block">LIS Login Target URL (Hyperlink)</label>
            <input
              type="url"
              value={lisPortalUrl}
              onChange={(e) => setLisPortalUrl(e.target.value)}
              placeholder="https://microcellsdiagnostic.in/pages/login.aspx"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <button
            type="button"
            onClick={() => {
              setLisPortalUrl('https://microcellsdiagnostic.in/pages/login.aspx');
              updateLabInfo({ lisPortalUrl: 'https://microcellsdiagnostic.in/pages/login.aspx' });
              onShowToast('Reset LIS URL to default');
            }}
            className="self-end px-3.5 py-2.5 text-xs text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Reset Default
          </button>
        </div>
      </div>
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="p-2 bg-teal-500/10 text-teal-600 rounded-xl">
              <Compass className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
              Menu Bar & Navigation Manager
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
            Customize header menu links, add new custom pages or external links, reorder navigation items, rename labels, and toggle visibility.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            onClick={handleResetToDefaults}
            className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-xs transition-all flex items-center gap-1.5"
            title="Reset to default menu links"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Default</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-5 py-3 bg-teal-600 hover:bg-teal-500 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-lg shadow-teal-900/15 hover:shadow-teal-900/25 active:scale-98 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Menu Item</span>
          </button>
        </div>
      </div>

      {/* Live Visual Preview of Navigation Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Live Menu Preview (Desktop View)</h3>
          <span className="text-[11px] text-teal-600 font-semibold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
            Synchronized with Header
          </span>
        </div>

        <div className="p-4 bg-slate-900 rounded-2xl overflow-x-auto flex items-center gap-1">
          {items.filter(it => it.enabled).map((item, idx) => (
            <div
              key={item.id}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                item.highlight 
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40' 
                  : 'text-slate-300 hover:text-white bg-slate-800/50'
              }`}
            >
              <span>{item.label}</span>
              {item.highlight && <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>}
              {item.isExternal && <ExternalLink className="w-3 h-3 text-slate-400" />}
            </div>
          ))}
        </div>
      </div>

      {/* Menu Items List */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">Current Menu Items ({items.length})</h3>
          <p className="text-xs text-slate-500">Reorder with arrows, rename titles inline, or toggle visibility</p>
        </div>

        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                item.enabled 
                  ? 'bg-slate-50/80 border-slate-200 hover:border-slate-300' 
                  : 'bg-slate-100/50 border-slate-200/60 opacity-60'
              }`}
            >
              {/* Left Info & Reordering */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {/* Order Controls */}
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                    className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 hover:bg-slate-200/60 rounded-md"
                    title="Move Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[11px] font-mono font-bold text-slate-500">
                    #{index + 1}
                  </span>
                  <button
                    onClick={() => handleMoveDown(index)}
                    disabled={index === items.length - 1}
                    className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 hover:bg-slate-200/60 rounded-md"
                    title="Move Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Inline Editable Label */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={item.label}
                      onChange={(e) => handleUpdateLabel(item.id, e.target.value)}
                      className="font-bold text-sm text-slate-900 bg-transparent border-b border-dashed border-slate-300 hover:border-slate-400 focus:border-teal-500 focus:outline-none px-1 py-0.5 max-w-[200px]"
                    />
                    {item.highlight && (
                      <span className="px-2 py-0.5 bg-teal-100 text-teal-700 text-[10px] font-bold rounded-md">
                        Highlighted
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                    <span className="font-medium">
                      Target: {item.isExternal ? `External (${item.externalUrl})` : item.page === 'custom-page' ? `Custom Page (${item.customSlug})` : item.page}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Controls */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                {/* Highlight Pill Toggle */}
                <button
                  onClick={() => handleToggleHighlight(item.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                    item.highlight 
                      ? 'bg-teal-50 text-teal-700 border-teal-200' 
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                  title="Highlight with pill accent"
                >
                  <Sparkles className="w-3 h-3 text-teal-600" />
                  <span className="hidden sm:inline">Highlight</span>
                </button>

                {/* Visibility Toggle */}
                <button
                  onClick={() => handleToggle(item.id)}
                  className={`p-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                    item.enabled 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                      : 'bg-slate-200 text-slate-500 border-slate-300 hover:bg-slate-300'
                  }`}
                  title={item.enabled ? 'Click to Hide from Menu' : 'Click to Show in Menu'}
                >
                  {item.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>

                {/* Delete button */}
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                  title="Delete menu item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Menu Item Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="p-2 bg-teal-50 text-teal-600 rounded-xl">
                  <Compass className="w-5 h-5" />
                </span>
                <h3 className="text-lg font-bold text-slate-900 font-display">Add New Menu Item</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddItem} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Menu Title / Label *</label>
                <input
                  type="text"
                  required
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="e.g. Corporate Health, FAQ, Doctors"
                  className="w-full text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Target Link Type</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewTargetType('core')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      newTargetType === 'core' 
                        ? 'bg-teal-600 text-white border-teal-600' 
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Core Page
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewTargetType('custom')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      newTargetType === 'custom' 
                        ? 'bg-teal-600 text-white border-teal-600' 
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Custom Page
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewTargetType('external')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      newTargetType === 'external' 
                        ? 'bg-teal-600 text-white border-teal-600' 
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    External Link
                  </button>
                </div>
              </div>

              {newTargetType === 'core' && (
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Select Public Core View</label>
                  <select
                    value={newCorePage}
                    onChange={(e) => setNewCorePage(e.target.value as PageType)}
                    className="w-full text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    {corePagesList.map(p => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                </div>
              )}

              {newTargetType === 'custom' && (
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Select Custom CMS Page</label>
                  {customPages.length > 0 ? (
                    <select
                      value={newCustomSlug}
                      onChange={(e) => setNewCustomSlug(e.target.value)}
                      className="w-full text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      {customPages.map(page => (
                        <option key={page.id} value={page.slug}>
                          {page.title} (/{page.slug})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-xs text-amber-600 bg-amber-50 p-3 rounded-xl border border-amber-200">
                      No custom pages created yet. You can create custom pages in the "Pages CMS" tab.
                    </p>
                  )}
                </div>
              )}

              {newTargetType === 'external' && (
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">External URL (e.g. https://...)</label>
                  <input
                    type="url"
                    required
                    value={newExternalUrl}
                    onChange={(e) => setNewExternalUrl(e.target.value)}
                    placeholder="https://appointment.hospital.com"
                    className="w-full text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="newHighlightCheck"
                  checked={newHighlight}
                  onChange={(e) => setNewHighlight(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                />
                <label htmlFor="newHighlightCheck" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  Highlight as key CTA (colored button in menu)
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold shadow-md shadow-teal-900/10"
                >
                  Add to Navigation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
