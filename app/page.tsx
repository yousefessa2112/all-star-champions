"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, MapPin, Phone, Users, Trophy, Calendar, Star } from "lucide-react";
import { useTournament } from "@/components/tournament-provider";
import { AnimateIn, StaggerContainer, StaggerItem } from "@/components/animate-in";

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

  const teamsRegistered = state.teams.filter((t) => t.status !== "denied").length;

  return (
    <div className="noise-bg">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-[#F5F0EB]">
        {/* Hero player image - right side */}
        <div className="absolute right-0 top-0 h-full w-[55%] sm:w-[50%] lg:w-[45%] pointer-events-none">
          <Image
            src="/hero-player.png"
            alt="Soccer player in action"
            fill
            className="object-cover object-top"
            priority
            sizes="(max-width: 640px) 55vw, (max-width: 1024px) 50vw, 45vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#F5F0EB] via-[#F5F0EB]/40 to-transparent" />
        </div>

        {/* Ink splatter / grunge overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#F5F0EB] to-transparent pointer-events-none z-[2]" />
        
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="relative py-16 sm:py-20 lg:py-28">
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="font-condensed text-sm font-bold italic tracking-wider text-[#FFD700] sm:text-base relative z-[3]"
            >
              MORE THAN A GAME. THIS IS OUR CULTURE.
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-heading mt-4 text-[clamp(3.5rem,12vw,9rem)] font-bold leading-[0.85] tracking-tight text-[#0A1628] uppercase relative z-[3]"
            >
              ALL STAR<br />
              CHAMPIONS
            </motion.h1>

            {/* Gold brush stroke underline */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-3 h-4 w-72 origin-left sm:w-[28rem] relative z-[3]"
              style={{
                background: "linear-gradient(90deg, #FFD700 0%, #E6C200 60%, #FFD700 100%)",
                transform: "skewX(-12deg)",
                borderRadius: "2px",
              }}
            />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-6 flex flex-wrap items-center gap-3 font-condensed text-xs font-semibold tracking-[0.2em] text-[#0A1628]/70 uppercase sm:text-sm relative z-[3]"
            >
              <span>BROOKLYN, NEW YORK</span>
              <span className="text-[#FFD700]">&#9679;</span>
              <span>WORLDWIDE TALENT</span>
              <span className="text-[#FFD700]">&#9679;</span>
              <span>ONE CHAMPION</span>
            </motion.div>

            <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden xl:block z-[3]">
              <p className="vertical-text font-heading text-xs font-bold tracking-[0.3em] text-[#FFD700]/60">
                2026 ALL STAR CHAMPIONS TOURNAMENT
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* COUNTDOWN + CTA SECTION */}
      <section className="border-y-4 border-[#0A1628] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
          <AnimateIn>
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="font-condensed text-xs font-bold tracking-[0.3em] text-[#0A1628]/50 uppercase">
                  TOURNAMENT STARTS IN
                </p>
                <div className="mt-4 flex items-center gap-1 sm:gap-3">
                  {[
                    { label: "DAYS", value: formatUnit(countdown.days) },
                    { label: "HOURS", value: formatUnit(countdown.hours) },
                    { label: "MINUTES", value: formatUnit(countdown.minutes) },
                    { label: "SECONDS", value: formatUnit(countdown.seconds) },
                  ].map((unit, i) => (
                    <div key={unit.label} className="flex items-center gap-1 sm:gap-3">
                      {i > 0 && <div className="h-16 w-px bg-[#D4D0CB] sm:h-20" />}
                      <div className="text-center min-w-[60px] sm:min-w-[80px]">
                        <p className="font-heading text-4xl font-bold text-[#0A1628] sm:text-5xl lg:text-6xl">
                          {unit.value}
                        </p>
                        <p className="font-condensed text-[10px] font-semibold tracking-[0.2em] text-[#FFD700] sm:text-xs">
                          {unit.label}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-start gap-3 lg:items-end">
                <Link href="/registration" className="gold-btn group text-lg px-8 py-4">
                  JOIN THE BATTLE
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <p className="font-condensed text-sm font-semibold tracking-wider text-[#0A1628]/60 italic">
                  REGISTER YOUR TEAM. LIVE THE LEGACY.
                </p>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="bg-[#F5F0EB] py-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <StaggerContainer className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              { icon: Users, value: String(state.settings.maxTeams), label: "TEAMS", sub: "MAX CAPACITY" },
              { icon: Star, value: String(teamsRegistered), label: "REGISTERED", sub: "AND COUNTING" },
              { icon: Trophy, value: String(spotsRemaining), label: "SPOTS LEFT", sub: "REGISTER NOW" },
              { icon: Calendar, value: "1", label: "CHAMPION", sub: "ETERNAL GLORY" },
            ].map((stat) => (
              <StaggerItem key={stat.label}>
                <div className="border-2 border-[#0A1628] bg-white p-5 text-center transition-all hover:bg-[#0A1628] hover:text-white group cursor-default">
                  <stat.icon className="mx-auto h-6 w-6 text-[#FFD700] mb-2" />
                  <p className="font-heading text-4xl font-bold sm:text-5xl">{stat.value}</p>
                  <p className="font-heading text-sm font-bold tracking-wider mt-1">{stat.label}</p>
                  <p className="font-condensed text-xs text-[#0A1628]/50 group-hover:text-white/50 tracking-wider mt-1">
                    {stat.sub}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* VENUE SECTION */}
      <section className="bg-[#0A1628] text-white py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <AnimateIn direction="left">
              <div className="relative">
                <div className="aspect-[4/3] bg-[#132240] border-2 border-white/10 flex items-center justify-center overflow-hidden">
                  <div className="text-center p-8">
                    <p className="font-heading text-6xl font-bold text-white/10 sm:text-8xl">BK</p>
                    <p className="font-condensed text-sm tracking-[0.3em] text-white/30 mt-2">BROOKLYN BUILT DIFFERENT</p>
                  </div>
                </div>
              </div>
            </AnimateIn>

            <AnimateIn direction="right" delay={0.2}>
              <div>
                <p className="font-condensed text-xs font-bold tracking-[0.3em] text-[#FFD700]">VENUE</p>
                <h2 className="font-heading text-5xl font-bold mt-2 sm:text-6xl lg:text-7xl leading-[0.9]">
                  BROOKLYN<br />NEW YORK
                </h2>
                <div className="mt-6 space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-[#FFD700] mt-0.5 shrink-0" />
                    <div>
                      <p className="font-heading text-lg font-bold tracking-wider">SOFIVE</p>
                      <p className="font-condensed text-sm text-white/60 tracking-wide">
                        2015 Pitkin Ave, Brooklyn, NY 11207
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-[#FFD700] mt-0.5 shrink-0" />
                    <p className="font-condensed text-sm text-white/60 tracking-wide">
                      May 30, 2026 &middot; 10:00 PM EST
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-[#FFD700] mt-0.5 shrink-0" />
                    <a href="tel:9293043899" className="font-condensed text-sm text-white/60 tracking-wide hover:text-[#FFD700] transition-colors">
                      929-304-3899
                    </a>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="h-5 w-5 text-[#FFD700] mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                    <a href="https://instagram.com/all_star_champions" target="_blank" rel="noopener noreferrer" className="font-condensed text-sm text-white/60 tracking-wide hover:text-[#FFD700] transition-colors">
                      @all_star_champions
                    </a>
                  </div>
                </div>

                <Link href="/contact" className="mt-8 inline-flex items-center gap-2 border-2 border-white/30 px-6 py-3 font-heading text-sm font-bold tracking-wider text-white hover:border-[#FFD700] hover:text-[#FFD700] transition-colors">
                  VIEW VENUE <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* TAGLINE SECTION */}
      <section className="bg-[#FFD700] py-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <AnimateIn>
            <div className="text-center">
              <h2 className="font-heading text-3xl font-bold text-[#0A1628] tracking-wider sm:text-5xl lg:text-6xl">
                ONE GAME. ONE DREAM. ONE CHAMPION.
              </h2>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                <Link href="/registration" className="inline-flex items-center gap-2 bg-[#0A1628] px-8 py-4 font-heading text-sm font-bold tracking-wider text-white hover:bg-[#132240] transition-colors">
                  REGISTER NOW <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/rules" className="inline-flex items-center gap-2 border-2 border-[#0A1628] px-8 py-4 font-heading text-sm font-bold tracking-wider text-[#0A1628] hover:bg-[#0A1628] hover:text-white transition-colors">
                  VIEW RULES
                </Link>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>
    </div>
  );
}
