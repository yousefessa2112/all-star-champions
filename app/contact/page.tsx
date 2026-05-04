"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { PageShell } from "@/components/page-shell";
import { useTournament } from "@/components/tournament-provider";

export default function ContactPage() {
  const { submitContactMessage } = useTournament();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !message.trim()) {
      toast.error("Please complete all fields.");
      return;
    }
    submitContactMessage(name.trim(), message.trim());
    toast.success("Message sent successfully.");
    setName("");
    setMessage("");
  };

  return (
    <PageShell>
      <section className="card">
        <h1 className="section-title">Contact</h1>
        <div className="mt-4 space-y-2 text-white/80">
          <p>
            Phone:{" "}
            <a className="text-[#FFD700]" href="tel:9293043899">
              929-304-3899
            </a>
          </p>
          <p>
            Instagram:{" "}
            <a
              className="text-[#FFD700]"
              href="https://instagram.com/all_star_champions"
              target="_blank"
              rel="noopener noreferrer"
            >
              @all_star_champions
            </a>
          </p>
        </div>
      </section>

      <section className="card mt-6">
        <h2 className="text-xl font-bold text-white">Send a Message</h2>
        <form onSubmit={onSubmit} className="mt-4 space-y-3">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Your Name"
            className="w-full rounded-xl border border-white/15 bg-[#0c1a31] px-4 py-3 outline-none focus:border-[#FFD700]"
          />
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={5}
            placeholder="Message"
            className="w-full rounded-xl border border-white/15 bg-[#0c1a31] px-4 py-3 outline-none focus:border-[#FFD700]"
          />
          <button type="submit" className="gold-btn">
            Send Message
          </button>
        </form>
      </section>
    </PageShell>
  );
}