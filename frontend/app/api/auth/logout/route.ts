import type { NextRequest } from "next/server";

import {
  buildForwardHeaders,
  getBackendApiBaseUrl,
  relayBackendResponse,
} from "@/lib/server-api";

export async function POST(request: NextRequest) {
  const response = await fetch(`${getBackendApiBaseUrl()}/auth/logout/`, {
    method: "POST",
    headers: buildForwardHeaders(request),
    cache: "no-store",
  });

  return relayBackendResponse(response);
}
