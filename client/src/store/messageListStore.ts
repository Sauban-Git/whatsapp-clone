import { create } from "zustand";

export interface MessageList {
    id: string;
  text: string;
  from: string;
}

interface MessageListState {
  messageList: MessageList[];
  setMessageList: (value: MessageList[]) => void;
}

export const useMessageListStore = create<MessageListState>((set) => ({
  messageList: [],
  setMessageList: (value) => set({ messageList: value }),
}));
