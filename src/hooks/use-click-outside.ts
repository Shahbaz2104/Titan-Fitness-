"use client";

import * as React from "react";

export function useClickOutside<T extends HTMLElement>(handler: () => void, enabled = true) {
  const ref = React.useRef<T>(null);

  React.useEffect(() => {
    if (!enabled) return;
    const listener = (event: MouseEvent | TouchEvent) => {
      const el = ref.current;
      if (!el || el.contains(event.target as Node)) return;
      handler();
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [handler, enabled]);

  return ref;
}
