import { create } from "zustand";

interface MessageDisplayState {
  messageDisplay: boolean;
  setMessageDisplay: (value: boolean) => void;
  toggleMessageDisplay: () => void;
}

export const useMessageDisplayStore = create<MessageDisplayState>((set) => ({
  messageDisplay: false,
  setMessageDisplay: (value: boolean) => set({ messageDisplay: value }),
  toggleMessageDisplay: () =>
    set((state: MessageDisplayState) => ({
      messageDisplay: !state.messageDisplay,
    })),
}));
