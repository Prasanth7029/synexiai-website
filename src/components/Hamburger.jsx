export default function Hamburger({ open, onChange }) {
  return (
    <div className="md:hidden z-50">
      <input
        id="menu-toggle"
        type="checkbox"
        checked={open}
        onChange={onChange}
        className="peer sr-only"
      />
      <label
        htmlFor="menu-toggle"
        className="relative flex flex-col justify-between w-10 h-8 cursor-pointer group"
        aria-label="Toggle menu"
      >
        {/* Animated top bar */}
        <span className="
          block absolute h-[3px] w-full bg-gradient-to-r from-cyan-400 to-teal-500 rounded-full
          transition-all duration-500 ease-[cubic-bezier(0.68,-0.6,0.32,1.6)]
          top-0 peer-checked:top-1/2 peer-checked:-translate-y-1/2 peer-checked:rotate-45
          shadow-[0_0_8px_rgba(34,211,238,0.5)]
          group-hover:bg-gradient-to-r group-hover:from-teal-400 group-hover:to-cyan-500
        "/>

        {/* Middle bar with scaling animation */}
        <span className="
          block absolute h-[3px] w-full bg-gradient-to-r from-cyan-400 to-teal-500 rounded-full
          transition-all duration-300 ease-in-out
          top-1/2 -translate-y-1/2
          peer-checked:scale-0 peer-checked:opacity-0
          shadow-[0_0_8px_rgba(34,211,238,0.5)]
          group-hover:bg-gradient-to-r group-hover:from-teal-400 group-hover:to-cyan-500
        "/>

        {/* Animated bottom bar */}
        <span className="
          block absolute h-[3px] w-full bg-gradient-to-r from-cyan-400 to-teal-500 rounded-full
          transition-all duration-500 ease-[cubic-bezier(0.68,-0.6,0.32,1.6)]
          bottom-0 peer-checked:top-1/2 peer-checked:-translate-y-1/2 peer-checked:-rotate-45
          shadow-[0_0_8px_rgba(34,211,238,0.5)]
          group-hover:bg-gradient-to-r group-hover:from-teal-400 group-hover:to-cyan-500
        "/>

        {/* Glow effect */}
        <span className="
          absolute inset-0 rounded-full opacity-0
          peer-checked:opacity-100 peer-checked:animate-pulse
          bg-cyan-400/20 pointer-events-none
          transition-opacity duration-300
        "/>
      </label>
    </div>
  )
}