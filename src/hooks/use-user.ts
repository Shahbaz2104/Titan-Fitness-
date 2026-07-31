"use client";

import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/constants";

export function useUser() {
  return useQuery({
    queryKey: QUERY_KEYS.user,
    queryFn: async () => {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      if (!res.ok) return null;
      return res.json();
    },
    staleTime: 5 * 60_000,
  });
}
