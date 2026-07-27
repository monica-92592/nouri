/**
 * Native Stripe Payment Sheet confirmation.
 * Isolated in a .native file so Metro never bundles this into web.
 */
export async function presentStripeCheckout(params: {
  clientSecret: string;
  customerId?: string;
  ephemeralKey?: string;
}): Promise<{ ok: boolean; cancelled?: boolean; error?: string }> {
  try {
    const stripe = require("@stripe/stripe-react-native");
    const init = await stripe.initPaymentSheet({
      merchantDisplayName: "Nouri",
      paymentIntentClientSecret: params.clientSecret,
      customerId: params.customerId,
      customerEphemeralKeySecret: params.ephemeralKey,
      allowsDelayedPaymentMethods: false,
    });
    if (init.error) return { ok: false, error: init.error.message };

    const res = await stripe.presentPaymentSheet();
    if (res.error) return { ok: false, cancelled: true, error: res.error.message };
    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: e?.message ?? "Stripe unavailable" };
  }
}
