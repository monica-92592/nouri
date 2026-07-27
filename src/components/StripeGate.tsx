import React from "react";
import { config, hasStripe } from "../lib/config";

/**
 * Native: wrap in StripeProvider when a publishable key is configured.
 * Kept in a non-web file so Metro never pulls the native Stripe module into web.
 */
export function StripeGate({ children }: { children: React.ReactNode }) {
  if (!hasStripe) return <>{children}</>;

  try {
    const { StripeProvider } = require("@stripe/stripe-react-native");
    return (
      <StripeProvider
        publishableKey={config.stripePublishableKey}
        merchantIdentifier="merchant.com.nouri.app"
      >
        {children}
      </StripeProvider>
    );
  } catch (e) {
    console.warn("[stripe] native module unavailable, running without it:", e);
    return <>{children}</>;
  }
}
