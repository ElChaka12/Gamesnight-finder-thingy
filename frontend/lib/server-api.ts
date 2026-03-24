import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function getBackendApiBaseUrl() {
  const baseUrl = process.env.API_BASE_URL ?? "http://127.0.0.1:8000/api";
  return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
}

export function buildForwardHeaders(request: NextRequest, includeJson = false) {
  const headers = new Headers();
  const authorization = request.headers.get("authorization");

  if (authorization) {
    headers.set("Authorization", authorization);
  }

  if (includeJson) {
    headers.set("Content-Type", "application/json");
  }

  return headers;
}

export async function relayBackendResponse(response: Response) {
  const body = await response.text();
  const contentType = response.headers.get("content-type") ?? "application/json";

  return new NextResponse(body, {
    status: response.status,
    headers: {
      "Content-Type": contentType,
    },
  });
}
