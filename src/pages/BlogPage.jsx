import React from "react";
import { Link } from "react-router-dom";
import matter from "front-matter";
import Layout from "../components/Layout";

// Auto-import all markdown files
const markdownFiles = import.meta.glob("../posts/*.md", { eager: true });

const blogPosts = Object.entries(markdownFiles)
  .map(([filePath, module]) => {
    const slug = filePath.split("/").pop().replace(".md", "");
    const { attributes } = matter(module.default);
    return {
      slug,
      title: attributes.title,
      date: attributes.date,
      summary: attributes.summary,
    };
  })
  .sort((a, b) => new Date(b.date) - new Date(a.date)); // newest first

export default function BlogPage() {
  return (
    <Layout>
      <div className="w-full max-w-6xl mx-auto px-6 py-20 text-white">
        {/* Page Title */}
        <h1
          className="text-4xl md:text-5xl font-bold text-cyan-400 mb-4 text-center"
          data-aos="fade-up"
        >
          📝 SynexiAI Blog & Updates
        </h1>

        {/* Subtext */}
        <p
          className="text-lg md:text-xl text-gray-300 text-center mb-12 max-w-3xl mx-auto"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          Thoughts, research, releases, breakthroughs, and more — directly from the heart of innovation.
        </p>

        {/* Blog Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <div
              key={post.slug}
              className="bg-[#1a1a1a] rounded-xl p-6 shadow-lg shadow-cyan-500/10 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300"
              data-aos="fade-up"
              data-aos-delay={200 * index}
            >
              <div>
                <h2 className="text-xl font-semibold text-cyan-400 mb-2">
                  {post.title}
                </h2>
                <p className="text-sm text-gray-500 mb-3">📅 {post.date}</p>
                <p className="text-base text-gray-300">{post.summary}</p>
              </div>

              <Link
                to={`/blog/${post.slug}`}
                className="mt-6 text-cyan-400 font-semibold underline hover:text-white transition duration-200"
              >
                Read more →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
