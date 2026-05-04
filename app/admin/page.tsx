"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { PageShell } from "@/components/page-shell";
import { useTournament } from "@/components/tournament-provider";
import { GroupName } from "@/lib/types";

const groupNames: GroupName[] = ["A", "B", "C", "D"];

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const { state, drawGroups, assignTeamToGroup, updateGroupMatchScore, updateBracketMatchScore } = useTournament();
  const {
    setRegistrationOpen,
    setGroupsVisible,
    setBracketVisible,
    setNextTournamentDate,
  } = useTournament();

  const teamById = useMemo(() => new Map(state.teams.map((team) => [team.id, team])), [state.teams]);

  const login = (event: React.FormEvent) => {
    event.preventDefault();
    if (password === "allstar2026") {
      setAuthorized(true);
      toast.success("Admin access granted.");
      return;
    }
    toast.error("Incorrect password.");
  };

  if (!authorized) {
    return (
      <PageShell>
        <section className="card mx-auto max-w-md">
          <h1 className="section-title">Admin Panel</h1>
          <form onSubmit={login} className="mt-5 space-y-3">
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Admin Password"
              className="w-full rounded-xl border border-white/15 bg-[#0c1a31] px-4 py-3 outline-none focus:border-[#FFD700]"
            />
            <button className="gold-btn w-full" type="submit">
              Enter Admin
            </button>
          </form>
        </section>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <section className="card">
        <h1 className="section-title">Admin Panel</h1>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="rounded-xl border border-white/10 bg-[#0c1a31] p-3 text-sm">
            <span className="mb-1 block text-white/70">Next Tournament Date</span>
            <input
              type="datetime-local"
              className="w-full rounded border border-white/15 bg-[#071224] px-2 py-2"
              onChange={(event) => setNextTournamentDate(new Date(event.target.value).toISOString())}
            />
          </label>
          <button type="button" className="rounded-xl border border-white/20 p-3 hover:border-[#FFD700]" onClick={() => setRegistrationOpen(!state.settings.registrationOpen)}>
            Registration: {state.settings.registrationOpen ? "Open" : "Closed"}
          </button>
          <button type="button" className="rounded-xl border border-white/20 p-3 hover:border-[#FFD700]" onClick={() => setGroupsVisible(!state.settings.groupsVisible)}>
            Groups: {state.settings.groupsVisible ? "Visible" : "Hidden"}
          </button>
          <button type="button" className="rounded-xl border border-white/20 p-3 hover:border-[#FFD700]" onClick={() => setBracketVisible(!state.settings.bracketVisible)}>
            Bracket: {state.settings.bracketVisible ? "Visible" : "Hidden"}
          </button>
        </div>
      </section>

      <section className="card mt-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-[#FFD700]">Group Assignment</h2>
          <button
            type="button"
            onClick={() => {
              const result = drawGroups();
              if (!result.ok) {
                toast.error(result.message ?? "Cannot draw groups.");
                return;
              }
              toast.success("Groups assigned randomly.");
            }}
            className="gold-btn"
          >
            Draw Groups Randomly
          </button>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {state.teams.map((team) => (
            <div key={team.id} className="rounded-xl border border-white/10 bg-[#0c1a31] p-3">
              <p className="font-semibold">{team.name}</p>
              <select
                className="mt-2 w-full rounded border border-white/15 bg-[#071224] px-2 py-2 text-sm"
                value={groupNames.find((group) => state.groups[group].includes(team.id)) ?? ""}
                onChange={(event) => assignTeamToGroup(team.id, event.target.value as GroupName)}
              >
                <option value="">Select Group</option>
                {groupNames.map((group) => (
                  <option key={group} value={group}>
                    Group {group}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </section>

      <section className="card mt-6">
        <h2 className="text-xl font-bold text-[#FFD700]">Group Stage Scores</h2>
        <div className="mt-4 space-y-3">
          {state.groupMatches.map((match) => (
            <div key={match.id} className="grid gap-2 rounded-xl border border-white/10 bg-[#0c1a31] p-3 md:grid-cols-[1fr_auto_1fr_auto] md:items-center">
              <span>{teamById.get(match.homeTeamId)?.name ?? "TBD"}</span>
              <input
                type="number"
                min={0}
                defaultValue={match.homeScore ?? ""}
                onBlur={(event) =>
                  updateGroupMatchScore(
                    match.id,
                    Number(event.currentTarget.value || 0),
                    match.awayScore ?? 0,
                  )
                }
                className="w-20 rounded border border-white/20 bg-[#071224] px-2 py-1"
              />
              <span>{teamById.get(match.awayTeamId)?.name ?? "TBD"}</span>
              <input
                type="number"
                min={0}
                defaultValue={match.awayScore ?? ""}
                onBlur={(event) =>
                  updateGroupMatchScore(
                    match.id,
                    match.homeScore ?? 0,
                    Number(event.currentTarget.value || 0),
                  )
                }
                className="w-20 rounded border border-white/20 bg-[#071224] px-2 py-1"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="card mt-6">
        <h2 className="text-xl font-bold text-[#FFD700]">Bracket Scores</h2>
        <div className="mt-4 space-y-3">
          {state.bracketMatches.map((match) => (
            <div key={match.id} className="grid gap-2 rounded-xl border border-white/10 bg-[#0c1a31] p-3 md:grid-cols-[1fr_auto_1fr_auto] md:items-center">
              <span>{teamById.get(match.homeTeamId ?? "")?.name ?? "TBD"}</span>
              <input
                type="number"
                min={0}
                defaultValue={match.homeScore ?? ""}
                onBlur={(event) =>
                  updateBracketMatchScore(
                    match.id,
                    Number(event.currentTarget.value || 0),
                    match.awayScore ?? 0,
                  )
                }
                className="w-20 rounded border border-white/20 bg-[#071224] px-2 py-1"
              />
              <span>{teamById.get(match.awayTeamId ?? "")?.name ?? "TBD"}</span>
              <input
                type="number"
                min={0}
                defaultValue={match.awayScore ?? ""}
                onBlur={(event) =>
                  updateBracketMatchScore(
                    match.id,
                    match.homeScore ?? 0,
                    Number(event.currentTarget.value || 0),
                  )
                }
                className="w-20 rounded border border-white/20 bg-[#071224] px-2 py-1"
              />
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}