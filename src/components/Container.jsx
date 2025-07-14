export default function Container({ children }) {
  return (
    <div className="w-full max-w-screen-xl mx-auto px-4">
      {children}
    </div>
  );
}
