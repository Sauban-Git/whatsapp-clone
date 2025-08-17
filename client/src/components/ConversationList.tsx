import { useEffect } from "react";

import { useConversationListStore } from "../store/conversationListStore";
import { useMessageDisplayStore } from "../store/messageDisplayStore";
import axios from "../lib/axios";
import type { ConversationFromApi } from "../types/types";
import { useConversationIdStore } from "../store/conversationIdStore";
import { useUserInfoStore } from "../store/userInfoStore";

export const ConversationList = () => {
  const setMessageDisplay = useMessageDisplayStore(
    (state) => state.setMessageDisplay
  );

  const setConversationId = useConversationIdStore(
    (state) => state.setConversationId
  );

  const conversationList = useConversationListStore(
    (state) => state.conversationList
  );

  const setConversationList = useConversationListStore(
    (state) => state.setConversationList
  );

  const userInfo = useUserInfoStore((state) => state.userInfo);

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
    setMessageDisplay(false);
    setConversationId(conversationId);
    setMessageDisplay(true);
  };

  return (
    <div className="overflow-y-auto flex-1 bg-gray-900 text-white px-2 py-4">
      <ul className="space-y-2">
        {conversationList.map((conv) => (
          <li
            onClick={() => showMessage(conv.id)}
            key={conv.id}
            className="cursor-pointer hover:bg-gray-800 active:bg-gray-700 transition-colors duration-150 rounded-xl p-4"
          >
            <div className="">
              <p className="text-white font-semibold text-base truncate">
                {conv.isGroup
                  ? conv.name
                  : conv.participants.find((p) => p.user.id !== userInfo.id)
                      ?.user.name ?? conv.participants[0]?.user.phoneNumber}
              </p>
              <p className="text-sm text-gray-400 truncate mt-1">
                {Array.isArray(conv?.Message) && conv.Message.length > 0
                  ? `${
                      conv.Message[0]?.sender?.name ??
                      conv.participants[0]?.user.phoneNumber
                    }: ${conv.Message[0]?.content ?? ""}`
                  : "No message yet"}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
