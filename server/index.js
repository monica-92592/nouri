/**
 * Nouri backend — keeps API keys off the device.
 *
 *  POST /analyze              -> OpenAI Vision meal analysis (JSON macros)
 *  POST /create-subscription  -> Stripe subscription + PaymentSheet params
 *  POST /webhook              -> Stripe webhook (entitlement updates)
 *  GET  /health               -> liveness
 *
 * Copy .env.example -> .env and fill in keys, then: npm install && npm start
 */
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 4000;

// --- Optional SDK clients (only created if keys exist) ---
const OPENAI_KEY = process.env.OPENAI_API_KEY;
const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;

let openai = null;
if (OPENAI_KEY) {
  const OpenAI = require("openai");
  openai = new OpenAI({ apiKey: OPENAI_KEY });
}

let stripe = null;
if (STRIPE_KEY) {
  stripe = require("stripe")(STRIPE_KEY);
}

// Price IDs from your Stripe dashboard.
const PRICE_IDS = {
  monthly: process.env.STRIPE_PRICE_MONTHLY,
  yearly: process.env.STRIPE_PRICE_YEARLY,
};

// Stripe webhook must receive the raw body — mount before express.json().
app.post("/webhook", express.raw({ type: "application/json" }), (req, res) => {
  if (!stripe) return res.status(503).send("Stripe not configured");
  const sig = req.headers["stripe-signature"];
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;
  try {
    event = secret
      ? stripe.webhooks.constructEvent(req.body, sig, secret)
      : JSON.parse(req.body.toString());
  } catch (err) {
    console.error("Webhook signature failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted":
      // TODO: persist entitlement to your DB (e.g. Supabase) keyed by customer.
      console.log(`[stripe] ${event.type}:`, event.data.object.id);
      break;
    default:
      break;
  }
  res.json({ received: true });
});

app.use(cors());
app.use(express.json({ limit: "12mb" }));

app.get("/health", (_req, res) => {
  res.json({ ok: true, openai: !!openai, stripe: !!stripe });
});

const ANALYZE_PROMPT = `You are a nutrition expert. Analyze the meal in the image and respond with STRICT JSON only, no prose.
Schema:
{
  "title": string,                       // short meal name
  "items": [                             // each distinct food
    { "name": string, "quantity": string, "calories": number, "protein": number, "carbs": number, "fat": number }
  ],
  "calories": number,                    // total kcal
  "protein": number, "carbs": number, "fat": number,  // total grams
  "healthScore": number,                 // 0-100 nutritional quality
  "confidence": "low" | "medium" | "high",
  "note": string                         // one short, encouraging insight
}
Estimate realistic portions from visual cues. Be accurate and concise.`;

app.post("/analyze", async (req, res) => {
  try {
    const { image, hint } = req.body || {};
    if (!image) return res.status(400).json({ error: "Missing image" });
    if (!openai) return res.status(503).json({ error: "OpenAI not configured" });

    const dataUrl = image.startsWith("data:")
      ? image
      : `data:image/jpeg;base64,${image}`;

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: ANALYZE_PROMPT },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: hint ? `Extra context from the user: ${hint}` : "Analyze this meal.",
            },
            { type: "image_url", image_url: { url: dataUrl, detail: "low" } },
          ],
        },
      ],
      max_tokens: 700,
    });

    const raw = completion.choices[0]?.message?.content || "{}";
    const parsed = JSON.parse(raw);
    res.json(parsed);
  } catch (err) {
    console.error("/analyze error:", err.message);
    res.status(500).json({ error: "Analysis failed" });
  }
});

app.post("/create-subscription", async (req, res) => {
  try {
    if (!stripe) return res.status(503).json({ error: "Stripe not configured" });
    const { plan, email } = req.body || {};
    const priceId = PRICE_IDS[plan];
    if (!priceId) return res.status(400).json({ error: "Unknown plan" });

    // Create (or reuse) a customer.
    const customer = await stripe.customers.create(email ? { email } : {});

    // Ephemeral key lets the mobile SDK manage the customer securely.
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: "2024-06-20" }
    );

    // Create subscription with an incomplete PaymentIntent to confirm in-app.
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      payment_behavior: "default_incomplete",
      payment_settings: { save_default_payment_method: "on_subscription" },
      expand: ["latest_invoice.payment_intent"],
    });

    const clientSecret =
      subscription.latest_invoice?.payment_intent?.client_secret;

    res.json({
      clientSecret,
      customerId: customer.id,
      ephemeralKey: ephemeralKey.secret,
      subscriptionId: subscription.id,
    });
  } catch (err) {
    console.error("/create-subscription error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Nouri server listening on :${PORT}`);
  console.log(`  OpenAI: ${openai ? "configured" : "MISSING"}  Stripe: ${stripe ? "configured" : "MISSING"}`);
});
