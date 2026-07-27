import React from "react";
import { config, hasStripe } from "../lib/config";

/**
 * Wraps the app in Stripe's provider ONLY when a publishable key is configured.
 * In demo mode (no key, e.g. running in Expo Go) we skip the native module
 * entirely so the app stays fully runnable without a custom dev client.
 */
export function StripeGate({ children }: { children: React.ReactNode }) {
  if (!hasStripe) return <>{children}</>;

  try {
    // Lazy require: the native module is only present in a dev/production build.
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
