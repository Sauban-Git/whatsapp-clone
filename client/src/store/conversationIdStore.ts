import { create } from "zustand";

interface ConversationIdStore {
    conversationId: string,
    setConversationId: (value: string) => void
}

export const useCoversationIdStore = create<ConversationIdStore>((set) => ({
    conversationId: "",
    setConversationId: (value) => set({conversationId: value})
}))