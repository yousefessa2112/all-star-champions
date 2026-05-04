"use client";

import { useMemo, useState } from "react";
import { PageShell } from "@/components/page-shell";
import { useTournament } from "@/components/tournament-provider";

export default function TeamsPage() {
  const { state, spotsRemaining } = useTournament();
  const [query, setQuery] = useState("");

  const teams = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return state.teams;
    }
    return state.teams.filter(
      (team) =>
        team.name.toLowerCase().includes(q) ||
        team.captainName.toLowerCase().includes(q),
    );
  }, [query, state.teams]);

  return (
    <PageShell>
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="section-title">Registered Teams</h1>
          <p className="mt-2 text-white/70">{spotsRemaining}/16 spots remaining</p>
        </div>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search team or captain..."
          className="w-full rounded-xl border border-white/15 bg-[#0c1a31] px-4 py-3 outline-none focus:border-[#FFD700] sm:w-80"
        />
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {teams.map((team) => (
          <article key={team.id} className="card">
            <h2 className="text-xl font-bold text-[#FFD700]">{team.name}</h2>
            <p className="mt-2 text-sm text-white/80">Captain: {team.captainName}</p>
            <p className="text-sm text-white/70">Players: {team.players.length}</p>
          </article>
        ))}
        {teams.length === 0 ? (
          <div className="card sm:col-span-2 lg:col-span-3">No teams found.</div>
        ) : null}
      </section>
    </PageShell>
  );
}