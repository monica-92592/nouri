/**
 * Web stub — Stripe Payment Sheet is a native-only SDK.
 * Demo subscription unlock still works via createSubscriptionIntent in billing.ts.
 */
export async function presentStripeCheckout(_params: {
  clientSecret: string;
  customerId?: string;
  ephemeralKey?: string;
}): Promise<{ ok: boolean; cancelled?: boolean; error?: string }> {
  return {
    ok: false,
    error: "Stripe Payment Sheet requires the iOS/Android app. Use demo mode on web, or open Nouri on a device.",
  };
}
