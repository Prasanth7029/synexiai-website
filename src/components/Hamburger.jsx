export default function Hamburger({ open, onChange }) {
  return (
    <button
      type="button"
      className="relative w-full h-full flex items-center justify-center group focus:outline-none"
      onClick={onChange}
      aria-expanded={open}
      aria-label="Toggle navigation menu"
    >
      <div className="relative w-6 h-5 flex flex-col justify-between">
        {/* Top bar */}
        <span
          className={`
            block absolute h-[2px] w-full bg-gradient-to-r from-cyan-400 to-teal-500 rounded-full
            transition-all duration-500 ease-[cubic-bezier(0.68,-0.6,0.32,1.6)]
            top-0 ${open ? "top-1/2 -translate-y-1/2 rotate-45" : ""}
            shadow-[0_0_4px_rgba(34,211,238,0.5)]
          `}
          aria-hidden="true"
        />

        {/* Middle bar */}
        <span
          className={`
            block absolute h-[2px] w-full bg-gradient-to-r from-cyan-400 to-teal-500 rounded-full
            transition-all duration-300 ease-in-out
            top-1/2 -translate-y-1/2
            ${open ? "scale-0 opacity-0" : ""}
          `}
          aria-hidden="true"
        />

        {/* Bottom bar */}
        <span
          className={`
            block absolute h-[2px] w-full bg-gradient-to-r from-cyan-400 to-teal-500 rounded-full
            transition-all duration-500 ease-[cubic-bezier(0.68,-0.6,0.32,1.6)]
            bottom-0 ${open ? "top-1/2 -translate-y-1/2 -rotate-45" : ""}
          `}
          aria-hidden="true"
        />
      </div>
    </button>
  );
}
