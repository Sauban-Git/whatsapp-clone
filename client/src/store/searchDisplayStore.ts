import { create } from "zustand";

interface SearchDisplayState {
  searchDisplayState: boolean;
  setSearchDisplay: (value: boolean) => void;
  toggleSearchDisplay: () => void;
}

export const useSearchDisplayStore = create<SearchDisplayState>((set) => ({
  searchDisplayState: false,
  setSearchDisplay: (value: boolean) => set({ searchDisplayState: value }),
  toggleSearchDisplay: () =>
    set((state: SearchDisplayState) => ({
      searchDisplayState: !state.searchDisplayState,
    })),
}));
