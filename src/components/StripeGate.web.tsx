import React from "react";

/** Web: Stripe native module is unavailable — pass children through. */
export function StripeGate({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
