export default function Hamburger({ open, onChange }) {
  return (
    <div className="md:hidden">
      <input
        id="menu-toggle"
        type="checkbox"
        checked={open}
        onChange={onChange}
        className="peer sr-only"
      />
      <label
        htmlFor="menu-toggle"
        className="flex flex-col justify-between w-8 h-6 cursor-pointer"
      >
        <span className="block h-0.5 bg-cyan-400 rounded transition-transform duration-300 peer-checked:translate-y-2 peer-checked:rotate-45"/>
        <span className="block h-0.5 bg-cyan-400 rounded transition-opacity duration-300 peer-checked:opacity-0"/>
        <span className="block h-0.5 bg-cyan-400 rounded transition-transform duration-300 peer-checked:-translate-y-2 peer-checked:-rotate-45"/>
      </label>
    </div>
  )
}
