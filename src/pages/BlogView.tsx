import React, { useState } from 'react';
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  User, 
  Tag, 
  ArrowRight, 
  ArrowLeft, 
  Share2, 
  CheckCircle2, 
  Search, 
  Sparkles,
  HelpCircle,
  Stethoscope
} from 'lucide-react';
import { BlogPost, PageType, CartItem } from '../types';
import { useData } from '../context/DataContext';

interface BlogViewProps {
  initialSlug?: string | null;
  onNavigate: (page: PageType, param?: string) => void;
  onBookTest: (item?: CartItem) => void;
}

export const BlogView: React.FC<BlogViewProps> = ({
  initialSlug,
  onNavigate,
  onBookTest
}) => {
  const { blogPosts, tests } = useData();
  const [selectedSlug, setSelectedSlug] = useState<string | null>(initialSlug || null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Test Preparation', 'Report Interpretation', 'Preventive Health', 'Disease Awareness', 'Lab Technology'];

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const activeArticle = selectedSlug ? blogPosts.find(p => p.slug === selectedSlug) : null;

  // Single Article View
  if (activeArticle) {
    const relatedTests = tests.filter(t => 
      activeArticle.tags?.some(tag => t.name.toLowerCase().includes(tag.toLowerCase()) || t.category.toLowerCase().includes(tag.toLowerCase())) ||
      activeArticle.title.toLowerCase().includes(t.name.toLowerCase())
    );

    return (
      <div className="py-8 sm:py-12 max-w-5xl mx-auto px-4 sm:px-6 space-y-8 animate-in fade-in duration-200">
        
        {/* Back Button & Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedSlug(null)}
            className="inline-flex items-center gap-2 text-xs font-bold text-sky-900 hover:text-teal-600 transition-colors bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Health Articles</span>
          </button>

          <span className="text-xs text-slate-500 font-medium">
            Published under <strong className="text-teal-700">{activeArticle.category}</strong>
          </span>
        </div>

        {/* Article Header Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
          
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-sky-100 text-sky-900 text-xs font-bold rounded-full">
                {activeArticle.category}
              </span>
              <span className="text-xs text-slate-400 font-mono">•</span>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{activeArticle.readTime}</span>
              </span>
              <span className="text-xs text-slate-400 font-mono">•</span>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{activeArticle.date}</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display leading-tight">
              {activeArticle.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              {activeArticle.excerpt}
            </p>
          </div>

          {/* Author Byline */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-sky-900 text-white flex items-center justify-center font-bold text-xs">
                Dr
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">{activeArticle.author}</p>
                <p className="text-[11px] text-slate-500">{activeArticle.authorRole}</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Medically Reviewed</span>
              </span>
            </div>
          </div>

          {/* Featured Image */}
          <div className="rounded-2xl overflow-hidden shadow-xs border border-slate-200 h-64 sm:h-96">
            <img
              src={activeArticle.imageUrl}
              alt={activeArticle.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Article Body Content */}
          <div className="prose prose-slate max-w-none text-slate-700 space-y-6 pt-4 text-sm sm:text-base leading-relaxed">
            {activeArticle.content.map((paragraph, idx) => (
              <p key={idx} className="leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Article Key Takeaways Card */}
          <div className="bg-sky-50/80 rounded-2xl p-6 border border-sky-200 space-y-3">
            <h3 className="text-sm font-bold text-sky-950 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span>Clinical Takeaways from Pathologists</span>
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-2 shrink-0"></span>
                <span>Annual or bi-annual diagnostic monitoring enables early detection long before physical symptoms appear.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-2 shrink-0"></span>
                <span>Strict adherence to fasting guidelines (10-12 hours) ensures reliable, repeatable biological baseline values.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-2 shrink-0"></span>
                <span>Always consult your treating physician for holistic clinical correlation of numerical laboratory values.</span>
              </li>
            </ul>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-slate-100">
            <Tag className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs text-slate-500 font-medium">Keywords:</span>
            {activeArticle.tags.map((tag, i) => (
              <span key={i} className="text-xs px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                #{tag}
              </span>
            ))}
          </div>

        </div>

        {/* Relevant Diagnostic Tests to Book */}
        <div className="bg-gradient-to-r from-sky-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs text-teal-300 font-bold uppercase tracking-wider">Related Diagnostic Screening</span>
              <h3 className="text-xl font-bold font-display mt-1">Recommended Laboratory Tests for this Health Topic</h3>
              <p className="text-xs text-slate-300 mt-0.5">Schedule sample collection right from your home or visit our reference center.</p>
            </div>
            <button
              onClick={() => onNavigate('tests')}
              className="px-4 py-2.5 bg-white text-sky-950 hover:bg-slate-100 text-xs font-bold rounded-xl transition-all shrink-0"
            >
              Explore Full Test Catalog
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {tests.slice(0, 2).map((test) => (
              <div key={test.id} className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-2xl p-4 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-[10px] text-teal-300 font-mono block uppercase">{test.category}</span>
                  <h4 className="text-xs font-bold text-white truncate">{test.name}</h4>
                  <p className="text-xs font-bold text-teal-300 mt-1">₹{test.price}</p>
                </div>
                <button
                  onClick={() => onBookTest({
                    id: test.id,
                    type: 'test',
                    name: test.name,
                    price: test.price
                  })}
                  className="px-3.5 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl transition-all shrink-0"
                >
                  Book Test
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    );
  }

  // Blog Directory / Grid View
  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 space-y-12 animate-in fade-in duration-200">
      
      {/* Banner */}
      <section className="bg-gradient-to-r from-sky-950 via-slate-900 to-teal-950 text-white rounded-3xl p-8 sm:p-14 relative overflow-hidden">
        <div className="max-w-3xl space-y-4 relative z-10">
          <span className="px-3 py-1 bg-teal-500/20 text-teal-300 text-xs font-bold rounded-full border border-teal-500/30 uppercase tracking-wider inline-block">
            Medical Insights & Preventive Care
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display">
            Laboratory & Health Knowledge Hub
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Evidence-based diagnostic guides, understanding your biological lab parameters, and practical health screening insights written by senior clinical pathologists.
          </p>
        </div>
      </section>

      {/* Search & Category Filter Bar */}
      <section className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search diagnostic articles, test guides, keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-sky-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

        </div>
      </section>

      {/* Blog Cards Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 font-display">
            {selectedCategory === 'All' ? 'Latest Clinical Articles' : `${selectedCategory} Articles`}
          </h2>
          <span className="text-xs text-slate-500">
            Showing {filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'}
          </span>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No articles found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your search terms or select another category filter.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-sky-900 text-white text-xs font-bold rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                onClick={() => setSelectedSlug(post.slug)}
                className="bg-white rounded-3xl border border-slate-200 shadow-2xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer group"
              >
                <div>
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 bg-sky-900/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg backdrop-blur-xs">
                      {post.category}
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{post.date}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{post.readTime}</span>
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-900 transition-colors leading-snug line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between text-xs mt-3">
                  <span className="text-[11px] font-semibold text-slate-600 truncate">
                    By {post.author}
                  </span>

                  <span className="text-teal-700 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Health Screening Newsletter CTA */}
      <section className="bg-sky-50 rounded-3xl p-8 border border-sky-200 text-center space-y-4 max-w-3xl mx-auto">
        <h3 className="text-xl font-bold text-sky-950">Stay Informed on Diagnostic Health</h3>
        <p className="text-xs text-slate-600 max-w-md mx-auto">
          Get monthly health tips, guidelines on blood test preparation, and special health package offers directly in your inbox.
        </p>
        <div className="max-w-md mx-auto flex gap-2">
          <input
            type="email"
            placeholder="Enter your email address"
            className="flex-1 px-4 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <button
            onClick={() => alert('Thank you for subscribing to Microcells Health Insights!')}
            className="px-5 py-2.5 bg-sky-900 hover:bg-sky-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all"
          >
            Subscribe
          </button>
        </div>
      </section>

    </div>
  );
};
