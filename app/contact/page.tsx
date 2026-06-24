"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { PageShell } from "@/components/page-shell";
import { useTournament } from "@/components/tournament-provider";
import { AnimateIn } from "@/components/animate-in";
import { Phone, MapPin, Send } from "lucide-react";

export default function ContactPage() {
  const { submitContactMessage } = useTournament();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !message.trim()) { toast.error("Please complete all fields."); return; }
    setSubmitting(true);
    await submitContactMessage(name.trim(), message.trim());
    setSubmitting(false);
    toast.success("Message sent successfully.");
    setName(""); setMessage("");
  };

  return (
    <PageShell>
      <AnimateIn>
        <div className="mb-8">
          <p className="font-condensed text-xs font-bold tracking-[0.3em] text-[#FFD700] uppercase">GET IN TOUCH</p>
          <h1 className="section-title mt-2">CONTACT US</h1>
          <div className="mt-2 h-1 w-24 bg-[#FFD700]" style={{ transform: "skewX(-12deg)" }} />
        </div>
      </AnimateIn>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Contact Info */}
        <AnimateIn direction="left" delay={0.1}>
          <div className="border-2 border-[#0A1628] bg-white p-6 h-full">
            <h2 className="font-heading text-lg font-bold tracking-wider text-[#0A1628] uppercase mb-6">
              REACH OUT
            </h2>
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#FFD700] text-[#0A1628]">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-condensed text-xs font-semibold tracking-wider text-[#0A1628]/50 uppercase">Phone</p>
                  <a href="tel:9293043899" className="font-condensed text-lg font-semibold tracking-wide text-[#0A1628] hover:text-[#FFD700] transition-colors">
                    929-304-3899
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#FFD700] text-[#0A1628]">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </div>
                <div>
                  <p className="font-condensed text-xs font-semibold tracking-wider text-[#0A1628]/50 uppercase">Instagram</p>
                  <a href="https://instagram.com/all_star_champions" target="_blank" rel="noopener noreferrer"
                    className="font-condensed text-lg font-semibold tracking-wide text-[#0A1628] hover:text-[#FFD700] transition-colors">
                    @all_star_champions
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#FFD700] text-[#0A1628]">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-condensed text-xs font-semibold tracking-wider text-[#0A1628]/50 uppercase">Venue</p>
                  <p className="font-condensed text-lg font-semibold tracking-wide text-[#0A1628]">SoFive</p>
                  <p className="font-condensed text-sm text-[#0A1628]/60 tracking-wide">
                    2015 Pitkin Ave, Brooklyn, NY 11207
                  </p>
                </div>
              </div>
            </div>
          </div>
        </AnimateIn>

        {/* Contact Form */}
        <AnimateIn direction="right" delay={0.2}>
          <div className="border-2 border-[#0A1628] bg-white p-6 h-full">
            <h2 className="font-heading text-lg font-bold tracking-wider text-[#0A1628] uppercase mb-6">
              SEND A MESSAGE
            </h2>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="font-condensed text-xs font-semibold tracking-wider text-[#0A1628]/60 uppercase block mb-1">
                  Your Name
                </label>
                <input value={name} onChange={(event) => setName(event.target.value)}
                  placeholder="Enter your name" className="input-field" />
              </div>
              <div>
                <label className="font-condensed text-xs font-semibold tracking-wider text-[#0A1628]/60 uppercase block mb-1">
                  Message
                </label>
                <textarea value={message} onChange={(event) => setMessage(event.target.value)}
                  rows={5} placeholder="Write your message..." className="input-field resize-none" />
              </div>
              <button type="submit" disabled={submitting} className="gold-btn w-full py-3 disabled:opacity-50">
                <Send className="mr-2 h-4 w-4" />
                {submitting ? "SENDING..." : "SEND MESSAGE"}
              </button>
            </form>
          </div>
        </AnimateIn>
      </div>
    </PageShell>
  );
}
