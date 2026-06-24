import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#0A1628] text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/60">
                <span className="text-lg font-bold">★</span>
              </div>
              <span className="font-heading text-sm font-bold tracking-[0.2em]">ALL STAR CHAMPIONS</span>
            </div>
            <p className="font-condensed text-sm text-white/60 tracking-wide leading-relaxed">
              One Game. One Dream. One Champion.<br />
              Brooklyn&apos;s premier community soccer tournament.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading text-sm font-bold tracking-wider text-[#FFD700] mb-4">QUICK LINKS</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { href: "/registration", label: "Register" },
                { href: "/teams", label: "Teams" },
                { href: "/groups", label: "Groups" },
                { href: "/bracket", label: "Bracket" },
                { href: "/rules", label: "Rules" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-condensed text-sm text-white/60 tracking-wide hover:text-[#FFD700] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading text-sm font-bold tracking-wider text-[#FFD700] mb-4">CONTACT</h3>
            <div className="space-y-2 font-condensed text-sm text-white/60 tracking-wide">
              <p>
                <a href="tel:9293043899" className="hover:text-[#FFD700] transition-colors">
                  929-304-3899
                </a>
              </p>
              <p>
                <a
                  href="https://instagram.com/all_star_champions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#FFD700] transition-colors"
                >
                  @all_star_champions
                </a>
              </p>
              <p className="text-white/40">
                SoFive — 2015 Pitkin Ave<br />
                Brooklyn, NY 11207
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="font-condensed text-xs text-white/40 tracking-wider">
            &copy; {new Date().getFullYear()} ALL STAR CHAMPIONS. ALL RIGHTS RESERVED.
          </p>
          <Link href="/admin" className="font-condensed text-xs text-white/30 tracking-wider hover:text-[#FFD700] transition-colors">
            ADMIN
          </Link>
        </div>
      </div>
    </footer>
  );
}
