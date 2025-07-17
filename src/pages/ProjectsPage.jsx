import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const StatCard = ({ icon, label, value }) => (
  <motion.div
    whileHover={{ y: -3 }}
    className="bg-gray-900/50 p-4 rounded-lg border border-cyan-500/10"
  >
    <div className="text-cyan-400 text-2xl mb-2">{icon}</div>
    <div className="text-3xl font-bold">{value}</div>
    <div className="text-gray-400 text-sm">{label}</div>
  </motion.div>
);

const ProjectCard = ({ repo, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    whileHover={{ y: -5 }}
    className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-cyan-400/30 transition-all"
  >
    <div className="flex justify-between items-start mb-4">
      <h3 className="text-xl font-semibold text-cyan-400">
        <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
          {repo.name}
        </a>
      </h3>
      <span className="text-xs text-gray-400">
        {new Date(repo.updated_at).toLocaleDateString()}
      </span>
    </div>

    <p className="text-gray-300 mb-4">{repo.description || 'No description provided'}</p>

    {repo.language && (
      <div className="flex items-center gap-2 mb-4">
        <span
          className="w-3 h-3 rounded-full"
          style={{
            backgroundColor: getLanguageColor(repo.language)
          }}
        ></span>
        <span className="text-sm text-gray-400">{repo.language}</span>
      </div>
    )}

    <div className="flex justify-between text-sm text-gray-400">
      <span>⭐ {repo.stargazers_count}</span>
      <span>🔀 {repo.forks_count}</span>
      <span>👁️ {repo.watchers_count}</span>
    </div>
  </motion.div>
);

const SkillsChart = () => (
  <div className="bg-gray-800/30 p-6 rounded-xl">
    <h3 className="text-xl font-semibold mb-4">Top Technologies</h3>
    <div className="space-y-4">
      {[
        { name: 'React', level: 85 },
        { name: 'Spring Boot', level: 80 },
        { name: 'MongoDB', level: 75 },
        { name: 'Docker', level: 70 },
      ].map(tech => (
        <div key={tech.name}>
          <div className="flex justify-between mb-1">
            <span>{tech.name}</span>
            <span>{tech.level}%</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full">
            <div
              className="h-full bg-cyan-500 rounded-full"
              style={{ width: `${tech.level}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default function ProjectsPage() {
  const [repos, setRepos] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
         try {
           const token = import.meta.env.VITE_GITHUB_TOKEN;
           if (!token) throw new Error("GitHub token not configured");

           const config = {
             headers: { Authorization: `token ${token}` },
             timeout: 5000 // Add timeout
           };

           const [profileRes, reposRes] = await Promise.all([
             axios.get('https://api.github.com/users/Prasanth7029', config),
             axios.get('https://api.github.com/users/Prasanth7029/repos?sort=updated&per_page=6', config)
           ]);

        setProfile(profileRes.data);
        setRepos(reposRes.data);
        setError(null);
      } catch (err) {
        console.error("API Error:", err.response?.status || err.message);
        setError("Failed to fetch GitHub data. Showing sample projects instead.");
        // Fallback to sample data
        setRepos([
          {
            id: 1,
            name: "mindmap-dashboard",
            html_url: "https://github.com/Prasanth7029/mindmap-dashboard",
            description: "An interactive dashboard to organize, visualize, and manage knowledge using AI-powered tagging and search.",
            language: "JavaScript",
            stargazers_count: 12,
            forks_count: 5,
            watchers_count: 8,
            updated_at: new Date().toISOString()
          },
          {
            id: 2,
            name: "inventory-management-system",
            html_url: "https://github.com/Prasanth7029/inventory-management-system",
            description: "Microservices-based inventory platform with real-time stock updates, order tracking, and email alerts.",
            language: "Java",
            stargazers_count: 8,
            forks_count: 3,
            watchers_count: 5,
            updated_at: new Date().toISOString()
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-cyan-400 text-xl">Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-teal-400">
              Project Portfolio
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Showcasing my open-source contributions and technical solutions
          </p>
        </motion.div>

        {error && (
          <div className="bg-red-900/30 border border-red-700 text-red-300 p-4 rounded-lg mb-8">
            {error}
          </div>
        )}

        {/* GitHub Profile Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="md:col-span-2 bg-gray-800/50 backdrop-blur-sm rounded-xl p-6">
            <div className="flex items-center gap-6">
              <img
                src={profile?.avatar_url || "https://avatars.githubusercontent.com/u/583231?v=4"}
                alt="GitHub Avatar"
                className="w-20 h-20 rounded-full border-2 border-cyan-400"
              />
              <div>
                <h2 className="text-2xl font-bold">
                  {profile?.name || profile?.login || "Prasanth7029"}
                </h2>
                <p className="text-gray-400 mb-2">
                  {profile?.bio || "Full-stack developer building innovative solutions"}
                </p>
                <div className="flex gap-4 text-sm">
                  {profile?.location && <span>📍 {profile.location}</span>}
                  <a
                    href={profile?.blog || "https://github.com/Prasanth7029"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:underline"
                  >
                    🌐 {profile?.blog ? "Website" : "GitHub"}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <StatCard
              icon="📦"
              label="Repos"
              value={profile?.public_repos || repos.length}
            />
            <StatCard
              icon="👥"
              label="Followers"
              value={profile?.followers || 12}
            />
            <StatCard
              icon="⭐"
              label="Stars"
              value={repos.reduce((sum, repo) => sum + repo.stargazers_count, 0)}
            />
            <StatCard
              icon="🔀"
              label="Forks"
              value={repos.reduce((sum, repo) => sum + repo.forks_count, 0)}
            />
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {repos.map((repo, index) => (
            <ProjectCard key={repo.id || index} repo={repo} index={index} />
          ))}
        </div>

        {/* Skills & Contributions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-gray-800/30 p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-4">GitHub Contributions</h3>
            <img
              src={`https://ghchart.rshah.org/${profile?.login || 'Prasanth7029'}`}
              alt="GitHub Contributions"
              className="w-full h-auto rounded-lg"
            />
          </div>
          <SkillsChart />
        </div>
      </div>
    </div>
  );
}

// Helper functions
function getLanguageColor(language) {
  const colors = {
    JavaScript: '#f1e05a',
    Java: '#b07219',
    Python: '#3572A5',
    HTML: '#e34c26',
    CSS: '#563d7c',
    TypeScript: '#2b7489',
  };
  return colors[language] || '#ccc';
}