// src/pages/BlogPage.jsx
import React, { useMemo } from "react";
import matter from "front-matter";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";

const MotionLink = motion(Link);
const placeholderImage = "/assets/covers/synexiai-banner.jpg";

// Import all markdown files as raw text
const markdownFiles = import.meta.glob("../posts/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

// Estimate reading time
const calculateReadingTime = (text) => {
  const wordsPerMinute = 200;
  const wordCount = text.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

// Parse & sort posts
const parseBlogPosts = () =>
  Object.entries(markdownFiles)
    .map(([filePath, rawContent]) => {
      if (!rawContent) return null;
      const slug = filePath
        .replace(/^.*[\\/]/, "")
        .replace(/\.md$/, "");
      const { attributes, body } = matter(rawContent);

      // Format date
      const dateObj = new Date(attributes.date || "");
      const date = !isNaN(dateObj)
        ? dateObj.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "Unknown date";

      // Summary fallback
      const firstLine = body.split("\n").find((l) => l.trim().length);
      const summary =
        attributes.summary ||
        (firstLine.length > 150
          ? firstLine.slice(0, 150) + "..."
          : firstLine);

      return {
        slug,
        title: attributes.title || "Untitled Post",
        date,
        summary,
        coverImage: attributes.coverImage
          ? attributes.coverImage
          : placeholderImage,
        readingTime: calculateReadingTime(body),
      };
    })
    .filter(Boolean)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

export default function BlogPage() {
  const blogPosts = useMemo(parseBlogPosts, []);

  return (
    <>
      <Helmet>
        <title>SynexiAI Blog & Updates</title>
        <meta
          name="description"
          content="Latest thoughts, research, and breakthroughs from SynexiAI"
        />
      </Helmet>

      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-20 text-white">
        {/* Header */}
        <header className="text-center mb-12 md:mb-16">
          <h1
            className="text-4xl md:text-5xl font-bold text-cyan-400 mb-4"
            data-aos="fade-up"
          >
            📝 SynexiAI Blog & Updates
          </h1>
          <p
            className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Thoughts, research, releases, breakthroughs, and more — directly
            from the heart of innovation.
          </p>
        </header>

        {/* Posts Grid */}
        {blogPosts.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, i) => (
              <article
                key={post.slug}
                className="group bg-gray-900 rounded-xl shadow-lg hover:shadow-cyan-500/20 border border-gray-800 hover:border-cyan-400 transition-all duration-300 overflow-hidden"
                data-aos="fade-up"
                data-aos-delay={150 * (i % 3)}
              >
                {/* Cover */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = placeholderImage;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-70" />
                </div>

                {/* Content */}
                <div className="p-6">
                  <h2 className="text-xl font-bold text-cyan-400 mb-2 line-clamp-2">
                    {post.title}
                  </h2>
                  <div className="flex items-center text-sm text-gray-400 mb-3 space-x-2">
                    <span>📅 {post.date}</span>
                    <span>•</span>
                    <span>⏱️ {post.readingTime} min read</span>
                  </div>
                  <p className="text-gray-300 mb-4 line-clamp-3">
                    {post.summary}
                  </p>
                  <MotionLink
                    to={`/blog/${post.slug}`}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center text-cyan-400 font-medium hover:text-white transition-colors duration-200"
                  >
                    Read more
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </MotionLink>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-400">No blog posts found.</p>
            <p className="text-gray-500 mt-2">Check back soon for updates!</p>
          </div>
        )}
      </div>
    </>
  );
}
