"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CONSENT_KEY = "asc-cookie-consent";

type ConsentState = "accepted" | "rejected" | "custom" | null;

export function CookieConsent() {
  const [consent, setConsent] = useState<ConsentState>(null);
  const [showCustomize, setShowCustomize] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(CONSENT_KEY);
    if (stored) {
      setConsent(stored as ConsentState);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, "accepted");
    localStorage.setItem("asc-analytics-consent", "true");
    setConsent("accepted");
    window.dispatchEvent(new Event("cookie-consent-changed"));
  };

  const reject = () => {
    localStorage.setItem(CONSENT_KEY, "rejected");
    localStorage.setItem("asc-analytics-consent", "false");
    setConsent("rejected");
    window.dispatchEvent(new Event("cookie-consent-changed"));
  };

  const saveCustom = () => {
    localStorage.setItem(CONSENT_KEY, "custom");
    localStorage.setItem("asc-analytics-consent", analyticsEnabled ? "true" : "false");
    setConsent("custom");
    setShowCustomize(false);
    window.dispatchEvent(new Event("cookie-consent-changed"));
  };

  if (!mounted || consent) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="fixed bottom-0 left-0 right-0 z-[100] border-t-4 border-[#FFD700] bg-[#0A1628] p-4 shadow-2xl sm:p-6"
      >
        <div className="mx-auto max-w-7xl">
          {!showCustomize ? (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1">
                <h3 className="font-heading text-lg font-bold tracking-wider text-white">
                  WE USE COOKIES
                </h3>
                <p className="mt-1 font-condensed text-sm text-white/60 tracking-wide">
                  We use cookies to analyze site traffic and optimize your experience. 
                  Your data stays private.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={accept}
                  className="bg-[#FFD700] px-5 py-2.5 font-heading text-xs font-bold tracking-wider text-[#0A1628] hover:bg-[#E6C200] transition-colors"
                >
                  ACCEPT ALL
                </button>
                <button
                  onClick={reject}
                  className="border-2 border-white/30 px-5 py-2.5 font-heading text-xs font-bold tracking-wider text-white hover:border-white transition-colors"
                >
                  REJECT NON-ESSENTIAL
                </button>
                <button
                  onClick={() => setShowCustomize(true)}
                  className="px-5 py-2.5 font-heading text-xs font-bold tracking-wider text-white/50 hover:text-white transition-colors"
                >
                  CUSTOMIZE
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="font-heading text-lg font-bold tracking-wider text-white mb-4">
                COOKIE PREFERENCES
              </h3>
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between border border-white/10 p-3">
                  <div>
                    <p className="font-condensed text-sm font-semibold text-white tracking-wide">Essential Cookies</p>
                    <p className="font-condensed text-xs text-white/50 tracking-wide">Required for the site to function</p>
                  </div>
                  <span className="font-heading text-xs text-[#FFD700] tracking-wider">ALWAYS ON</span>
                </div>
                <div className="flex items-center justify-between border border-white/10 p-3">
                  <div>
                    <p className="font-condensed text-sm font-semibold text-white tracking-wide">Analytics Cookies</p>
                    <p className="font-condensed text-xs text-white/50 tracking-wide">Help us understand how visitors use the site</p>
                  </div>
                  <button
                    onClick={() => setAnalyticsEnabled(!analyticsEnabled)}
                    className={`relative h-6 w-11 rounded-full transition-colors ${
                      analyticsEnabled ? "bg-[#FFD700]" : "bg-white/20"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                        analyticsEnabled ? "left-[22px]" : "left-0.5"
                      }`}
                    />
                  </button>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={saveCustom}
                  className="bg-[#FFD700] px-5 py-2.5 font-heading text-xs font-bold tracking-wider text-[#0A1628] hover:bg-[#E6C200] transition-colors"
                >
                  SAVE PREFERENCES
                </button>
                <button
                  onClick={() => setShowCustomize(false)}
                  className="px-5 py-2.5 font-heading text-xs font-bold tracking-wider text-white/50 hover:text-white transition-colors"
                >
                  BACK
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
