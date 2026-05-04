export function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10 bg-[#060d1a]">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-white/70 sm:flex-row">
        <p>© {new Date().getFullYear()} All Star Champions</p>
        <div className="flex items-center gap-4">
          <a href="https://instagram.com/all_star_champions" target="_blank" rel="noopener noreferrer" className="hover:text-[#FFD700]">
            @all_star_champions
          </a>
          <a href="tel:9293043899" className="hover:text-[#FFD700]">
            929-304-3899
          </a>
        </div>
      </div>
    </footer>
  );
}