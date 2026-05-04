"use client";

import { useMemo, useState } from "react";
import { PageShell } from "@/components/page-shell";
import { useTournament } from "@/components/tournament-provider";
import { GroupName } from "@/lib/types";

const groups: GroupName[] = ["A", "B", "C", "D"];

export default function GroupsPage() {
  const { state } = useTournament();
  const [sortEnabled, setSortEnabled] = useState(true);

  const teamById = useMemo(() => {
    return new Map(state.teams.map((team) => [team.id, team]));
  }, [state.teams]);

  if (!state.settings.groupsVisible) {
    return (
      <PageShell>
        <div className="card">
          <h1 className="section-title">Groups</h1>
          <p className="mt-3 text-white/70">Groups will appear after the admin assigns them.</p>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="section-title">Group Stage</h1>
        <button
          type="button"
          onClick={() => setSortEnabled((v) => !v)}
          className="rounded-xl border border-white/20 px-4 py-2 text-sm hover:border-[#FFD700]"
        >
          {sortEnabled ? "Sorted by Points" : "Original Order"}
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {groups.map((group) => {
          const rows = sortEnabled
            ? state.standings[group]
            : state.groups[group]
                .map((teamId) => state.standings[group].find((row) => row.teamId === teamId))
                .filter((row): row is (typeof state.standings)[GroupName][number] => Boolean(row));
          return (
            <section key={group} className="card overflow-x-auto">
              <h2 className="mb-3 text-lg font-bold text-[#FFD700]">Group {group}</h2>
              <table className="min-w-full text-sm">
                <thead className="text-white/60">
                  <tr>
                    <th className="px-2 py-2 text-left">Team</th>
                    <th className="px-2 py-2">W</th>
                    <th className="px-2 py-2">D</th>
                    <th className="px-2 py-2">L</th>
                    <th className="px-2 py-2">GF</th>
                    <th className="px-2 py-2">GA</th>
                    <th className="px-2 py-2">GD</th>
                    <th className="px-2 py-2">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.teamId} className="border-t border-white/10 text-center">
                      <td className="px-2 py-2 text-left">{teamById.get(row.teamId)?.name ?? "Unknown"}</td>
                      <td className="px-2 py-2">{row.w}</td>
                      <td className="px-2 py-2">{row.d}</td>
                      <td className="px-2 py-2">{row.l}</td>
                      <td className="px-2 py-2">{row.gf}</td>
                      <td className="px-2 py-2">{row.ga}</td>
                      <td className="px-2 py-2">{row.gd}</td>
                      <td className="px-2 py-2 font-bold text-[#FFD700]">{row.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          );
        })}
      </div>
    </PageShell>
  );
}