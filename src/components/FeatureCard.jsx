import { motion } from "framer-motion";
import React from "react";

const MotionArticle = motion.article;

export default function FeatureCard({
 icon,
 title,
 description,
 delay = 0,
 className = "",
}) {
 return (
 <MotionArticle
 initial={{ opacity: 0, y: 14 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true, amount: 0.2 }}
 transition={{ duration: 0.5, delay }}
 className={[
 "group flex h-full min-h-[220px] flex-col justify-between",
 "rounded-2xl border",
 "border-[var(--border-color)]",
 "shadow-sm hover:shadow-cyan-500/10",
 "transition-[transform,box-shadow,background] duration-300",
 "p-6 md:p-8",
 className,
 ].join(" ")}
 role="region"
 aria-label={title}
 >
 {/* Top row: icon + title */}
 <div>
 <div
 className={[
 "mb-5 inline-flex items-center justify-center",
 "h-12 w-12 rounded-xl",
 "bg-cyan-500/10 border border-cyan-400/20",
 "ring-0 group-hover:ring-2 group-hover:ring-cyan-400/30",
 "transition-shadow",
 ].join(" ")}
 aria-hidden="true"
 >
 {/* keep whatever icon color you pass in */}
 {icon}
 </div>

 <h3
 className={[
 "text-xl md:text-2xl font-semibold leading-snug",
 "text-gray-900 dark:text-gray-100",
 ].join(" ")}
 >
 {title}
 </h3>

 <p
 className={[
 "mt-3 text-base md:text-lg",
 "text-gray-700 dark:text-gray-300",
 ].join(" ")}
 >
 {description}
 </p>
 </div>

 {/* Bottom accent line on hover for polish */}
 <div
 className={[
 "mt-6 h-px w-full",
 "bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent",
 "opacity-0 group-hover:opacity-100 transition-opacity",
 ].join(" ")}
 aria-hidden="true"
 />
 </MotionArticle>

 );
}