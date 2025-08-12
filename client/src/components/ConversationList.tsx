import { useEffect } from "react";
import {
  useConversationListStore,
  type Conversation,
} from "../store/conversationListStore";
import { useMessageDisplayStore } from "../store/messageDisplayStore";
import axios from "../lib/axios"

export const ConversationList = () => {
  const setMessageDisplay = useMessageDisplayStore(
    (state) => state.setMessageDisplay
  );
  const setConversationList = useConversationListStore(
    (state) => state.setConversationList
  );

  function getConversationList() {
    axios.get("/conversations/")
  }

  useEffect(() => {
    getConversationList();
  })

  const conversations: Conversation[] = [];

  setConversationList(conversations);

  const showMessage = () => {
    setMessageDisplay(true);
  };

  return (
    <ul className="overflow-y-auto h-full text-white p-2 space-y-2">
      {conversations.map((conv) => (
        <li
          onClick={showMessage}
          key={conv.id}
          className="p-3 rounded-xl hover:bg-[#333] transition-colors cursor-pointer"
        >
          <p className="font-semibold text-white truncate">{conv.title}</p>
          <p className="text-sm text-gray-400 truncate">{conv.lastMessage}</p>
        </li>
      ))}
    </ul>
  );
};
