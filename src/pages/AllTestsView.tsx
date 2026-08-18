import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  Check, 
  Plus, 
  Calendar, 
  Eye, 
  Droplet, 
  Clock, 
  Sparkles, 
  ArrowUpDown, 
  X,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { PageType, CartItem, TestItem, HealthPackage } from '../types';
import { POPULAR_TESTS, DIAGNOSTIC_DEPARTMENTS } from '../data/labData';
import { TestCard } from '../components/TestCard';

interface AllTestsViewProps {
  onNavigate: (page: PageType, param?: string) => void;
  cart?: CartItem[];
  onAddToCart: (item: CartItem) => void;
  onRemoveFromCart: (id: string) => void;
  onBookNow: (item: CartItem) => void;
  onViewDetails?: (item: TestItem | HealthPackage, type: 'test' | 'package') => void;
  onViewTestDetails?: (item: TestItem | HealthPackage, type: 'test' | 'package') => void;
}

export const AllTestsView: React.FC<AllTestsViewProps> = ({
  onNavigate,
  cart = [],
  onAddToCart,
  onRemoveFromCart,
  onBookNow,
  onViewDetails,
  onViewTestDetails
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedConcern, setSelectedConcern] = useState<string>('All');
  const [fastingFilter, setFastingFilter] = useState<'all' | 'fasting' | 'non-fasting'>('all');
  const [sortBy, setSortBy] = useState<'popularity' | 'price-asc' | 'price-desc' | 'name'>('popularity');

  const handleDetails = (item: TestItem | HealthPackage, type: 'test' | 'package') => {
    if (onViewDetails) onViewDetails(item, type);
    else if (onViewTestDetails) onViewTestDetails(item, type);
  };

  const categories = ['All', 'Clinical Pathology', 'Hematology', 'Biochemistry', 'Immunology & Serology', 'Microbiology', 'Histopathology & Cytology'];
  const concerns = ['All', 'General Wellness', 'Diabetes', 'Heart', 'Liver', 'Kidney', 'Thyroid', 'Vitamins', 'Infection / Fever', 'Bone & Joint'];

  const cartItemIds = useMemo(() => new Set(cart.map(c => c.id)), [cart]);

  // Filter & Sort logic
  const filteredTests = useMemo(() => {
    let result = POPULAR_TESTS.filter(test => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = test.name.toLowerCase().includes(q);
        const matchesCode = test.code.toLowerCase().includes(q);
        const matchesCategory = test.category.toLowerCase().includes(q);
        const matchesConcern = test.healthConcern?.toLowerCase().includes(q);
        const matchesParams = test.parametersList.some(p => p.toLowerCase().includes(q));
        if (!matchesName && !matchesCode && !matchesCategory && !matchesConcern && !matchesParams) {
          return false;
        }
      }

      // Category
      if (selectedCategory !== 'All' && test.category !== selectedCategory) {
        return false;
      }

      // Concern
      if (selectedConcern !== 'All' && test.healthConcern !== selectedConcern) {
        return false;
      }

      // Fasting
      if (fastingFilter === 'fasting' && !test.fastingRequired) return false;
      if (fastingFilter === 'non-fasting' && test.fastingRequired) return false;

      return true;
    });

    // Sorting
    return result.sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
    });
  }, [searchQuery, selectedCategory, selectedConcern, fastingFilter, sortBy]);

  const hasActiveFilters = searchQuery || selectedCategory !== 'All' || selectedConcern !== 'All' || fastingFilter !== 'all' || sortBy !== 'popularity';

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedConcern('All');
    setFastingFilter('all');
    setSortBy('popularity');
  };

  return (
    <div className="space-y-10 py-8">
      
      {/* Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-teal-950 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          <div className="max-w-3xl space-y-3 relative z-10">
            <span className="px-3 py-1 bg-teal-500/20 text-teal-300 text-xs font-bold rounded-full border border-teal-500/30 uppercase tracking-wider inline-block">
              Pathology Test Directory
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display">
              All Diagnostic Tests & Investigations
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Explore our extensive directory of routine blood investigations, specialized hormonal assays, culture panels, and cellular profiles.
            </p>
          </div>
        </div>
      </section>

      {/* Main Catalog with Sidebar Filters & Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Search & Sort Top Toolbar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs mb-8 space-y-4">
          
          <div className="flex flex-col md:flex-row items-center gap-4">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search test by name, short code (e.g. CBC, LFT, TSH), or parameter..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
              <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="popularity">Most Popular First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>
          </div>

          {/* Department Filter Pills */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase font-bold text-slate-400">Department / Category:</span>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-rose-600 font-medium hover:underline flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Reset All Filters</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-blue-900 text-white shadow-xs'
                      : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Health Concern Filter Pills */}
          <div className="space-y-1.5">
            <span className="text-[11px] uppercase font-bold text-slate-400">Health Concern:</span>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {concerns.map(c => (
                <button
                  key={c}
                  onClick={() => setSelectedConcern(c)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all ${
                    selectedConcern === c
                      ? 'bg-teal-700 text-white font-bold'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Fasting Toggle */}
          <div className="flex items-center gap-3 pt-2 text-xs text-slate-600">
            <span className="text-[11px] uppercase font-bold text-slate-400">Fasting Requirement:</span>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="fasting"
                checked={fastingFilter === 'all'}
                onChange={() => setFastingFilter('all')}
                className="text-teal-600 focus:ring-teal-500"
              />
              <span>All Tests</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="fasting"
                checked={fastingFilter === 'fasting'}
                onChange={() => setFastingFilter('fasting')}
                className="text-teal-600 focus:ring-teal-500"
              />
              <span>Fasting Required</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="fasting"
                checked={fastingFilter === 'non-fasting'}
                onChange={() => setFastingFilter('non-fasting')}
                className="text-teal-600 focus:ring-teal-500"
              />
              <span>No Fasting Needed</span>
            </label>
          </div>

        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs text-slate-500 font-medium">
            Showing <strong className="text-slate-900">{filteredTests.length}</strong> pathology tests & investigations
          </p>
          <span className="text-xs text-teal-800 font-semibold bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-100">
            Same-day digital reports available
          </span>
        </div>

        {/* Tests Grid */}
        {filteredTests.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredTests.map(test => (
              <TestCard
                key={test.id}
                test={test}
                isInCart={cartItemIds.has(test.id)}
                onAddToCart={onAddToCart}
                onRemoveFromCart={onRemoveFromCart}
                onBookNow={onBookNow}
                onViewDetails={(t) => handleDetails(t, 'test')}
              />
            ))}
          </div>
        ) : (
          <div className="p-16 text-center bg-white rounded-3xl border border-slate-200 space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Search className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">No diagnostic tests found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                We couldn't find tests matching your search or filters. Try resetting the filters or check our preventive health packages.
              </p>
            </div>
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-blue-900 text-white rounded-xl text-xs font-bold hover:bg-blue-800 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}

      </section>

    </div>
  );
};
