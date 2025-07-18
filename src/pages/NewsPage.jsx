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
  FaRegClock
} from 'react-icons/fa';

export default function NewsPage() {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Categories specific to SynexisAI's focus
  const categories = [
    { id: 'all', name: 'All News', icon: <FaRegNewspaper /> },
    { id: 'ai', name: 'Artificial Intelligence', icon: <FaRobot /> },
    { id: 'database', name: 'Database Tech', icon: <FaDatabase /> },
    { id: 'renewable', name: 'Renewable Energy', icon: <FaLeaf /> },
    { id: 'innovation', name: 'Tech Innovations', icon: <FaChartLine /> }
  ];

  // Mock data to simulate API response
  const mockNewsData = [
    {
      id: 1,
      title: "OpenAI Releases GPT-5 with Advanced Reasoning Capabilities",
      description: "The new model shows significant improvements in logical reasoning and problem-solving abilities.",
      category: "ai",
      date: "2023-11-15T12:00:00Z",
      source: "TechCrunch",
      url: "#"
    },
    {
      id: 2,
      title: "Google DeepMind's New AI Model Solves Complex Protein Structures",
      description: "Breakthrough could accelerate drug discovery and bioengineering applications.",
      category: "ai",
      date: "2023-11-12T09:30:00Z",
      source: "Nature Journal",
      url: "#"
    },
    {
      id: 3,
      title: "PostgreSQL 15 Released with Performance Improvements",
      description: "Latest version offers up to 25% better performance for analytical workloads.",
      category: "database",
      date: "2023-11-10T14:15:00Z",
      source: "Database Weekly",
      url: "#"
    },
    {
      id: 4,
      title: "MongoDB Unveils AI-Powered Query Optimization",
      description: "New feature uses machine learning to automatically optimize database performance.",
      category: "database",
      date: "2023-11-08T11:20:00Z",
      source: "DevOps Journal",
      url: "#"
    },
    {
      id: 5,
      title: "New Solar Panel Tech Achieves 30% Efficiency Breakthrough",
      description: "Perovskite-silicon tandem cells set new record for solar energy conversion.",
      category: "renewable",
      date: "2023-11-05T16:45:00Z",
      source: "Renewable Energy World",
      url: "#"
    },
    {
      id: 6,
      title: "Wind Turbine Innovations Boost Energy Output by 40%",
      description: "New blade design and AI-optimized positioning dramatically increase efficiency.",
      category: "renewable",
      date: "2023-11-03T10:10:00Z",
      source: "CleanTech News",
      url: "#"
    },
    {
      id: 7,
      title: "AI-Optimized Data Centers Reduce Energy Consumption by 35%",
      description: "Google's new approach uses machine learning to optimize cooling systems in real-time.",
      category: "innovation",
      date: "2023-10-30T13:25:00Z",
      source: "Data Center Frontier",
      url: "#"
    },
    {
      id: 8,
      title: "Blockchain-Based Databases Enhance Security for Financial Systems",
      description: "New approach combines immutability of blockchain with traditional database performance.",
      category: "database",
      date: "2023-10-27T15:30:00Z",
      source: "FinTech Weekly",
      url: "#"
    },
    {
      id: 9,
      title: "Tesla Unveils Next-Gen Energy Storage Solution for Data Centers",
      description: "Megapack systems now optimized for high-demand computing environments.",
      category: "renewable",
      date: "2023-10-25T09:15:00Z",
      source: "Tech Innovation Daily",
      url: "#"
    },
    {
      id: 10,
      title: "Self-Healing Databases: The Future of Autonomous Systems",
      description: "New research shows how AI can automatically detect and repair database issues.",
      category: "ai",
      date: "2023-10-22T14:50:00Z",
      source: "Database Trends",
      url: "#"
    }
  ];

  // Simulate API call with focused queries
  useEffect(() => {
    setLoading(true);

    // In a real application, you would make API calls like this:
    /*
    const fetchNews = async () => {
      try {
        const queries = [
          'AI OR "artificial intelligence"',
          'database OR "data management" OR SQL OR NoSQL',
          '"renewable energy" OR solar OR wind OR "green tech"',
          'innovation OR "emerging technology"'
        ];

        const promises = queries.map(query =>
          axios.get('https://newsapi.org/v2/everything', {
            params: {
              q: query,
              language: 'en',
              sortBy: 'publishedAt',
              pageSize: 5,
              apiKey: import.meta.env.VITE_NEWS_API_KEY
            }
          })
        );

        const results = await Promise.all(promises);
        const allArticles = results.flatMap(res => res.data.articles);
        setArticles(allArticles);
        setFilteredArticles(allArticles);
      } catch (err) {
        console.error('Could not fetch news:', err);
        // Fallback to mock data
        setArticles(mockNewsData);
        setFilteredArticles(mockNewsData);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
    */

    // For demo purposes, using mock data
    setTimeout(() => {
      setArticles(mockNewsData);
      setFilteredArticles(mockNewsData);
      setLoading(false);
    }, 800);
  }, []);

  // Filter articles based on category and search term
  useEffect(() => {
    let result = articles;

    if (activeCategory !== 'all') {
      result = result.filter(article => article.category === activeCategory);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(article =>
        article.title.toLowerCase().includes(term) ||
        article.description.toLowerCase().includes(term) ||
        article.source.toLowerCase().includes(term)
      );
    }

    setFilteredArticles(result);
  }, [activeCategory, searchTerm, articles]);

  // Format date to "Nov 15, 2023" format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Get category color
  const getCategoryColor = (category) => {
    switch(category) {
      case 'ai': return 'bg-gradient-to-r from-purple-600 to-indigo-600';
      case 'database': return 'bg-gradient-to-r from-cyan-600 to-blue-600';
      case 'renewable': return 'bg-gradient-to-r from-green-600 to-emerald-600';
      case 'innovation': return 'bg-gradient-to-r from-orange-600 to-amber-600';
      default: return 'bg-gradient-to-r from-gray-600 to-slate-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-block bg-gradient-to-r from-cyan-600 to-teal-500 text-white px-6 py-2 rounded-full mb-6 text-sm font-medium">
            Industry Insights
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-400">
              Tech & Innovation Pulse
            </span>
          </h1>

          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Stay updated with the latest advancements in AI, database technologies, and renewable energy solutions.
          </p>
        </motion.div>

        {/* Search and Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-10"
        >
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <FaSearch />
              </div>
              <input
                type="text"
                placeholder="Search AI, database, or renewable energy news..."
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-800/50 text-white border border-cyan-500/20 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="bg-gray-800/50 rounded-lg border border-cyan-500/20 p-3 flex items-center">
              <span className="text-gray-400 mr-2"><FaFilter /></span>
              <select
                className="bg-transparent text-white focus:outline-none"
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center px-4 py-2 rounded-full transition-all ${
                  activeCategory === category.id
                    ? 'bg-gradient-to-r from-cyan-600 to-teal-500 text-white'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </motion.div>

        {/* News Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
          </div>
        ) : filteredArticles.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {filteredArticles.map((article) => (
              <motion.div
                key={article.id}
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-gray-800/30 to-gray-900 border border-cyan-500/20 rounded-2xl overflow-hidden shadow-xl shadow-cyan-500/10"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(article.category)}`}>
                      {categories.find(c => c.id === article.category)?.name}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center">
                      <FaRegClock className="mr-1" /> {formatDate(article.date)}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold mb-3 text-cyan-300">{article.title}</h3>
                  <p className="text-gray-300 mb-4">{article.description}</p>

                  <div className="flex justify-between items-center mt-6">
                    <span className="text-xs font-medium text-gray-400 bg-gray-700/50 px-2 py-1 rounded">
                      {article.source}
                    </span>
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 text-sm font-medium flex items-center"
                    >
                      Read More
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-5xl mb-4 text-gray-500">🔍</div>
            <h3 className="text-xl font-bold text-gray-300 mb-2">No articles found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </motion.div>
        )}

        {/* Industry Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 bg-gradient-to-r from-cyan-900/20 to-teal-900/20 border border-cyan-500/20 rounded-2xl p-8"
        >
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

        {/* Newsletter Signup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
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