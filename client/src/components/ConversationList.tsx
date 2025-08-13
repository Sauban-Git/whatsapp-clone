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
    const conversation = conversationList.find(
      (conv) => conv.id === conversationId
    );

    const conversationName = conversation?.isGroup
      ? conversation.name
      : conversation?.participants.find((p) => p.user.id !== userInfo.id)?.user
          .name;

    setConversationId({
      conversationId,
      conversationName: conversationName ?? "Unknown",
    });
    setMessageDisplay(true);
  };

  return (
    <div className="overflow-auto">

    <ul className="">
      {conversationList.map((conv) => (
        <li
          onClick={() => showMessage(conv.id)}
          key={conv.id}
          className=""
        >
          <div className="">
            <p className="">
              {conv.isGroup
                ? conv.name
                : conv.participants.find((p) => p.user.id !== userInfo.id)?.user
                    .name ?? "Unknown"}
            </p>
          </div>
          <p className="">
            {conv.Message.length > 0
              ? `${conv.Message[0].sender.name}: ${conv.Message[0].content}`
              : "No message yet"}
          </p>
        </li>
      ))}
    </ul>
    </div>
  );
};
