import { create } from "zustand";

interface ConversationIdStore {
  conversationId: string;
  conversationName: string;
  setConversationId: (value: {
    conversationId: string;
    conversationName: string;
  }) => void;
}

export const useConversationIdStore = create<ConversationIdStore>((set) => ({
  conversationId: "",
  conversationName: "",
  setConversationId: (value) =>
    set({
      conversationId: value.conversationId,
      conversationName: value.conversationName,
    }),
}));
