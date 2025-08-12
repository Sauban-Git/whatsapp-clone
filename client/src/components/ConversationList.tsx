import { useEffect } from "react";

import { useConversationListStore } from "../store/conversationListStore";
import { useMessageDisplayStore } from "../store/messageDisplayStore";
import axios from "../lib/axios";
import type { ConversationFromApi } from "../types/types";
import { useCoversationIdStore } from "../store/conversationIdStore";

export const ConversationList = () => {
  const setMessageDisplay = useMessageDisplayStore(
    (state) => state.setMessageDisplay
  );

  const setConversationId = useCoversationIdStore((state) => state.setConversationId)

  const conversationList = useConversationListStore(
    (state) => state.conversationList
  );

  const setConversationList = useConversationListStore(
    (state) => state.setConversationList
  );

  const getConversationList = async () => {
    try {
      const { data } = await axios.get<{
        conversations: ConversationFromApi[];
      }>("/conversations/");

      setConversationList(data.conversations);
    } catch (error) {
      console.error("Error fetching conversations: ", error);
    }
  };

  useEffect(() => {
    getConversationList();
  }, []);

  const showMessage = (conversationId: string) => {
    console.log("ConversationId: ", conversationId)
    console.log("Messages Rendered!")
    setConversationId(conversationId)
    setMessageDisplay(true);
  };

  return (
    <ul className="overflow-y-auto h-full text-white p-2 space-y-2">
      {conversationList.map((conv) => (
        <li
          onClick={() => showMessage(conv.id)}
          key={conv.id}
          className="p-3 rounded-xl hover:bg-[#333] transition-colors cursor-pointer"
        >
          <p className="font-semibold text-white truncate">
            {conv.name ?? "Unknown"}
          </p>
          <p className="text-sm text-gray-400 truncate">
            {conv.Message[0]?.content ?? "No message yet"}
          </p>
        </li>
      ))}
    </ul>
  );
};
