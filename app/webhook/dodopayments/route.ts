import { Webhook } from "standardwebhooks";
import { headers } from "next/headers";

export async function POST(request: Request) {
  const webhookSecret = process.env.DODO_WEBHOOK_KEY;
  if (!webhookSecret) {
    return new Response("Webhook secret is not configured", { status: 500 });
  }

  const webhook = new Webhook(webhookSecret);
  const headersList = await headers();
  const rawBody = await request.text();

  const webhookHeaders = {
    "webhook-id": headersList.get("webhook-id") || "",
    "webhook-signature": headersList.get("webhook-signature") || "",
    "webhook-timestamp": headersList.get("webhook-timestamp") || "",
  };

  await webhook.verify(rawBody, webhookHeaders);
  const payload = JSON.parse(rawBody);
  switch (payload.type) {
    case "payment.succeeded":
      console.log("payment successfull fuckers");
      break;
  }

  return new Response("ok", { status: 200 });
}
