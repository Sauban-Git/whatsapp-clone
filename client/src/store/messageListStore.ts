import { create } from "zustand";
import type { MessageFromApi } from "../types/types";

interface MessageListState {
  messageList: MessageFromApi[];
  setMessageList: (value: MessageFromApi[]) => void;
}

export const useMessageListStore = create<MessageListState>((set) => ({
  messageList: [],
  setMessageList: (value) => set({ messageList: value }),
}));
