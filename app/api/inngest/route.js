export const dynamic = "force-dynamic";

import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import {
  syncUserCreation,
  syncUserUpdation,
  syncUserDeletion,
} from "@/inngest/functions";

export const { GET, PUT } = serve({
  client: inngest,
  functions: [
    syncUserCreation,
    syncUserUpdation,
    syncUserDeletion,
  ],
});

export async function POST(req) {
  const body = await req.json();

  console.log("FULL BODY:", JSON.stringify(body, null, 2));

  // ✅ correct extraction
  const eventName =
    body?.event?.name ||   // THIS is your case
    body.type ||
    body.event ||
    body.event_type;

  const eventData =
    body?.event?.data ||   // THIS is your case
    body.data ||
    body;

  if (!eventName) {
    console.error("EVENT NAME STILL MISSING:", body);
    return new Response("Missing event name", { status: 400 });
  }

  await inngest.send({
    name: eventName,
    data: eventData,
  });

  return new Response("ok");
}