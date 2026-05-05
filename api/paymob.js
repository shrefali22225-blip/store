export default async function handler(req, res) {
  const { amount, firstName, lastName, email, address, country } = req.body;

  try {
    // 1) Auth
    const authRes = await fetch("https://accept.paymob.com/api/auth/tokens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ api_key: process.env.PAYMOB_API_KEY })
    });
    const { token } = await authRes.json();

    // 2) Create order
    const orderRes = await fetch("https://accept.paymob.com/api/ecommerce/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        auth_token: token,
        delivery_needed: false,
        amount_cents: amount * 100,
        currency: "EGP",
        items: []
      })
    });
    const { id: order_id } = await orderRes.json();

    // 3) Payment key
    const paymentRes = await fetch("https://accept.paymob.com/api/acceptance/payment_keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        auth_token: token,
        amount_cents: amount * 100,
        order_id,
        currency: "EGP",
        integration_id: process.env.PAYMOB_INTEGRATION_ID,
        billing_data: {
          first_name: firstName,
          last_name: lastName,
          email,
          phone_number: "01000000000",
          apartment: "NA",
          floor: "NA",
          street: address,
          building: "NA",
          city: "Cairo",
          country,
          state: "NA"
        }
      })
    });

    const { token: payment_key } = await paymentRes.json();

    res.status(200).json({ payment_key });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
