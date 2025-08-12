import { create } from "zustand";
import type { ConversationFromApi } from "../types/types";



interface ConversationListState {
  conversationList: ConversationFromApi[];
  setConversationList: (value: ConversationFromApi[]) => void;
}

export const useConversationListStore = create<ConversationListState>((set) => ({
  conversationList: [],
  setConversationList: (value) => set({ conversationList: value }),
}));
