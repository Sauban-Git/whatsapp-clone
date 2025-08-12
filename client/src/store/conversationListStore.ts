import { create } from "zustand";
import type { ConversationFromApi } from "../types/types";

interface ConversationListState {
  conversationList: ConversationFromApi[];
  setConversationList: (
    value: ConversationFromApi[] | ((prev: ConversationFromApi[]) => ConversationFromApi[])
  ) => void;
}

export const useConversationListStore = create<ConversationListState>((set, get) => ({
  conversationList: [],
  setConversationList: (value) =>
    typeof value === "function"
      ? set({ conversationList: value(get().conversationList) })
      : set({ conversationList: value }),
}));
