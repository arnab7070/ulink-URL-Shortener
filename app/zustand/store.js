'use client'
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUrlStore = create(
  persist(
    (set, get) => ({
      urlList: [],
      push: (newurl) => set({ urlList: [newurl, ...get().urlList] }),
    }),
    {
      name: "urlList", // name of the item in the storage (must be unique)
      skipHydration: true,
    }
  )
);
