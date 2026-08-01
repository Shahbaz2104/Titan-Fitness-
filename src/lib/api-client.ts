"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";

export class ApiClientError extends Error {
  status: number;
  code: string;

  constructor(message: string, status: number, code: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

async function unwrap<T>(res: Response): Promise<T> {
  const body = await res.json().catch(() => null);
  if (!res.ok || !body?.success) {
    const message = body?.error?.message ?? body?.message ?? "Something went wrong";
    const code = body?.error?.code ?? "ERROR";
    throw new ApiClientError(message, res.status, code);
  }
  return body.data as T;
}

function queryString(params?: Record<string, string | number | boolean | undefined>) {
  if (!params) return "";
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      search.set(key, String(value));
    }
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export async function apiGet<T>(
  path: string,
  params?: Record<string, string | number | boolean | undefined>
): Promise<T> {
  const res = await fetch(`${path}${queryString(params)}`, { cache: "no-store" });
  return unwrap<T>(res);
}

export async function apiPost<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  return unwrap<T>(res);
}

export async function apiPatch<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(path, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  return unwrap<T>(res);
}

export async function apiDelete<T>(path: string): Promise<T> {
  const res = await fetch(path, { method: "DELETE" });
  return unwrap<T>(res);
}

export function useApiQuery<T>(
  queryKey: readonly unknown[],
  path: string,
  params?: Record<string, string | number | boolean | undefined>
) {
  return useQuery({
    queryKey,
    queryFn: () => apiGet<T>(path, params),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}

export function useApiMutation<T = unknown>(
  path: string,
  method: "POST" | "PATCH" | "DELETE" = "POST"
) {
  return React.useCallback(
    async (body?: unknown): Promise<T> => {
      if (method === "DELETE") return apiDelete<T>(path);
      if (method === "PATCH") return apiPatch<T>(path, body);
      return apiPost<T>(path, body);
    },
    [path, method]
  );
}
