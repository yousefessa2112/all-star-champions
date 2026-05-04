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
            background: "#0f1f38",
            color: "#f8fafc",
            border: "1px solid #FFD70055",
          },
        }}
      />
    </TournamentProvider>
  );
}