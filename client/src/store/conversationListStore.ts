import { create } from "zustand";

export interface Conversation {
  id: number;
  title: string;
  lastMessage: string;
}

interface ConversationListState {
  conversationList: Conversation[];
  setConversationList: (value: Conversation[]) => void;
}

export const useConversationListStore = create<ConversationListState>((set) => ({
  conversationList: [],
  setConversationList: (value) => set({ conversationList: value }),
}));
