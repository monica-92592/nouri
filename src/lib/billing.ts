import { config, DEMO_MODE } from "./config";
import type { SubscriptionPlan } from "./types";

export const PLANS: {
  id: SubscriptionPlan;
  label: string;
  price: string;
  cadence: string;
  perDay: string;
  badge?: string;
  savings?: string;
}[] = [
  {
    id: "yearly",
    label: "Yearly",
    price: "$59.99",
    cadence: "/year",
    perDay: "just $0.16 / day",
    badge: "Best value",
    savings: "Save 50%",
  },
  {
    id: "monthly",
    label: "Monthly",
    price: "$9.99",
    cadence: "/month",
    perDay: "billed monthly",
  },
];

export type CheckoutResult = {
  ok: boolean;
  demo?: boolean;
  error?: string;
};

/**
 * Starts a subscription. With a backend configured this creates a Stripe
 * PaymentIntent/Subscription and confirms it via the native Payment Sheet.
 * The actual Stripe Payment Sheet call lives in the paywall screen (needs the
 * useStripe hook); this helper fetches the client secret from our server.
 */
export async function createSubscriptionIntent(
  plan: SubscriptionPlan,
  email?: string
): Promise<{ clientSecret?: string; customerId?: string; ephemeralKey?: string; demo?: boolean; error?: string }> {
  if (DEMO_MODE) {
    await new Promise((r) => setTimeout(r, 900));
    return { demo: true };
  }
  try {
    const res = await fetch(`${config.apiBaseUrl}/create-subscription`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan, email }),
    });
    if (!res.ok) throw new Error(`status ${res.status}`);
    return await res.json();
  } catch (err: any) {
    return { error: err?.message ?? "Could not reach billing server" };
  }
}

export function renewalDate(plan: SubscriptionPlan): string {
  const d = new Date();
  if (plan === "yearly") d.setFullYear(d.getFullYear() + 1);
  else d.setMonth(d.getMonth() + 1);
  return d.toISOString();
}
