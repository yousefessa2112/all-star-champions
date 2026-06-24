"use client";

import { PageShell } from "@/components/page-shell";
import { useTournament } from "@/components/tournament-provider";
import { teamNameById } from "@/lib/tournament-utils";
import { BracketRound } from "@/lib/types";
import { AnimateIn, StaggerContainer, StaggerItem } from "@/components/animate-in";

const rounds: BracketRound[] = ["round-of-16", "quarterfinals", "semifinals", "final"];

const roundTitle = (round: BracketRound) => {
  if (round === "round-of-16") return "ROUND OF 16";
  if (round === "quarterfinals") return "QUARTERFINALS";
  if (round === "semifinals") return "SEMIFINALS";
  return "FINAL";
};

export default function BracketPage() {
  const { state } = useTournament();

  if (!state.settings.bracketVisible) {
    return (
      <PageShell>
        <AnimateIn>
          <div className="border-2 border-[#0A1628] bg-white p-8">
            <p className="font-condensed text-xs font-bold tracking-[0.3em] text-[#FFD700] uppercase">KNOCKOUT STAGE</p>
            <h1 className="section-title mt-2">TOURNAMENT BRACKET</h1>
            <div className="mt-2 h-1 w-24 bg-[#FFD700]" style={{ transform: "skewX(-12deg)" }} />
            <p className="mt-4 font-condensed text-sm text-[#0A1628]/60 tracking-wide">
              Bracket will be visible once the admin activates it.
            </p>
          </div>
        </AnimateIn>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <AnimateIn>
        <div className="mb-8">
          <p className="font-condensed text-xs font-bold tracking-[0.3em] text-[#FFD700] uppercase">KNOCKOUT STAGE</p>
          <h1 className="section-title mt-2">TOURNAMENT BRACKET</h1>
          <div className="mt-2 h-1 w-24 bg-[#FFD700]" style={{ transform: "skewX(-12deg)" }} />
        </div>
      </AnimateIn>

      <StaggerContainer className="grid gap-6 lg:grid-cols-4" staggerDelay={0.1}>
        {rounds.map((round) => {
          const matches = state.bracketMatches.filter((match) => match.round === round);
          return (
            <StaggerItem key={round}>
              <section>
                <div className="bg-[#0A1628] px-4 py-3 mb-3">
                  <h2 className="font-heading text-sm font-bold tracking-wider text-white text-center">
                    {roundTitle(round)}
                  </h2>
                </div>
                <div className="space-y-3">
                  {matches.map((match) => {
                    const hasScore = match.homeScore !== null && match.awayScore !== null;
                    const homeWin = hasScore && (match.homeScore ?? 0) > (match.awayScore ?? 0);
                    const awayWin = hasScore && (match.awayScore ?? 0) > (match.homeScore ?? 0);
                    
                    return (
                      <article key={match.id} className="border-2 border-[#E8E4DF] bg-white overflow-hidden">
                        <div className={`flex items-center justify-between px-3 py-2.5 border-b border-[#E8E4DF] ${homeWin ? "bg-[#FFD700]/10" : ""}`}>
                          <span className={`font-condensed text-sm tracking-wide ${homeWin ? "font-bold" : ""}`}>
                            {teamNameById(state.teams, match.homeTeamId)}
                          </span>
                          <span className={`font-heading text-lg font-bold ${homeWin ? "text-[#FFD700]" : "text-[#0A1628]/40"}`}>
                            {match.homeScore ?? "-"}
                          </span>
                        </div>
                        <div className={`flex items-center justify-between px-3 py-2.5 ${awayWin ? "bg-[#FFD700]/10" : ""}`}>
                          <span className={`font-condensed text-sm tracking-wide ${awayWin ? "font-bold" : ""}`}>
                            {teamNameById(state.teams, match.awayTeamId)}
                          </span>
                          <span className={`font-heading text-lg font-bold ${awayWin ? "text-[#FFD700]" : "text-[#0A1628]/40"}`}>
                            {match.awayScore ?? "-"}
                          </span>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            </StaggerItem>
          );
        })}
      </StaggerContainer>
    </PageShell>
  );
}
