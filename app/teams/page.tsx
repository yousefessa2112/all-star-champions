"use client";

import { useMemo, useState } from "react";
import { PageShell } from "@/components/page-shell";
import { useTournament } from "@/components/tournament-provider";
import { AnimateIn, StaggerContainer, StaggerItem } from "@/components/animate-in";
import { Search, Users } from "lucide-react";

export default function TeamsPage() {
  const { state, spotsRemaining } = useTournament();
  const [query, setQuery] = useState("");

  const teams = useMemo(() => {
    const q = query.trim().toLowerCase();
    const approved = state.teams.filter((team) => team.status === "approved");
    if (!q) return approved;
    return approved.filter(
      (team) => team.name.toLowerCase().includes(q) || team.captainName.toLowerCase().includes(q),
    );
  }, [query, state.teams]);

  return (
    <PageShell>
      <AnimateIn>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-8">
          <div>
            <p className="font-condensed text-xs font-bold tracking-[0.3em] text-[#FFD700] uppercase">THE COMPETITION</p>
            <h1 className="section-title mt-2">REGISTERED TEAMS</h1>
            <div className="mt-2 h-1 w-24 bg-[#FFD700]" style={{ transform: "skewX(-12deg)" }} />
            <p className="mt-3 font-condensed text-sm text-[#0A1628]/60 tracking-wide">
              {spotsRemaining} of {state.settings.maxTeams} spots remaining
            </p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0A1628]/40" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search team or captain..."
              className="input-field pl-10 sm:w-80"
            />
          </div>
        </div>
      </AnimateIn>

      <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {teams.map((team) => (
          <StaggerItem key={team.id}>
            <article className="border-2 border-[#0A1628] bg-white p-5 transition-all hover:bg-[#0A1628] hover:text-white group">
              <div className="flex items-start justify-between">
                <h2 className="font-heading text-xl font-bold tracking-wider uppercase">{team.name}</h2>
                <div className="flex h-8 w-8 items-center justify-center border border-[#FFD700] text-[#FFD700]">
                  <Users className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <p className="font-condensed text-sm tracking-wide text-[#0A1628]/60 group-hover:text-white/60">
                  Captain: {team.captainName}
                </p>
                <p className="font-condensed text-sm tracking-wide text-[#0A1628]/60 group-hover:text-white/60">
                  Players: {team.players.length}
                </p>
              </div>
              <div className="mt-3 flex flex-wrap gap-1">
                {team.players.map((player, i) => (
                  <span key={i} className="font-condensed text-xs tracking-wide bg-[#F5F0EB] group-hover:bg-white/10 px-2 py-0.5 text-[#0A1628]/50 group-hover:text-white/50">
                    {player}
                  </span>
                ))}
              </div>
            </article>
          </StaggerItem>
        ))}
        {teams.length === 0 && (
          <div className="sm:col-span-2 lg:col-span-3 border-2 border-dashed border-[#D4D0CB] p-8 text-center">
            <p className="font-condensed text-sm text-[#0A1628]/50 tracking-wide">No teams found.</p>
          </div>
        )}
      </StaggerContainer>
    </PageShell>
  );
}
