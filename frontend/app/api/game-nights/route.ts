import type { NextRequest } from "next/server";

import {
  buildForwardHeaders,
  getBackendApiBaseUrl,
  relayBackendResponse,
} from "@/lib/server-api";

export async function GET(request: NextRequest) {
  const response = await fetch(
    `${getBackendApiBaseUrl()}/game-nights/${request.nextUrl.search}`,
    {
      headers: buildForwardHeaders(request),
      cache: "no-store",
    },
  );

  return relayBackendResponse(response);
}

export async function POST(request: NextRequest) {
  const response = await fetch(`${getBackendApiBaseUrl()}/game-nights/`, {
    method: "POST",
    headers: buildForwardHeaders(request, true),
    body: await request.text(),
    cache: "no-store",
  });

  return relayBackendResponse(response);
}
