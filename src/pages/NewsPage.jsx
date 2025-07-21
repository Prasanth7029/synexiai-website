import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { fnUrl } from '../lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaRobot,
  FaDatabase,
  FaLeaf,
  FaSearch,
  FaChartLine,
  FaRegNewspaper,
  FaRegClock,
  FaVideo,
  FaNewspaper,
  FaExclamationTriangle,
  FaArrowRight,
  FaChevronLeft,
  FaChevronRight,
  FaArrowUp,
  FaTimes
} from 'react-icons/fa';
import { useMediaQuery } from 'react-responsive';

// Constants
const CATEGORIES = [
  { id: 'all', name: 'All News', icon: <FaRegNewspaper /> },
  { id: 'ai', name: 'AI', icon: <FaRobot /> },
  { id: 'database', name: 'Database', icon: <FaDatabase /> },
  { id: 'renewable', name: 'Renewable', icon: <FaLeaf /> },
  { id: 'innovation', name: 'Innovation', icon: <FaChartLine /> }
];

const CONTENT_TYPES = [
  { id: 'all', name: 'All' },
  { id: 'video', name: 'Videos' },
  { id: 'blog', name: 'Articles' }
];

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
  const colors = {
    ai: 'from-purple-500 to-indigo-500',
    database: 'from-cyan-500 to-blue-500',
    renewable: 'from-green-500 to-emerald-500',
    innovation: 'from-orange-500 to-amber-500',
    default: 'from-gray-500 to-slate-500'
  };
  return colors[category] || colors.default;
};

const getCategoryIcon = (categoryId) => {
  const icons = {
    ai: <FaRobot className="text-purple-400" />,
    database: <FaDatabase className="text-cyan-400" />,
    renewable: <FaLeaf className="text-green-400" />,
    innovation: <FaChartLine className="text-orange-400" />
  };
  return icons[categoryId] || null;
};

