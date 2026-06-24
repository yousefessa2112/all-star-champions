"use client";

import { useMemo, useState } from "react";
import { PageShell } from "@/components/page-shell";
import { useTournament } from "@/components/tournament-provider";
import { ALL_GROUPS, GroupName } from "@/lib/types";
import { AnimateIn, StaggerContainer, StaggerItem } from "@/components/animate-in";

export default function GroupsPage() {
  const { state } = useTournament();
  const [sortEnabled, setSortEnabled] = useState(true);

  const teamById = useMemo(() => {
    return new Map(state.teams.map((team) => [team.id, team]));
  }, [state.teams]);

  if (!state.settings.groupsVisible) {
    return (
      <PageShell>
        <AnimateIn>
          <div className="border-2 border-[#0A1628] bg-white p-8">
            <p className="font-condensed text-xs font-bold tracking-[0.3em] text-[#FFD700] uppercase">TOURNAMENT</p>
            <h1 className="section-title mt-2">GROUP STAGE</h1>
            <div className="mt-2 h-1 w-24 bg-[#FFD700]" style={{ transform: "skewX(-12deg)" }} />
            <p className="mt-4 font-condensed text-sm text-[#0A1628]/60 tracking-wide">
              Groups will appear after the admin assigns them.
            </p>
          </div>
        </AnimateIn>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <AnimateIn>
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-condensed text-xs font-bold tracking-[0.3em] text-[#FFD700] uppercase">TOURNAMENT</p>
            <h1 className="section-title mt-2">GROUP STAGE</h1>
            <div className="mt-2 h-1 w-24 bg-[#FFD700]" style={{ transform: "skewX(-12deg)" }} />
          </div>
          <button
            type="button"
            onClick={() => setSortEnabled((v) => !v)}
            className="outline-btn text-xs py-2 px-4"
          >
            {sortEnabled ? "SORTED BY POINTS" : "ORIGINAL ORDER"}
          </button>
        </div>
      </AnimateIn>

      <StaggerContainer className="grid gap-4 lg:grid-cols-2" staggerDelay={0.08}>
        {ALL_GROUPS.map((group) => {
          const rows = sortEnabled
            ? state.standings[group]
            : state.groups[group]
                .map((teamId) => state.standings[group].find((row) => row.teamId === teamId))
                .filter((row): row is (typeof state.standings)[GroupName][number] => Boolean(row));
          
          if (rows.length === 0) return null;
          
          return (
            <StaggerItem key={group}>
              <section className="border-2 border-[#0A1628] bg-white overflow-hidden">
                <div className="bg-[#0A1628] px-4 py-3">
                  <h2 className="font-heading text-lg font-bold tracking-wider text-white">
                    GROUP {group}
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b-2 border-[#0A1628]">
                        <th className="px-3 py-2 text-left font-condensed text-xs font-semibold tracking-wider text-[#0A1628]/60 uppercase">Team</th>
                        <th className="px-2 py-2 font-condensed text-xs font-semibold tracking-wider text-[#0A1628]/60">W</th>
                        <th className="px-2 py-2 font-condensed text-xs font-semibold tracking-wider text-[#0A1628]/60">D</th>
                        <th className="px-2 py-2 font-condensed text-xs font-semibold tracking-wider text-[#0A1628]/60">L</th>
                        <th className="px-2 py-2 font-condensed text-xs font-semibold tracking-wider text-[#0A1628]/60">GF</th>
                        <th className="px-2 py-2 font-condensed text-xs font-semibold tracking-wider text-[#0A1628]/60">GA</th>
                        <th className="px-2 py-2 font-condensed text-xs font-semibold tracking-wider text-[#0A1628]/60">GD</th>
                        <th className="px-2 py-2 font-condensed text-xs font-semibold tracking-wider text-[#FFD700]">PTS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row, i) => (
                        <tr key={row.teamId} className={`text-center ${i < rows.length - 1 ? "border-b border-[#E8E4DF]" : ""} ${i < 2 ? "bg-[#FFD700]/5" : ""}`}>
                          <td className="px-3 py-2.5 text-left font-condensed text-sm font-semibold tracking-wide">
                            {teamById.get(row.teamId)?.name ?? "Unknown"}
                          </td>
                          <td className="px-2 py-2.5 font-condensed">{row.w}</td>
                          <td className="px-2 py-2.5 font-condensed">{row.d}</td>
                          <td className="px-2 py-2.5 font-condensed">{row.l}</td>
                          <td className="px-2 py-2.5 font-condensed">{row.gf}</td>
                          <td className="px-2 py-2.5 font-condensed">{row.ga}</td>
                          <td className="px-2 py-2.5 font-condensed">{row.gd}</td>
                          <td className="px-2 py-2.5 font-heading font-bold text-[#FFD700]">{row.points}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </StaggerItem>
          );
        })}
      </StaggerContainer>
    </PageShell>
  );
}
