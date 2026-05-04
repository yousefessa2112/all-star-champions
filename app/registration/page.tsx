"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { PageShell } from "@/components/page-shell";
import { useTournament } from "@/components/tournament-provider";

export default function RegistrationPage() {
  const { state, spotsRemaining, registerTeam } = useTournament();
  const [teamName, setTeamName] = useState("");
  const [captainName, setCaptainName] = useState("");
  const [captainPhone, setCaptainPhone] = useState("");
  const [captainEmail, setCaptainEmail] = useState("");
  const [players, setPlayers] = useState<string[]>(["", "", "", "", ""]);

  const cleanPlayers = useMemo(() => players.map((p) => p.trim()).filter(Boolean), [players]);
  const registrationClosed = !state.settings.registrationOpen || spotsRemaining === 0;

  const updatePlayer = (index: number, value: string) => {
    setPlayers((prev) => prev.map((player, idx) => (idx === index ? value : player)));
  };

  const addPlayer = () => {
    if (players.length >= 7) {
      toast.error("Maximum 7 players per team.");
      return;
    }
    setPlayers((prev) => [...prev, ""]);
  };

  const removePlayer = (index: number) => {
    if (players.length <= 5) {
      toast.error("Minimum 5 players required.");
      return;
    }
    setPlayers((prev) => prev.filter((_, idx) => idx !== index));
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!teamName || !captainName || !captainPhone || !captainEmail) {
      toast.error("Please complete all required fields.");
      return;
    }
    if (cleanPlayers.length < 5 || cleanPlayers.length > 7) {
      toast.error("Team must include 5 to 7 players.");
      return;
    }
    const result = registerTeam({
      name: teamName,
      captainName,
      captainPhone,
      captainEmail,
      players: cleanPlayers,
    });
    if (!result.ok) {
      toast.error(result.message ?? "Registration failed.");
      return;
    }
    toast.success("Team registered successfully.");
    setTeamName("");
    setCaptainName("");
    setCaptainPhone("");
    setCaptainEmail("");
    setPlayers(["", "", "", "", ""]);
  };

  return (
    <PageShell>
      <section className="card">
        <h1 className="section-title">Team Registration</h1>
        <p className="mt-2 text-white/70">
          {registrationClosed ? "Registration Closed" : `${spotsRemaining}/${state.settings.maxTeams} spots remaining`}
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Team Name"
              className="rounded-xl border border-white/15 bg-[#0c1a31] px-4 py-3 outline-none focus:border-[#FFD700]"
              disabled={registrationClosed}
            />
            <input
              value={captainName}
              onChange={(e) => setCaptainName(e.target.value)}
              placeholder="Captain Name"
              className="rounded-xl border border-white/15 bg-[#0c1a31] px-4 py-3 outline-none focus:border-[#FFD700]"
              disabled={registrationClosed}
            />
            <input
              value={captainPhone}
              onChange={(e) => setCaptainPhone(e.target.value)}
              placeholder="Captain Phone"
              className="rounded-xl border border-white/15 bg-[#0c1a31] px-4 py-3 outline-none focus:border-[#FFD700]"
              disabled={registrationClosed}
            />
            <input
              type="email"
              value={captainEmail}
              onChange={(e) => setCaptainEmail(e.target.value)}
              placeholder="Captain Email"
              className="rounded-xl border border-white/15 bg-[#0c1a31] px-4 py-3 outline-none focus:border-[#FFD700]"
              disabled={registrationClosed}
            />
          </div>

          <div>
            <p className="mb-2 text-sm text-white/70">Players ({cleanPlayers.length}/7)</p>
            <div className="space-y-2">
              {players.map((player, index) => (
                <div key={`player-${index}`} className="flex gap-2">
                  <input
                    value={player}
                    onChange={(e) => updatePlayer(index, e.target.value)}
                    placeholder={`Player ${index + 1}`}
                    className="flex-1 rounded-xl border border-white/15 bg-[#0c1a31] px-4 py-3 outline-none focus:border-[#FFD700]"
                    disabled={registrationClosed}
                  />
                  <button
                    type="button"
                    onClick={() => removePlayer(index)}
                    disabled={registrationClosed}
                    className="rounded-xl border border-white/20 px-3 text-sm hover:border-[#FFD700] disabled:opacity-50"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addPlayer}
              disabled={registrationClosed}
              className="mt-3 rounded-xl border border-[#FFD70055] px-4 py-2 text-sm text-[#FFD700] hover:bg-[#FFD70022] disabled:opacity-50"
            >
              Add Player
            </button>
          </div>

          <button type="submit" disabled={registrationClosed} className="gold-btn disabled:opacity-50">
            Submit Registration
          </button>
        </form>
      </section>
    </PageShell>
  );
}