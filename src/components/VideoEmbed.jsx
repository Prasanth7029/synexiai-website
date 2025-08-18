import React, { useRef, useState, useEffect } from "react";

export default function VideoEmbed({ src, title }) {
 const [active, setActive] = useState(false);
 const [visible, setVisible] = useState(false);
 const ref = useRef(null);

 useEffect(() => {
 if (!ref.current || active) return;
 const io = new IntersectionObserver(
 ([entry]) => {
 if (entry.isIntersecting) {
 setVisible(true);
 io.disconnect();
 }
 },
 { rootMargin: "200px" },
 );
 io.observe(ref.current);
 return () => io.disconnect();
 }, [active]);

 const start = () => setActive(true);

 // derive a poster if your API has thumbnails; otherwise show a play overlay
 return (
 <div
 ref={ref}
 className="relative pt-[56.25%] bg-black overflow-hidden rounded-t-xl"
 >
 {active || visible ? (
 <iframe
 title={title}
 src={active ? src : undefined} // only set src after click -> zero CPU before
 loading="lazy"
 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
 allowFullScreen
 className="absolute inset-0 w-full h-full"
 />
 ) : null}
 {!active && (
 <button
 onClick={start}
 className="absolute inset-0 w-full h-full flex items-center justify-center
 text-white/90 bg-gradient-to-b from-black/40 to-black/50"
 aria-label={`Play video: ${title}`}
 >
 <div className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 ">
 ▶ Play
 </div>
 </button>
 )}
 </div>
 );
}
