import { create } from "zustand";

interface ConversationIdStore {
  conversationId: string;
  conversationName: string;
  conversationPhone: string;
  setConversationId: (value: {
    conversationId: string;
    conversationName: string;
    conversationPhone: string;
  }) => void;
}

export const useConversationIdStore = create<ConversationIdStore>((set) => ({
  conversationId: "",
  conversationName: "",
  conversationPhone: "",
  setConversationId: (value) =>
    set({
      conversationId: value.conversationId,
      conversationName: value.conversationName,
      conversationPhone: value.conversationPhone,
    }),
}));
