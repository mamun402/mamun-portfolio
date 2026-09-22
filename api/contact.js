const recipient = "mamun180@outlook.com";

export default async function handler(request, response) {
  if (request.method !== "POST") {
    return response.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, subject, message } = request.body || {};
  if (!name || !email || !subject || !message) {
    return response.status(400).json({ error: "All fields are required" });
  }

  if (!process.env.RESEND_API_KEY) {
    return response.status(503).json({ error: "Email service is not configured" });
  }

  const from = process.env.CONTACT_FROM_EMAIL;
  if (!from || from.includes("your-verified-domain.com")) {
    return response.status(503).json({
      error: "Configure CONTACT_FROM_EMAIL with an email address from a verified domain",
    });
  }

  try {
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [recipient],
        reply_to: email,
        subject: `[Portfolio] ${subject}`,
        text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      }),
    });

    if (!resendResponse.ok) {
      const providerError = await resendResponse.text();
      console.error("Resend rejected the contact message:", providerError);
      return response.status(502).json({
        error: "Email provider rejected the sender. Verify CONTACT_FROM_EMAIL in Resend.",
      });
    }

    return response.status(200).json({ ok: true });
  } catch {
    return response.status(500).json({ error: "Could not send message" });
  }
}
