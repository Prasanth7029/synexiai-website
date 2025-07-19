import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
  FaRobot,
  FaDatabase,
  FaLeaf,
  FaSearch,
  FaFilter,
  FaChartLine,
  FaRegNewspaper,
  FaRegClock,
  FaVideo,
  FaNewspaper,
  FaExclamationTriangle
} from 'react-icons/fa';

// Helpers
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const getCategoryColor = (category) => {
  switch (category) {
    case 'ai': return 'bg-gradient-to-r from-purple-600 to-indigo-600';
    case 'database': return 'bg-gradient-to-r from-cyan-600 to-blue-600';
    case 'renewable': return 'bg-gradient-to-r from-green-600 to-emerald-600';
    case 'innovation': return 'bg-gradient-to-r from-orange-600 to-amber-600';
    default: return 'bg-gradient-to-r from-gray-600 to-slate-600';
  }
};

const getSourceIcon = (type) => {
  switch (type) {
    case 'video': return <FaVideo className="mr-1" />;
    case 'blog': return <FaNewspaper className="mr-1" />;
    default: return null;
  }
};

// Single card component
const ContentCard = ({ article, categories }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-gradient-to-br from-gray-800/30 to-gray-900 border border-cyan-500/20 rounded-2xl overflow-hidden shadow-xl shadow-cyan-500/10"
    >
      {/* Video */}
      {article.type === 'video' && (
        <div className="relative pt-[56.25%]">
          <iframe
            loading="lazy"
            src={article.url}
            title={`Video: ${article.title}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute top-0 left-0 w-full h-full"
          />
        </div>
      )}

      {/* Image for article/blog */}
      {(article.type === 'article' || article.type === 'blog') && article.imageUrl && !imageError && (
        <div className="h-48 overflow-hidden">
          <img
            loading="lazy"
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        </div>
      )}

      {/* Fallback box */}
      {((article.type === 'article' || article.type === 'blog') && (!article.imageUrl || imageError)) && (
        <div className="h-48 bg-gradient-to-r from-cyan-900/20 to-teal-900/20 flex items-center justify-center">
          <div className="text-4xl text-cyan-500 opacity-30">
            {article.type === 'blog' ? <FaNewspaper /> : <FaRegNewspaper />}
          </div>
        </div>
      )}

      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(article.category)}`}>
              {categories.find(c => c.id === article.category)?.name || article.category}
            </span>
            <span className="ml-2 text-xs text-cyan-400 flex items-center">
              {getSourceIcon(article.type)}{article.type}
            </span>
          </div>
          <span className="text-xs text-gray-400 flex items-center">
            <FaRegClock className="mr-1" /> {formatDate(article.date)}
          </span>
        </div>

        <h3 className="text-xl font-bold mb-3 text-cyan-300">{article.title}</h3>
        {article.description && (
          <p className="text-gray-300 mb-4 line-clamp-3">{article.description}</p>
        )}

        <div className="flex justify-between items-center mt-6">
          <span className="text-xs font-medium text-gray-400 bg-gray-700/50 px-2 py-1 rounded">
            {article.source || 'Unknown source'}
          </span>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:text-cyan-300 text-sm font-medium flex items-center"
          >
            {article.type === 'video' ? 'Watch' : 'Read More'}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default function NewsPage() {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [errorCount, setErrorCount] = useState(0);

  const categories = [
    { id: 'all', name: 'All News', icon: <FaRegNewspaper /> },
    { id: 'ai', name: 'Artificial Intelligence', icon: <FaRobot /> },
    { id: 'database', name: 'Database Tech', icon: <FaDatabase /> },
    { id: 'renewable', name: 'Renewable Energy', icon: <FaLeaf /> },
    { id: 'innovation', name: 'Tech Innovations', icon: <FaChartLine /> }
  ];

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setErrorCount(0);

      // derive cat IDs sans 'all'
      const categoriesToFetch = categories
        .filter(c => c.id !== 'all')
        .map(c => c.id);

      // wrap each call in catch to count errors
      const wrap = (p) => p.catch((e) => { setErrorCount(n => n + 1); return { data: [] }; });

      const newsResults  = await Promise.all(categoriesToFetch.map(cat =>
        wrap(axios.get(`/.netlify/functions/news-proxy?category=${cat}`))
      ));
      const videoResults = await Promise.all(categoriesToFetch.map(cat =>
        wrap(axios.get(`/.netlify/functions/video-proxy?category=${cat}`))
      ));
      const rssResults   = await Promise.all(categoriesToFetch.map(cat =>
        wrap(axios.get(`/.netlify/functions/rss-proxy?category=${cat}`))
      ));

      // merge, trusting proxies for type on video/blog
      const allArticles = [
        ...newsResults.flatMap(r => r.data.map(item => ({ ...item, type: 'article' }))),
        ...videoResults.flatMap(r => r.data),
        ...rssResults.flatMap(r => r.data)
      ];

      setArticles(allArticles);
      setFilteredArticles(allArticles);
      setLoading(false);
    };

    fetchNews();
  }, []);

  // filtering
  useEffect(() => {
    let result = articles;
    if (activeCategory !== 'all') {
      result = result.filter(a => a.category === activeCategory);
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(a =>
        a.title.toLowerCase().includes(term) ||
        (a.description && a.description.toLowerCase().includes(term)) ||
        (a.source && a.source.toLowerCase().includes(term))
      );
    }
    setFilteredArticles(result);
  }, [activeCategory, searchTerm, articles]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-block bg-gradient-to-r from-cyan-600 to-teal-500 text-white px-6 py-2 rounded-full mb-6 text-sm font-medium">
            Industry Insights
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-400">
              Tech & Innovation Pulse
            </span>
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Stay updated with the latest news, videos, and blogs in AI, database technologies, and renewable energy.
          </p>
        </motion.div>

        {/* Error Notice */}
        {errorCount > 0 && (
          <div className="bg-yellow-900/50 border border-yellow-500/30 rounded-lg p-4 mb-6 flex items-center">
            <FaExclamationTriangle className="text-yellow-400 mr-3 text-xl" />
            <p className="text-yellow-300">
              {errorCount} data source{errorCount > 1 ? 's' : ''} failed to load. Some content may be missing.
            </p>
          </div>
        )}

        {/* Search & Filter */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-10">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <FaSearch />
              </div>
              <input
                type="text"
                placeholder="Search AI, database, or renewable energy content..."
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-800/50 text-white border border-cyan-500/20 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="bg-gray-800/50 rounded-lg border border-cyan-500/20 p-3 flex items-center">
              <FaFilter className="text-gray-400 mr-2" />
              <select
                className="bg-transparent text-white focus:outline-none"
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
                aria-pressed={activeCategory}
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                aria-pressed={activeCategory === cat.id}
                className={`flex items-center px-4 py-2 rounded-full transition-all ${
                  activeCategory === cat.id
                    ? 'bg-gradient-to-r from-cyan-600 to-teal-500 text-white'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                }`}
              >
                <span className="mr-2">{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Content Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500" />
          </div>
        ) : filteredArticles.length > 0 ? (
          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            {filteredArticles.map(article => (
              <ContentCard key={article.id} article={article} categories={categories} />
            ))}
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <div className="text-5xl mb-4 text-gray-500">🔍</div>
            <h3 className="text-xl font-bold text-gray-300 mb-2">No content found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </motion.div>
        )}

        {/* Market Insights Cards (unchanged) */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="mt-16 bg-gradient-to-r from-cyan-900/20 to-teal-900/20 border border-cyan-500/20 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-cyan-400 mb-6 text-center">Market Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800/50 rounded-xl p-6 border border-cyan-500/20">
              <h4 className="text-lg font-bold text-cyan-300 mb-3">AI Market Growth</h4>
              <div className="text-3xl font-bold mb-2">$1.8T</div>
              <p className="text-gray-400 text-sm">Projected market value by 2030 at 38% CAGR</p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-6 border border-cyan-500/20">
              <h4 className="text-lg font-bold text-cyan-300 mb-3">Database Industry</h4>
              <div className="text-3xl font-bold mb-2">+24%</div>
              <p className="text-gray-400 text-sm">Annual growth for AI-optimized database solutions</p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-6 border border-cyan-500/20">
              <h4 className="text-lg font-bold text-cyan-300 mb-3">Renewable Energy</h4>
              <div className="text-3xl font-bold mb-2">$2T</div>
              <p className="text-gray-400 text-sm">Global investment by 2030, mostly in solar and wind</p>
            </div>
          </div>
        </motion.div>

        {/* Newsletter Signup (unchanged) */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="mt-16 text-center">
          <div className="bg-gradient-to-r from-cyan-900/30 to-teal-900/30 border border-cyan-500/20 rounded-2xl p-8 max-w-3xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-cyan-300 mb-4">Stay Informed</h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Get weekly insights on AI breakthroughs, database innovations, and renewable energy advancements.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <input
                type="email"
                placeholder="Your email address"
                className="px-4 py-3 rounded-lg bg-gray-800/50 text-white border border-cyan-500/20 focus:outline-none focus:ring-2 focus:ring-cyan-500 sm:w-64"
              />
              <button className="bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-500 hover:to-teal-400 text-white px-6 py-3 rounded-lg font-medium">
                Subscribe to Updates
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
