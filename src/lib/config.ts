import Constants from "expo-constants";

/**
 * Central config. Values are read from Expo `extra` (app config) or public
 * env vars. Anything missing simply falls back to Nouri's built-in DEMO MODE,
 * so the whole app is runnable end-to-end with zero secrets.
 */
type Extra = {
  apiBaseUrl?: string;
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  stripePublishableKey?: string;
};

const extra = (Constants.expoConfig?.extra ?? {}) as Extra;

function pick(...vals: (string | undefined)[]) {
  return vals.find((v) => !!v && v.trim().length > 0) ?? "";
}

export const config = {
  apiBaseUrl: pick(extra.apiBaseUrl, process.env.EXPO_PUBLIC_API_BASE_URL),
  supabaseUrl: pick(extra.supabaseUrl, process.env.EXPO_PUBLIC_SUPABASE_URL),
  supabaseAnonKey: pick(extra.supabaseAnonKey, process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY),
  stripePublishableKey: pick(
    extra.stripePublishableKey,
    process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ),
};

/** True when a real backend is configured for OpenAI Vision + Stripe. */
export const hasBackend = config.apiBaseUrl.length > 0;
/** True when Supabase auth/storage is configured. */
export const hasSupabase = config.supabaseUrl.length > 0 && config.supabaseAnonKey.length > 0;
/** True when Stripe native SDK can be initialized. */
export const hasStripe = config.stripePublishableKey.length > 0;

/** Master switch: run entirely on-device with mocked AI + billing. */
export const DEMO_MODE = !hasBackend;
