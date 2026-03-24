import type { NextRequest } from "next/server";

import {
  buildForwardHeaders,
  getBackendApiBaseUrl,
  relayBackendResponse,
} from "@/lib/server-api";

export async function GET(request: NextRequest) {
  const response = await fetch(`${getBackendApiBaseUrl()}/auth/me/`, {
    headers: buildForwardHeaders(request),
    cache: "no-store",
  });

  return relayBackendResponse(response);
}
