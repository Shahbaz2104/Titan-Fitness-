"use client";

import { create } from "zustand";

interface UIState {
  sidebarOpen: boolean;
  mobileNavOpen: boolean;
  searchOpen: boolean;
  notificationsOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  setMobileNavOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  setNotificationsOpen: (open: boolean) => void;
  closeAll: () => void;
}

export const useUIStore = create<UIState>()((set) => ({
  sidebarOpen: false,
  mobileNavOpen: false,
  searchOpen: false,
  notificationsOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setMobileNavOpen: (open) => set({ mobileNavOpen: open }),
  setSearchOpen: (open) => set({ searchOpen: open }),
  setNotificationsOpen: (open) => set({ notificationsOpen: open }),
  closeAll: () =>
    set({
      sidebarOpen: false,
      mobileNavOpen: false,
      searchOpen: false,
      notificationsOpen: false,
    }),
}));
