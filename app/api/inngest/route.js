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

  console.log("CLERK EVENT RECEIVED:", body.type);

  await inngest.send({
    name: body.type,   // user.created
    data: body.data,
  });

  return new Response("ok");
}