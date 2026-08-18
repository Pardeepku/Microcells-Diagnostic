import React, { useState } from 'react';
import { 
  BookOpen, 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  Calendar, 
  Clock, 
  User, 
  X, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { BlogPost, PageType } from '../../types';
import { useData } from '../../context/DataContext';

interface AdminBlogTabProps {
  onShowToast: (msg: string) => void;
  onPreviewPost?: (slug: string) => void;
}

const BLOG_CATEGORIES: BlogPost['category'][] = [
  'Test Preparation',
  'Report Interpretation',
  'Preventive Health',
  'Disease Awareness',
  'Lab Technology'
];

export const AdminBlogTab: React.FC<AdminBlogTabProps> = ({ onShowToast, onPreviewPost }) => {
  const { blogPosts, addBlogPost, updateBlogPost, deleteBlogPost } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState<BlogPost['category']>('Test Preparation');
  const [author, setAuthor] = useState('Dr. Pardeep Saini, MD');
  const [authorRole, setAuthorRole] = useState('Consultant Clinical Pathologist');
  const [readTime, setReadTime] = useState('4 min read');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=1200');
  const [contentInput, setContentInput] = useState('');
  const [takeawaysInput, setTakeawaysInput] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  const filteredPosts = blogPosts.filter(p => {
    const matchesSearch = 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleOpenAdd = () => {
    setEditingPostId(null);
    setTitle('');
    setSlug('');
    setExcerpt('');
    setCategory('Test Preparation');
    setAuthor('Dr. Pardeep Saini, MD');
    setAuthorRole('Chief Pathologist & Medical Director');
    setReadTime('4 min read');
    setImageUrl('https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=1200');
    setContentInput('Sample testing requires strict procedural precision and accurate calibration.\n\nPatients are advised to follow medical fasting recommendations accurately for lipid and glucose investigations.\n\nConsult our laboratory specialists for personalized diagnostic guidance.');
    setTakeawaysInput('Follow fasting instructions strictly, Carry your physician prescription, Download verified PDF reports online');
    setTagsInput('Pathology, Diagnostic Health, Fasting Guidelines, Preventive Care');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: BlogPost) => {
    setEditingPostId(p.id);
    setTitle(p.title);
    setSlug(p.slug);
    setExcerpt(p.excerpt);
    setCategory(p.category);
    setAuthor(p.author);
    setAuthorRole(p.authorRole);
    setReadTime(p.readTime);
    setImageUrl(p.imageUrl);
    setContentInput(p.content.join('\n\n'));
    setTakeawaysInput(p.keyTakeaways.join(', '));
    setTagsInput(p.tags.join(', '));
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, postTitle: string) => {
    if (window.confirm(`Are you sure you want to delete article "${postTitle}"?`)) {
      deleteBlogPost(id);
      onShowToast('Article deleted successfully');
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!editingPostId) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !excerpt.trim()) {
      alert('Please enter a valid title and excerpt.');
      return;
    }

    const paragraphs = contentInput
      .split('\n\n')
      .map(p => p.trim())
      .filter(p => p.length > 0);

    const takeaways = takeawaysInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    const postPayload = {
      title: title.trim(),
      slug: slug.trim() || `post-${Date.now()}`,
      excerpt: excerpt.trim(),
      category,
      author: author.trim() || 'Medical Editorial Team',
      authorRole: authorRole.trim() || 'Clinical Reviewer',
      date: formattedDate,
      readTime: readTime.trim() || '3 min read',
      imageUrl: imageUrl.trim() || 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=1200',
      content: paragraphs.length > 0 ? paragraphs : [excerpt.trim()],
      keyTakeaways: takeaways.length > 0 ? takeaways : ['Consult your doctor for medical advice'],
      tags: tags.length > 0 ? tags : ['Health', 'Diagnostics']
    };

    if (editingPostId) {
      updateBlogPost(editingPostId, postPayload);
      onShowToast(`Updated article "${postPayload.title}"`);
    } else {
      addBlogPost(postPayload);
      onShowToast(`Published article "${postPayload.title}"`);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-rose-600" />
            <h2 className="text-xl font-bold text-slate-900 font-display">Pathology & Health Blog Manager</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Publish educational articles on test preparation, report interpretation, preventive wellness, and pathology breakthroughs.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-rose-900 hover:bg-rose-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4 text-rose-300" />
          <span>Publish New Article</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search articles by title, excerpt, author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {['All', ...BLOG_CATEGORIES].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-rose-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <div 
            key={post.id}
            className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-all group"
          >
            <div>
              <div className="relative h-44 bg-slate-100 overflow-hidden">
                <img 
                  src={post.imageUrl} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 bg-slate-900/80 backdrop-blur-xs text-white rounded-lg text-[10px] font-bold">
                  {post.category}
                </span>
              </div>

              <div className="p-5 space-y-2.5">
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

                <h3 className="text-base font-bold text-slate-900 font-display line-clamp-2">
                  {post.title}
                </h3>

                <p className="text-xs text-slate-500 line-clamp-2">
                  {post.excerpt}
                </p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="truncate">By {post.author}</span>
                  <span className="text-slate-400 font-mono text-[10px]">/{post.slug}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-1 text-[10px] text-slate-400">
                <span>{post.keyTakeaways.length} Key Points</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(post)}
                  className="px-3 py-1 text-xs font-bold text-rose-800 hover:bg-rose-100 rounded-lg transition-all flex items-center gap-1"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => handleDelete(post.id, post.title)}
                  className="p-1 text-rose-500 hover:bg-rose-100 rounded-lg transition-all"
                  title="Delete Article"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Add / Edit Article Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8 space-y-6 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-display">
                  {editingPostId ? 'Edit Health Article' : 'Publish New Health Article'}
                </h3>
                <p className="text-xs text-slate-500">Author comprehensive patient education content.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Article Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Understanding Fasting Requirements for Accurate Blood Tests"
                  value={title}
                  onChange={handleTitleChange}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as BlogPost['category'])}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  >
                    {BLOG_CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">URL Slug *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. understanding-fasting-blood-tests"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-600 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Estimated Read Time</label>
                  <input
                    type="text"
                    placeholder="e.g. 4 min read"
                    value={readTime}
                    onChange={(e) => setReadTime(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Author Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Pardeep Saini, MD"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Author Clinical Role</label>
                  <input
                    type="text"
                    placeholder="e.g. Consultant Clinical Pathologist"
                    value={authorRole}
                    onChange={(e) => setAuthorRole(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Cover Image URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Summary / Excerpt *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="A brief 1-2 sentence preview for cards and search engines..."
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Article Content (Separate paragraphs with double Enter)</label>
                <textarea
                  rows={5}
                  placeholder="Full clinical explanation and guidance for patients..."
                  value={contentInput}
                  onChange={(e) => setContentInput(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none leading-relaxed font-sans"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Key Clinical Takeaways (Comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Fasting means no food or sugary drinks, Water is strictly permitted, Report abnormalities immediately"
                  value={takeawaysInput}
                  onChange={(e) => setTakeawaysInput(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Keywords & Tags (Comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Pathology, Fasting, Lipid Profile, Diabetes, Guidelines"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-rose-900 hover:bg-rose-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all"
                >
                  {editingPostId ? 'Save Changes' : 'Publish Article'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
