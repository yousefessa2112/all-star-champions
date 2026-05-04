"use client";

import { PageShell } from "@/components/page-shell";

const sections = [
  {
    title: "Tournament Format",
    points: [
      "16 teams total, split into 4 groups of 4 teams.",
      "Group stage followed by knockout rounds.",
      "Top teams advance to quarterfinals, then semifinals, then final.",
    ],
  },
  {
    title: "Team Requirements",
    points: [
      "Each team must register 5 to 7 players.",
      "Captain information is required for all communication.",
      "No duplicate team names are allowed.",
    ],
  },
  {
    title: "Match Rules",
    points: [
      "Standard football rules apply with organizer discretion.",
      "Win = 3 points, Draw = 1 point, Loss = 0 points.",
      "Tiebreakers: points, goal difference, goals scored.",
    ],
  },
  {
    title: "Fees & Location",
    points: [
      "Registration fee and venue details are announced before kickoff.",
      "Contact the organizer for payment confirmation and exact location.",
      "Phone: 929-304-3899 / Instagram: @all_star_champions",
    ],
  },
];

export default function RulesPage() {
  return (
    <PageShell>
      <section className="card">
        <h1 className="section-title">Tournament Rules</h1>
        <p className="mt-2 text-white/70">
          Official guidelines for All Star Champions.
        </p>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2">
        {sections.map((section) => (
          <article key={section.title} className="card">
            <h2 className="text-lg font-bold text-[#FFD700]">{section.title}</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-white/80">
              {section.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>
    </PageShell>
  );
}