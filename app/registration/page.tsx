"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { PageShell } from "@/components/page-shell";
import { useTournament } from "@/components/tournament-provider";
import { AnimateIn, StaggerContainer, StaggerItem } from "@/components/animate-in";
import { UserPlus, X, Plus } from "lucide-react";

export default function RegistrationPage() {
  const { state, spotsRemaining, registerTeam } = useTournament();
  const [teamName, setTeamName] = useState("");
  const [captainName, setCaptainName] = useState("");
  const [captainPhone, setCaptainPhone] = useState("");
  const [captainEmail, setCaptainEmail] = useState("");
  const [players, setPlayers] = useState<string[]>(["", "", "", "", ""]);
  const [submitting, setSubmitting] = useState(false);

  const cleanPlayers = useMemo(() => players.map((p) => p.trim()).filter(Boolean), [players]);
  const registrationClosed = !state.settings.registrationOpen || spotsRemaining === 0;

  const updatePlayer = (index: number, value: string) => {
    setPlayers((prev) => prev.map((player, idx) => (idx === index ? value : player)));
  };

  const addPlayer = () => {
    if (players.length >= 8) { toast.error("Maximum 8 players per team."); return; }
    setPlayers((prev) => [...prev, ""]);
  };

  const removePlayer = (index: number) => {
    if (players.length <= 5) { toast.error("Minimum 5 players required."); return; }
    setPlayers((prev) => prev.filter((_, idx) => idx !== index));
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!teamName || !captainName || !captainPhone || !captainEmail) {
      toast.error("Please complete all required fields."); return;
    }
    if (cleanPlayers.length < 5 || cleanPlayers.length > 8) {
      toast.error("Team must include 5 to 8 players."); return;
    }
    setSubmitting(true);
    const result = await registerTeam({ name: teamName, captainName, captainPhone, captainEmail, players: cleanPlayers });
    setSubmitting(false);
    if (!result.ok) { toast.error(result.message ?? "Registration failed."); return; }
    toast.success("Registration submitted for admin approval.");
    setTeamName(""); setCaptainName(""); setCaptainPhone(""); setCaptainEmail("");
    setPlayers(["", "", "", "", ""]);
  };

  return (
    <PageShell>
      {/* Header */}
      <AnimateIn>
        <div className="mb-8">
          <p className="font-condensed text-xs font-bold tracking-[0.3em] text-[#FFD700] uppercase">JOIN THE TOURNAMENT</p>
          <h1 className="section-title mt-2">TEAM REGISTRATION</h1>
          <div className="mt-2 h-1 w-24 bg-[#FFD700]" style={{ transform: "skewX(-12deg)" }} />
          <p className="mt-4 font-condensed text-sm text-[#0A1628]/60 tracking-wide">
            {registrationClosed
              ? "Registration is currently closed."
              : `${spotsRemaining} of ${state.settings.maxTeams} spots remaining`}
          </p>
        </div>
      </AnimateIn>

      <AnimateIn delay={0.1}>
        <div className="border-2 border-[#0A1628] bg-white p-6 sm:p-8">
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Team Info */}
            <div>
              <h2 className="font-heading text-lg font-bold tracking-wider text-[#0A1628] uppercase mb-4">
                TEAM INFORMATION
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="font-condensed text-xs font-semibold tracking-wider text-[#0A1628]/60 uppercase block mb-1">Team Name</label>
                  <input value={teamName} onChange={(e) => setTeamName(e.target.value)} placeholder="Enter team name"
                    className="input-field" disabled={registrationClosed} />
                </div>
                <div>
                  <label className="font-condensed text-xs font-semibold tracking-wider text-[#0A1628]/60 uppercase block mb-1">Captain Name</label>
                  <input value={captainName} onChange={(e) => setCaptainName(e.target.value)} placeholder="Enter captain name"
                    className="input-field" disabled={registrationClosed} />
                </div>
                <div>
                  <label className="font-condensed text-xs font-semibold tracking-wider text-[#0A1628]/60 uppercase block mb-1">Captain Phone</label>
                  <input value={captainPhone} onChange={(e) => setCaptainPhone(e.target.value)} placeholder="Enter phone number"
                    className="input-field" disabled={registrationClosed} />
                </div>
                <div>
                  <label className="font-condensed text-xs font-semibold tracking-wider text-[#0A1628]/60 uppercase block mb-1">Captain Email</label>
                  <input type="email" value={captainEmail} onChange={(e) => setCaptainEmail(e.target.value)} placeholder="Enter email"
                    className="input-field" disabled={registrationClosed} />
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-[#D4D0CB]" />

            {/* Players */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading text-lg font-bold tracking-wider text-[#0A1628] uppercase">
                  PLAYERS ({cleanPlayers.length}/8)
                </h2>
                <button type="button" onClick={addPlayer} disabled={registrationClosed || players.length >= 8}
                  className="inline-flex items-center gap-1 font-condensed text-xs font-semibold tracking-wider text-[#FFD700] hover:text-[#E6C200] disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                  <Plus className="h-4 w-4" /> ADD PLAYER
                </button>
              </div>
              <StaggerContainer className="space-y-3" staggerDelay={0.05}>
                {players.map((player, index) => (
                  <StaggerItem key={`player-${index}`}>
                    <div className="flex gap-2">
                      <input value={player} onChange={(e) => updatePlayer(index, e.target.value)}
                        placeholder={`Player ${index + 1}`}
                        className="input-field flex-1" disabled={registrationClosed} />
                      <button type="button" onClick={() => removePlayer(index)} disabled={registrationClosed || players.length <= 5}
                        className="border-2 border-[#D4D0CB] px-3 text-[#0A1628]/40 hover:border-[#FFD700] hover:text-[#FFD700] disabled:opacity-30 transition-colors">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>

            {/* Submit */}
            <button type="submit" disabled={registrationClosed || submitting}
              className="gold-btn w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed">
              <UserPlus className="mr-2 h-5 w-5" />
              {submitting ? "SUBMITTING..." : "SUBMIT REGISTRATION"}
            </button>
          </form>
        </div>
      </AnimateIn>
    </PageShell>
  );
}
