import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Team Registration",
  description:
    "Register your team for the All Star Champions soccer tournament in Brooklyn. Limited spots available — secure your place at SoFive today.",
};

export default function RegistrationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