// Components
const ContentCard = React.memo(({ article, categories = [], layout = 'grid' }) => {
  const [imageError, setImageError] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 767 });

  return (
    <motion.div
      whileHover={{ y: layout === 'carousel' ? 0 : -5 }}
      className={`relative bg-white/5 dark:bg-gray-900/60 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col h-[480px]  ${
        layout === 'carousel' ? (isMobile ? 'w-[92vw] max-w-[380px]' : 'w-[360px]') : 'w-full'
      }`}
    >
      {/* Video */}
      {article.type === 'video' && (
        <div className="relative pt-[56.25%] bg-black flex-shrink-0">
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
        <div className="h-48 overflow-hidden bg-gray-800">
          <img
            loading="lazy"
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
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

      <div className="p-5 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center space-x-2">
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getCategoryColor(article.category)}`}>
              {categories.find(c => c.id === article.category)?.name || article.category}
            </span>
            <span className="text-xs text-gray-400 flex items-center">
              {article.type === 'video' ? <FaVideo className="mr-1" /> : <FaNewspaper className="mr-1" />}
              {article.type}
            </span>
          </div>
          <span className="text-xs text-gray-400 flex items-center">
            <FaRegClock className="mr-1" /> {formatDate(article.date)}
          </span>
        </div>

        <h3 className="text-lg md:text-xl font-bold mb-2 text-white line-clamp-2">{article.title}</h3>
        {article.description && (
          <p className="text-gray-300 mb-3 line-clamp-2 text-sm">{article.description}</p>
        )}

        <div className="flex justify-between items-center mt-4">
          <span className="text-xs font-medium text-gray-400 bg-gray-800/50 px-2 py-1 rounded">
            {article.source || 'Unknown source'}
          </span>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:text-cyan-300 text-sm font-medium flex items-center group"
          >
            {article.type === 'video' ? 'Watch' : 'Read'}
            <FaArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </motion.div>
  );
});

const ContentCarousel = React.memo(({ items, title, onViewAll, type, categories }) => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const carouselRef = React.useRef(null);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <div className="mb-12 relative group">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl md:text-2xl font-bold text-white">{title}</h2>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-cyan-400 hover:text-cyan-300 flex items-center text-sm font-medium"
          >
            View all <FaArrowRight className="ml-1 h-3 w-3" />
          </button>
        )}
      </div>

      <div className="relative">
        <div
          ref={carouselRef}
          className="flex space-x-5 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
        >
          {items.map((item, index) => (
            <div
              key={`${type}-${item.id}-${index}`}
              className="flex-shrink-0 snap-start w-[360px] h-[480px]"
            >
              <ContentCard
                article={item}
                layout="carousel"
                categories={categories}
              />
            </div>
          ))}
        </div>

        {items.length > (isMobile ? 1 : 3) && (
          <>
            <button
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-gray-800 hover:bg-gray-700 rounded-full p-2 shadow-lg z-10 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <FaChevronLeft className="text-white text-lg" />
            </button>
            <button
              onClick={scrollRight}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-gray-800 hover:bg-gray-700 rounded-full p-2 shadow-lg z-10 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <FaChevronRight className="text-white text-lg" />
            </button>
          </>
        )}
      </div>
    </div>
  );
});

const CategorySection = React.memo(({
  category,
  articles,
  categories,
  onViewAll,
  activeContentType,
  setActiveContentType
}) => {
  const [filteredArticles, videos, blogs] = useMemo(() => {
    const filtered = articles.filter(a => a.category === category.id);
    return [
      filtered,
      filtered.filter(a => a.type === 'video'),
      filtered.filter(a => a.type === 'blog' || a.type === 'article')
    ];
  }, [articles, category.id]);

  return (
    <section id={category.id} className="mb-16 scroll-mt-16">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center">
          {getCategoryIcon(category.id) && (
            <span className="mr-3">{getCategoryIcon(category.id)}</span>
          )}
          <span className={`bg-gradient-to-r bg-clip-text text-transparent ${getCategoryColor(category.id)}`}>
            {category.name}
          </span>
        </h2>
        {onViewAll && (
          <button
            onClick={() => onViewAll(category.id)}
            className="text-cyan-400 hover:text-cyan-300 flex items-center text-sm font-medium"
          >
            View all <FaArrowRight className="ml-1 h-3 w-3" />
          </button>
        )}
      </div>

      <div className="mb-6 flex space-x-1 bg-gray-800/50 rounded-lg p-1">
        {CONTENT_TYPES.map(type => (
          <button
            key={type.id}
            onClick={() => setActiveContentType(type.id)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex-1 text-center ${
              activeContentType === type.id
                ? 'bg-gray-700 text-white shadow'
                : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/30'
            }`}
          >
            {type.name}
          </button>
        ))}
      </div>

      {activeContentType === 'all' && (
        <>
          {videos.length > 0 && (
            <ContentCarousel
              items={videos}
              title="Featured Videos"
              type="video"
              categories={categories}
            />
          )}
          {blogs.length > 0 && (
            <ContentCarousel
              items={blogs}
              title="Latest Articles"
              type="blog"
              categories={categories}
            />
          )}
          {filteredArticles.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No content found in this category
            </div>
          )}
        </>
      )}

      {activeContentType === 'video' && (
        <>
          {videos.length > 0 ? (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-fr"
            >
              {videos.map(article => (
                <motion.div
                  key={`video-${article.id}`}
                  className="h-full flex"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                >
                  <ContentCard article={article} categories={categories} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No videos found in this category
            </div>
          )}
        </>
      )}

      {activeContentType === 'blog' && (
        <>
          {blogs.length > 0 ? (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-fr"
            >
              {blogs.map(article => (
                <motion.div
                  key={`blog-${article.id}`}
                  className="h-full flex"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                >
                  <ContentCard article={article} categories={categories} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No articles found in this category
            </div>
          )}
        </>
      )}
    </section>
  );
});

export default function NewsPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeContentType, setActiveContentType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [errorCount, setErrorCount] = useState(0);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 767 });

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setErrorCount(0);

      const categoriesToFetch = CATEGORIES
        .filter(c => c.id !== 'all')
        .map(c => c.id);

      const wrap = (p) => p.catch((e) => {
        console.error('Fetch error:', e);
        setErrorCount(n => n + 1);
        return { data: [] };
      });

      try {
        const [newsResults, videoResults, rssResults] = await Promise.all([
          Promise.all(categoriesToFetch.map(cat =>
            wrap(axios.get(`${fnUrl('news-proxy')}?category=${cat}`))
          )),
          Promise.all(categoriesToFetch.map(cat =>
            wrap(axios.get(`${fnUrl('video-proxy')}?category=${cat}`))
          )),
          Promise.all(categoriesToFetch.map(cat =>
            wrap(axios.get(`${fnUrl('rss-proxy')}?category=${cat}`))
          ))
        ]);

        const allArticles = [
          ...newsResults.flatMap(r => r.data.map(item => ({ ...item, type: 'article' }))),
          ...videoResults.flatMap(r => r.data),
          ...rssResults.flatMap(r => r.data)
        ].filter(Boolean);

        setArticles(allArticles);
      } catch (error) {
        console.error('Failed to fetch articles:', error);
        setErrorCount(prev => prev + 1);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      if (activeCategory !== 'all' && article.category !== activeCategory) {
        return false;
      }
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        return (
          article.title?.toLowerCase().includes(term) ||
          (article.description && article.description.toLowerCase().includes(term)) ||
          (article.source && article.source.toLowerCase().includes(term))
        );
      }
      return true;
    });
  }, [articles, activeCategory, searchTerm]);

  const trendingArticles = useMemo(() => {
    return [...articles]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 3);
  }, [articles]);

  const handleViewAll = (categoryId) => {
    setActiveCategory(categoryId);
    if (activeCategory === categoryId) {
      document.getElementById(categoryId)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 text-gray-100">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col">
            <div className="flex justify-between items-center py-4">
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-2xl font-bold"
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-teal-400">
                  Tech Pulse
                </span>
              </motion.h1>

              {isMobile ? (
                <button
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                  aria-label="Toggle menu"
                >
                  {showMobileMenu ? (
                    <FaTimes className="w-5 h-5 text-gray-300" />
                  ) : (
                    <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                </button>
              ) : (
                <div className="hidden md:flex space-x-1 bg-gray-800 rounded-lg p-1">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        activeCategory === cat.id
                          ? 'bg-gray-700 text-white shadow'
                          : 'text-gray-300 hover:bg-gray-700/50'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search bar */}
            <div className="pb-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <FaSearch />
                </div>
                <input
                  type="text"
                  placeholder="Search AI, database, or renewable energy content..."
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-gray-800/50 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
                  >
                    <FaTimes className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {showMobileMenu && isMobile && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden bg-gray-800/50"
            >
              <div className="px-4 pb-4 grid grid-cols-2 gap-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveCategory(cat.id);
                      setShowMobileMenu(false);
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center transition-colors ${
                      activeCategory === cat.id
                        ? 'bg-gradient-to-r from-cyan-600 to-teal-500 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <span className="mr-2">{cat.icon}</span>
                    {cat.name}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Notice */}
        {errorCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-yellow-900/30 border border-yellow-500/20 rounded-lg p-3 mb-6 flex items-center"
          >
            <FaExclamationTriangle className="text-yellow-400 mr-3 flex-shrink-0" />
            <p className="text-yellow-300 text-sm">
              {errorCount} data source{errorCount > 1 ? 's' : ''} failed to load. Some content may be missing.
            </p>
          </motion.div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <motion.div
              animate={{
                rotate: 360,
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "linear"
              }}
              className="rounded-full h-14 w-14 border-t-2 border-b-2 border-cyan-500"
            />
          </div>
        ) : (
          <>
            {/* Hero Section */}
            {activeCategory === 'all' && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-16 text-center"
              >
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className="inline-block bg-gradient-to-r from-cyan-600 to-teal-500 text-white px-5 py-1.5 rounded-full mb-5 text-xs font-medium tracking-wide"
                >
                  Industry Insights
                </motion.div>
                <h1 className="text-4xl md:text-5xl font-bold mb-5">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-teal-400">
                    Tech & Innovation Pulse
                  </span>
                </h1>
                <p className="text-gray-300 max-w-3xl mx-auto text-lg">
                  Stay updated with the latest news, videos, and blogs in AI, database technologies, and renewable energy.
                </p>
              </motion.section>
            )}

            {/* Trending Section */}
            {activeCategory === 'all' && trendingArticles.length > 0 && (
              <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-16"
              >
                <h2 className="text-2xl font-bold text-white mb-5">Trending Now</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {trendingArticles.map(article => (
                    <ContentCard
                      key={`trending-${article.id}`}
                      article={article}
                      categories={CATEGORIES}
                    />
                  ))}
                </div>
              </motion.section>
            )}

            {/* Category Content */}
            {activeCategory === 'all' ? (
              CATEGORIES.filter(cat => cat.id !== 'all').map(category => {
                const catArticles = articles.filter(a => a.category === category.id);
                if (catArticles.length === 0) return null;

                return (
                  <CategorySection
                    key={category.id}
                    category={category}
                    articles={articles}
                    categories={CATEGORIES}
                    onViewAll={handleViewAll}
                    activeContentType={activeContentType}
                    setActiveContentType={setActiveContentType}
                  />
                );
              })
            ) : (
              <CategorySection
                category={CATEGORIES.find(c => c.id === activeCategory)}
                articles={filteredArticles}
                categories={CATEGORIES}
                activeContentType={activeContentType}
                setActiveContentType={setActiveContentType}
              />
            )}

            {/* No results */}
            {filteredArticles.length === 0 && !loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="text-5xl mb-3 text-gray-500">🔍</div>
                <h3 className="text-xl font-bold text-gray-300 mb-2">No content found</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  {searchTerm ? 'Try a different search term' : 'No articles available for this category'}
                </p>
              </motion.div>
            )}

            {/* Market Insights */}
            {activeCategory === 'all' && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-16 bg-gradient-to-r from-cyan-900/20 to-teal-900/20 border border-gray-700 rounded-xl p-6"
              >
                <h3 className="text-2xl font-bold text-cyan-400 mb-5 text-center">Market Insights</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {[
                    {
                      title: "AI Market Growth",
                      value: "$1.8T",
                      description: "Projected market value by 2030 at 38% CAGR",
                      color: "from-purple-500 to-indigo-500"
                    },
                    {
                      title: "Database Industry",
                      value: "+24%",
                      description: "Annual growth for AI-optimized database solutions",
                      color: "from-cyan-500 to-blue-500"
                    },
                    {
                      title: "Renewable Energy",
                      value: "$2T",
                      description: "Global investment by 2030, mostly in solar and wind",
                      color: "from-green-500 to-emerald-500"
                    }
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ y: -5 }}
                      className={`bg-gradient-to-br ${item.color} rounded-lg p-5 shadow-lg`}
                    >
                      <h4 className="text-lg font-bold text-white mb-2">{item.title}</h4>
                      <div className="text-2xl font-bold text-white mb-2">{item.value}</div>
                      <p className="text-gray-200 text-sm">{item.description}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Newsletter */}
            {activeCategory === 'all' && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-16 text-center"
              >
                <div className="bg-gradient-to-r from-cyan-900/30 to-teal-900/30 border border-gray-700 rounded-xl p-6 max-w-2xl mx-auto">
                  <h3 className="text-2xl md:text-3xl font-bold text-cyan-300 mb-3">Stay Informed</h3>
                  <p className="text-gray-300 mb-5">
                    Get weekly insights on AI breakthroughs, database innovations, and renewable energy advancements.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <input
                      type="email"
                      placeholder="Your email address"
                      className="px-4 py-2.5 rounded-lg bg-gray-800/50 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent sm:flex-1"
                    />
                    <button className="bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-500 hover:to-teal-400 text-white px-5 py-2.5 rounded-lg font-medium transition-colors">
                      Subscribe
                    </button>
                  </div>
                </div>
              </motion.section>
            )}
          </>
        )}

        {/* Back to top button */}
        {!loading && (
          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-full p-3 shadow-lg z-50 backdrop-blur-sm transition-all"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaArrowUp className="text-cyan-400" />
          </motion.button>
        )}
      </main>
    </div>
  );
}