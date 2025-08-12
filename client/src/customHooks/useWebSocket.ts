import { useEffect, useRef } from "react";
import { useConversationListStore } from "../store/conversationListStore";
import { useMessageListStore } from "../store/messageListStore";
import { useCoversationIdStore } from "../store/conversationIdStore";
import { useUserInfoStore } from "../store/userInfoStore";
import axios from "../lib/axios";
import type { ConversationFromApi } from "../types/types";

export const useWebSocket = () => {
  const wsRef = useRef<WebSocket | null>(null);

  const conversationId = useCoversationIdStore((state) => state.conversationId);
  const setConversationList = useConversationListStore(
    (state) => state.setConversationList
  );
  const setMessageList = useMessageListStore((state) => state.setMessageList);
  const userId = useUserInfoStore((state) => state.userInfo?.id);

  useEffect(() => {
    if (!userId) return;

    const ws = new WebSocket(`${import.meta.env.VITE_WS_URL}`);

    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected");

      // Subscribe to user’s conversation list
      ws.send(
        JSON.stringify({
          type: "subscribe",
          list: "conversation_list",
        })
      );

      // Subscribe to currently open conversation
      if (conversationId) {
        ws.send(
          JSON.stringify({
            type: "subscribe",
            conversationId,
          })
        );
      }
    };

    ws.onmessage = async (event) => {
      const message = JSON.parse(event.data);

      if (message.type === "new_conversation_activity") {
        console.log("Conversation list update");
        const { data } = await axios.get<{
          conversations: ConversationFromApi[];
        }>("/conversations");
        setConversationList(data.conversations);
      }

      if (message.type === "new_message") {
        const newMessage = message.data;

        // Always update conversation list with the latest message
        setConversationList((prevList) =>
          prevList.map((conv) =>
            conv.id === newMessage.conversationId
              ? {
                  ...conv,
                  Message: [newMessage], 
                }
              : conv
          )
        );

        // Additionally update message list if this is the currently viewed conversation
        if (newMessage.conversationId === conversationId) {
          setMessageList((prev) => [...prev, newMessage]);
        }
      }
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      ws.close();
    };
  }, [conversationId, userId]);
};
