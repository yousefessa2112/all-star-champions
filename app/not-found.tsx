import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "404 — Page Not Found",
  description: "The page you are looking for does not exist.",
};

export default function NotFound() {
  return (
    <div className="noise-bg flex flex-1 items-center justify-center min-h-[60vh]">
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        {/* Gold accent line */}
        <div
          className="mx-auto mb-6 h-1 w-24 bg-[#FFD700]"
          style={{ transform: "skewX(-12deg)" }}
        />

        {/* Big 404 */}
        <p className="font-condensed text-xs font-bold tracking-[0.3em] text-[#FFD700] uppercase mb-2">
          ERROR 404
        </p>
        <h1
          className="font-heading font-bold leading-[0.85] tracking-tight text-[#0A1628] uppercase"
          style={{ fontSize: "clamp(6rem, 20vw, 14rem)" }}
        >
          404
        </h1>

        {/* Divider */}
        <div className="mx-auto my-6 h-px w-32 bg-[#0A1628]/20" />

        <h2 className="font-heading text-2xl font-bold tracking-wider text-[#0A1628] uppercase sm:text-3xl">
          PAGE NOT FOUND
        </h2>
        <p className="mt-4 font-condensed text-sm tracking-wide text-[#0A1628]/60">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          <br />
          Head back to the pitch.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-[#0A1628] px-8 py-4 font-heading text-sm font-bold tracking-wider text-white hover:bg-[#132240] transition-colors"
          >
            BACK TO HOME <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/registration"
            className="inline-flex items-center gap-2 border-2 border-[#0A1628] px-8 py-4 font-heading text-sm font-bold tracking-wider text-[#0A1628] hover:bg-[#0A1628] hover:text-white transition-colors"
          >
            REGISTER YOUR TEAM
          </Link>
        </div>

        {/* Bottom gold accent */}
        <div
          className="mx-auto mt-10 h-1 w-16 bg-[#FFD700]"
          style={{ transform: "skewX(-12deg)" }}
        />
      </div>
    </div>
  );
}
