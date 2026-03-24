import type { NextRequest } from "next/server";

import {
  buildForwardHeaders,
  getBackendApiBaseUrl,
  relayBackendResponse,
} from "@/lib/server-api";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const response = await fetch(`${getBackendApiBaseUrl()}/game-nights/${id}/join/`, {
    method: "POST",
    headers: buildForwardHeaders(request),
    cache: "no-store",
  });

  return relayBackendResponse(response);
}
