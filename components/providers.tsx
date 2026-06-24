"use client";

import { Toaster } from "react-hot-toast";
import { TournamentProvider } from "@/components/tournament-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TournamentProvider>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#0A1628",
            color: "#FFFFFF",
            border: "2px solid #FFD700",
            borderRadius: "0",
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 600,
            letterSpacing: "0.05em",
          },
        }}
      />
    </TournamentProvider>
  );
}
