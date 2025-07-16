import React from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import fm from "front-matter";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";

// Motion-wrapped Link for optional animations
const MotionLink = motion(Link);

// Import all markdown files as raw text
const markdownFiles = import.meta.glob("../posts/*.md", {
  eager: true,
  as: "raw"
});

export default function BlogPostPage() {
  const { slug } = useParams();
  const filePath = `../posts/${slug}.md`;
  const rawContent = markdownFiles[filePath];

  if (!rawContent) {
    return (
      <div className="text-white text-center py-20 text-xl">
        ❌ 404 – Blog post not found.
      </div>
    );
  }

  // Parse front-matter and body
  const { attributes, body } = fm(rawContent);
  const formattedDate = attributes?.date
    ? new Date(attributes.date).toLocaleDateString(undefined, {
        year: 'numeric', month: 'long', day: 'numeric'
      })
    : "Unknown date";

  return (
    <>
      {/* Dynamic HTML head */}
      {attributes?.title && (
        <Helmet>
          <title>{`${attributes.title} | SynexiAI`}</title>
          <meta
            name="description"
            content={attributes.summary || body.slice(0, 150)}
          />
        </Helmet>
      )}

      <article className="max-w-3xl mx-auto px-6 py-20 text-white">
        {/* Back to blog listing */}
        <MotionLink
          to="/blog"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-block text-cyan-400 hover:underline mb-8"
        >
          ← Back to Blog
        </MotionLink>

        {/* Cover Image */}
        {attributes?.coverImage && (
          <img
            src={attributes.coverImage}
            alt={attributes.title}
            className="w-full rounded-xl mb-8 shadow-lg"
            data-aos="fade-up"
          />
        )}

        {/* Title */}
        <h1
          className="text-4xl md:text-5xl font-bold text-cyan-400 mb-4"
          data-aos="fade-up"
        >
          {attributes.title}
        </h1>

        {/* Metadata */}
        <p
          className="text-sm text-gray-400 italic mb-6"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          📅 {formattedDate} — {attributes.author || "SynexiAI Team"}
        </p>

        <hr className="border-gray-700 mb-8" />

        {/* Markdown Body */}
        <div
          className="prose prose-invert prose-lg max-w-none text-gray-100"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <ReactMarkdown>{body}</ReactMarkdown>
        </div>
      </article>
    </>
  );
}
