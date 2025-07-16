import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import matter from "front-matter";
import { Helmet } from "react-helmet-async";


const placeholderImage = "/assets/covers/synexiai-banner.jpg";

// Auto-import all markdown files (as raw strings)
const markdownFiles = import.meta.glob("../posts/*.md", {
  eager: true,
  query: '?raw',
  import: 'default'
});

// Memoized post parser
const parseBlogPosts = () => {
  try {
    return Object.entries(markdownFiles)
      .map(([filePath, rawContent]) => {
        try {
          if (!rawContent) throw new Error("No content found");

          // Extract slug safely
          const slug = filePath
            .replace(/^.*[\\\/]/, '')
            .replace(/\.md$/, '');

          // Parse front matter
          const { attributes, body } = matter(rawContent);

          // Process date
          const dateObj = attributes.date ? new Date(attributes.date) : null;
          const formattedDate = dateObj && !isNaN(dateObj)
            ? dateObj.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric"
              })
            : "Date not available";

          // Extract first paragraph as summary if not provided
          const autoSummary = body.split('\n').find(line => line.trim().length > 0) || "";
          const summary = attributes.summary || autoSummary.slice(0, 150) + (autoSummary.length > 150 ? "..." : "");

          return {
            slug,
            title: attributes.title || "Untitled Post",
            date: formattedDate,
            summary,
            coverImage: attributes.coverImage || placeholderImage,
            readingTime: calculateReadingTime(body),
            tags: attributes.tags || [],
            author: attributes.author || "SynexiAI Team"
          };
        } catch (error) {
          console.error(`Error processing ${filePath}:`, error);
          return null;
        }
      })
      .filter(post => post !== null)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch (error) {
    console.error("Error loading blog posts:", error);
    return [];
  }
};

// Helper function to estimate reading time
const calculateReadingTime = (text) => {
  const wordsPerMinute = 200;
  const wordCount = text.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

export default function BlogPage() {
  const blogPosts = useMemo(() => parseBlogPosts(), []);

  return (
    <>
      <Helmet>
        <title>SynexiAI Blog & Updates</title>
        <meta name="description" content="Latest thoughts, research, and breakthroughs from SynexiAI" />
      </Helmet>

      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-20 text-white">
        {/* Page Header */}
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
            Thoughts, research, releases, breakthroughs, and more — directly from the heart of innovation.
          </p>
        </header>

        {/* Blog Posts Grid */}
        {blogPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <article
                key={post.slug}
                className="group bg-gray-900 rounded-xl shadow-lg hover:shadow-cyan-500/20 border border-gray-800 hover:border-cyan-400 transition-all duration-300 overflow-hidden"
                data-aos="fade-up"
                data-aos-delay={150 * (index % 3)} // Stagger animation
              >
                {/* Cover Image with lazy loading */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.coverImage}
                    alt={`Cover for ${post.title}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = placeholderImage;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-70" />
                </div>

                <div className="p-6">
                  {/* Tags */}
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags.slice(0, 3).map(tag => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-1 bg-cyan-900/50 text-cyan-300 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Title */}
                  <h2 className="text-xl font-bold text-cyan-400 mb-2 line-clamp-2">
                    {post.title}
                  </h2>

                  {/* Metadata */}
                  <div className="flex items-center text-sm text-gray-400 mb-3 space-x-3">
                    <span>📅 {post.date}</span>
                    <span>•</span>
                    <span>⏱️ {post.readingTime} min read</span>
                  </div>

                  {/* Summary */}
                  <p className="text-gray-300 mb-4 line-clamp-3">
                    {post.summary}
                  </p>

                  {/* Read More Link */}
                  <Link
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center text-cyan-400 font-medium hover:text-white transition-colors duration-200"
                    aria-label={`Read more about ${post.title}`}
                  >
                    Read more
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-400">No blog posts found.</p>
            <p className="text-gray-500 mt-2">Check back later for updates!</p>
          </div>
        )}
      </div>
    </>
  );
}