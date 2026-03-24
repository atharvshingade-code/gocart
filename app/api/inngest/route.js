export const dynamic = "force-dynamic";

import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import {
  syncUserCreation,
  syncUserUpdation,
  syncUserDeletion,
} from "@/inngest/functions";

// Inngest handlers (NO POST here)
export const { GET, PUT } = serve({
  client: inngest,
  functions: [
    syncUserCreation,
    syncUserUpdation,
    syncUserDeletion,
  ],
});

// 🔥 THIS is what you were missing
export async function POST(req) {
  const body = await req.json();

  console.log("FULL BODY:", body);

  const eventName = body.type || body.event || body.event_type;

  if (!eventName) {
    console.error("NO EVENT NAME FOUND", body);
    return new Response("No event name", { status: 400 });
  }

  await inngest.send({
    name: eventName,
    data: body.data,
  });

  return new Response("ok");
}