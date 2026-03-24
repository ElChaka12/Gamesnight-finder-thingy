import type { NextRequest } from "next/server";

import { getBackendApiBaseUrl, relayBackendResponse } from "@/lib/server-api";

export async function POST(request: NextRequest) {
  const response = await fetch(`${getBackendApiBaseUrl()}/auth/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: await request.text(),
    cache: "no-store",
  });

  return relayBackendResponse(response);
}
