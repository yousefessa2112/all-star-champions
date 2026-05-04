"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { PageShell } from "@/components/page-shell";
import { useTournament } from "@/components/tournament-provider";

const formatUnit = (value: number) => String(Math.max(0, value)).padStart(2, "0");

export default function HomePage() {
  const { state, spotsRemaining } = useTournament();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const countdown = useMemo(() => {
    const target = new Date(state.settings.nextTournamentDate).getTime();
    const diff = Math.max(0, target - now);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    return { days, hours, minutes, seconds };
  }, [now, state.settings.nextTournamentDate]);

  return (
    <PageShell>
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[#102443] via-[#0A1628] to-[#070d18] p-8 sm:p-12">
        <div className="pointer-events-none absolute inset-0 opacity-30">
          <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-[#FFD70033] blur-3xl" />
          <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-[#2f6bff33] blur-3xl" />
        </div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
          <p className="mb-3 text-sm tracking-[0.25em] text-[#FFD700]">★ ALL STAR CHAMPIONS</p>
          <h1 className="text-4xl font-black leading-tight text-white sm:text-6xl">One Game. One Dream. One Champion.</h1>
          <p className="mt-4 max-w-2xl text-white/75">
            Premium community soccer tournament experiences with elite competition, bold energy, and championship pride.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Days", value: formatUnit(countdown.days) },
              { label: "Hours", value: formatUnit(countdown.hours) },
              { label: "Minutes", value: formatUnit(countdown.minutes) },
              { label: "Seconds", value: formatUnit(countdown.seconds) },
            ].map((unit) => (
              <div key={unit.label} className="card text-center">
                <p className="text-3xl font-black text-[#FFD700]">{unit.value}</p>
                <p className="text-xs uppercase tracking-widest text-white/70">{unit.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/registration" className="gold-btn">
              Register Your Team
            </Link>
            <Link href="/teams" className="rounded-xl border border-white/20 px-5 py-3 font-semibold text-white hover:border-[#FFD700]">
              View Teams
            </Link>
          </div>
        </motion.div>
      </section>

      <section className="mt-10 grid gap-4 sm:grid-cols-3">
        <div className="card">
          <p className="text-sm text-white/70">Total Slots</p>
          <p className="mt-2 text-4xl font-black text-[#FFD700]">{state.settings.maxTeams}</p>
        </div>
        <div className="card">
          <p className="text-sm text-white/70">Registered Teams</p>
          <p className="mt-2 text-4xl font-black text-white">{state.teams.length}</p>
        </div>
        <div className="card">
          <p className="text-sm text-white/70">Spots Remaining</p>
          <p className="mt-2 text-4xl font-black text-white">{spotsRemaining}</p>
        </div>
      </section>
    </PageShell>
  );
}