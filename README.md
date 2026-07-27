# Nouri 🌿

**Snap a meal. Know it in seconds.**

Nouri is a subscription-based, photo-first calorie & nutrition coach built with
Expo / React Native. Users photograph a meal and get accurate calories and
macros in seconds, plus coaching tips tailored to their age, habits and goals —
and a daily affirmation to keep the journey mindful and kind.

- 📸 **Photo calorie counting** — OpenAI Vision (`gpt-4o`) estimates calories, macros and a health score from one photo.
- 🎯 **Personalized plan** — Mifflin–St Jeor calorie targets from an onboarding profile, with realistic pacing.
- 🧭 **Coaching** — rules-based tips tuned to age, habits and goals; premium adds AI weekly reports.
- 🌸 **Daily affirmations** — free daily affirmation + premium themed packs.
- 💳 **Subscriptions** — Stripe (monthly / yearly) via the native Payment Sheet.
- 🔒 **Keys stay off-device** — a small Node backend proxies OpenAI + Stripe.

> **Runs out of the box in DEMO MODE** — with no keys configured, meal analysis
> returns realistic sample results and "subscribing" unlocks premium locally, so
> you can experience the entire flow immediately.

---

## Quick start (app)

```bash
npm install --legacy-peer-deps
npm start            # then press i / a, or scan the QR in Expo Go
```

Fonts, camera, image picker, gradients and the calorie ring all work in
**Expo Go**. Stripe's native Payment Sheet requires a **dev build** (see below);
without it the app stays in demo mode and premium unlocks locally.

## Configuration

Copy the env template and fill in what you have — anything left blank falls back
to demo behavior:

```bash
cp .env.example .env
```

| Variable | Purpose |
|---|---|
| `EXPO_PUBLIC_API_BASE_URL` | URL of the `/server` backend. Blank = demo mode. |
| `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (safe to ship). |
| `EXPO_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Optional auth + cloud sync. |

## Backend (OpenAI Vision + Stripe)

```bash
cd server
cp .env.example .env     # add OPENAI_API_KEY + STRIPE_SECRET_KEY + price IDs
npm install
npm start                # http://localhost:4000
```

Then set `EXPO_PUBLIC_API_BASE_URL` in the app `.env` to the server URL (use your
LAN IP or a tunnel like ngrok when testing on a device).

Endpoints:
- `POST /analyze` — image → structured meal JSON via `gpt-4o`.
- `POST /create-subscription` — creates a Stripe customer + subscription and returns Payment Sheet params.
- `POST /webhook` — Stripe webhook for entitlement updates (wire to your DB).

## Enabling real Stripe payments (dev build)

The Stripe SDK needs native code, so build a custom dev client:

```bash
npx expo install expo-dev-client
npx expo run:ios        # or run:android
```

With `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY` set and the backend running, the paywall
opens the native Payment Sheet for real card entry.

> **App Store note:** Apple requires In-App Purchase for digital subscriptions on
> iOS. Stripe is used here for development, Android, and web billing. Before an
> App Store release, add Apple IAP (e.g. via RevenueCat) — the entitlement logic
> in `src/state/store.tsx` is already isolated for that swap.

## Project structure

```
app/                      Expo Router routes
  _layout.tsx             fonts, providers, navigation stack
  index.tsx               hydration gate → onboarding or tabs
  onboarding.tsx          multi-step profile + plan setup
  paywall.tsx             subscription plans + Stripe Payment Sheet
  (tabs)/
    index.tsx             Today dashboard (calorie ring, macros, affirmation)
    scan.tsx              camera / library → AI analysis → log
    diary.tsx             meal history grouped by day
    coach.tsx             personalized tips + plan + account
    affirmations.tsx      daily affirmation + packs
src/
  theme.ts                design tokens (colors, type, spacing)
  state/store.tsx         persisted app state (AsyncStorage)
  lib/                    config, nutrition math, ai, billing, tips, affirmations
  components/             Screen, Button, Card, CalorieRing, MacroBar, bits
server/                   Node/Express backend for OpenAI + Stripe
```

## Tech

Expo SDK 57 · React Native 0.86 · Expo Router · Reanimated · react-native-svg ·
Stripe · OpenAI · Supabase (optional).
