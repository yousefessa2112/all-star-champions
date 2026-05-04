"use client";

import { PageShell } from "@/components/page-shell";
import { useTournament } from "@/components/tournament-provider";
import { teamNameById } from "@/lib/tournament-utils";
import { BracketRound } from "@/lib/types";

const rounds: BracketRound[] = ["quarterfinals", "semifinals", "final"];

const roundTitle = (round: BracketRound) => {
  if (round === "quarterfinals") return "Quarterfinals";
  if (round === "semifinals") return "Semifinals";
  return "Final";
};

export default function BracketPage() {
  const { state } = useTournament();

  if (!state.settings.bracketVisible) {
    return (
      <PageShell>
        <div className="card">
          <h1 className="section-title">Knockout Bracket</h1>
          <p className="mt-3 text-white/70">Bracket will be visible once the admin activates it.</p>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <h1 className="section-title mb-6">Knockout Bracket</h1>
      <div className="grid gap-4 lg:grid-cols-3">
        {rounds.map((round) => {
          const matches = state.bracketMatches.filter((match) => match.round === round);
          return (
            <section key={round} className="card">
              <h2 className="mb-4 text-lg font-bold text-[#FFD700]">{roundTitle(round)}</h2>
              <div className="space-y-3">
                {matches.map((match) => (
                  <article key={match.id} className="rounded-xl border border-white/10 bg-[#0c1a31] p-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>{teamNameById(state.teams, match.homeTeamId)}</span>
                      <strong>{match.homeScore ?? "-"}</strong>
                    </div>
                    <div className="my-2 h-px bg-white/10" />
                    <div className="flex items-center justify-between text-sm">
                      <span>{teamNameById(state.teams, match.awayTeamId)}</span>
                      <strong>{match.awayScore ?? "-"}</strong>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </PageShell>
  );
}