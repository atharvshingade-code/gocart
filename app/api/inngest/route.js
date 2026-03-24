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

// 👇 THIS is where you paste it
export async function POST(req) {
  const body = await req.json();

  console.log("FULL BODY:", JSON.stringify(body, null, 2));

  const eventName =
    body.type ||
    body.event ||
    body.event_type ||
    body?.data?.type;

  if (!eventName) {
    console.error("EVENT NAME STILL MISSING:", body);
    return new Response("Missing event name", { status: 400 });
  }

  await inngest.send({
    name: eventName,
    data: body.data || body,
  });

  return new Response("ok");
}