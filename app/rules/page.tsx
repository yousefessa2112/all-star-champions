"use client";

import { PageShell } from "@/components/page-shell";
import { AnimateIn, StaggerContainer, StaggerItem } from "@/components/animate-in";
import { Shield, Users, Swords, MapPin } from "lucide-react";

const sections = [
  {
    icon: Shield,
    title: "TOURNAMENT FORMAT",
    points: [
      "32 teams total, split into 8 groups of 4 teams.",
      "Group stage: each team plays every other team in their group.",
      "Top 2 teams from each group advance to the Round of 16.",
      "Knockout rounds: Round of 16, Quarterfinals, Semifinals, Final.",
    ],
  },
  {
    icon: Users,
    title: "TEAM REQUIREMENTS",
    points: [
      "Each team must register 5 to 8 players.",
      "Captain information is required for all communication.",
      "No duplicate team names are allowed.",
      "Teams must be approved by the admin before competing.",
    ],
  },
  {
    icon: Swords,
    title: "MATCH RULES",
    points: [
      "Standard football rules apply with organizer discretion.",
      "Win = 3 points, Draw = 1 point, Loss = 0 points.",
      "Tiebreakers: points, goal difference, goals scored.",
      "All decisions by the organizer are final.",
    ],
  },
  {
    icon: MapPin,
    title: "FEES & LOCATION",
    points: [
      "Venue: SoFive — 2015 Pitkin Ave, Brooklyn, NY 11207",
      "Date: May 30, 2026 at 10:00 PM EST",
      "Contact the organizer for payment details.",
      "Phone: 929-304-3899 / Instagram: @all_star_champions",
    ],
  },
];

export default function RulesPage() {
  return (
    <PageShell>
      <AnimateIn>
        <div className="mb-8">
          <p className="font-condensed text-xs font-bold tracking-[0.3em] text-[#FFD700] uppercase">OFFICIAL GUIDELINES</p>
          <h1 className="section-title mt-2">TOURNAMENT RULES</h1>
          <div className="mt-2 h-1 w-24 bg-[#FFD700]" style={{ transform: "skewX(-12deg)" }} />
          <p className="mt-4 font-condensed text-sm text-[#0A1628]/60 tracking-wide">
            All participants must follow these rules. Violations may result in disqualification.
          </p>
        </div>
      </AnimateIn>

      <StaggerContainer className="grid gap-4 sm:grid-cols-2" staggerDelay={0.1}>
        {sections.map((section) => (
          <StaggerItem key={section.title}>
            <article className="border-2 border-[#0A1628] bg-white overflow-hidden h-full">
              <div className="bg-[#0A1628] px-4 py-3 flex items-center gap-3">
                <section.icon className="h-5 w-5 text-[#FFD700]" />
                <h2 className="font-heading text-sm font-bold tracking-wider text-white">{section.title}</h2>
              </div>
              <ul className="p-5 space-y-3">
                {section.points.map((point) => (
                  <li key={point} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-[#FFD700]" />
                    <span className="font-condensed text-sm text-[#0A1628]/80 tracking-wide">{point}</span>
                  </li>
                ))}
              </ul>
            </article>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </PageShell>
  );
}
