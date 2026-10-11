import { Resend } from "resend";

type ContactRequest = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
};

type ValidContactRequest = {
  name: string;
  email: string;
  message: string;
};

function isValidContactRequest(body: ContactRequest): body is ValidContactRequest {
  return (
    typeof body.name === "string" &&
    body.name.trim().length >= 2 &&
    body.name.trim().length <= 100 &&
    typeof body.email === "string" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim()) &&
    typeof body.message === "string" &&
    body.message.trim().length >= 10 &&
    body.message.trim().length <= 5000
  );
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const recipient = process.env.CONTACT_EMAIL;
  const sender = process.env.CONTACT_FROM;

  if (!apiKey || !recipient || !sender) {
    return Response.json({ error: "Email service is not configured" }, { status: 500 });
  }

  let body: ContactRequest;

  try {
    body = (await request.json()) as ContactRequest;
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!isValidContactRequest(body)) {
    return Response.json({ error: "Please provide a valid name, email, and message" }, { status: 400 });
  }

  const resend = new Resend(apiKey);
  const name = body.name.trim();
  const email = body.email.trim();
  const message = body.message.trim();

  try {
    const { error } = await resend.emails.send({
      from: sender,
      to: recipient,
      replyTo: email,
      subject: `Portfolio contact from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    });

    if (error) {
      console.error("Resend rejected contact email:", error);
      return Response.json({ error: "Unable to send message" }, { status: 502 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Contact email request failed:", error);
    return Response.json({ error: "Unable to send message" }, { status: 502 });
  }
}