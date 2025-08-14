// src/hooks/useWebSocket.ts
import { useEffect, useRef } from "react";
import { useConversationListStore } from "../store/conversationListStore";
import { useMessageListStore } from "../store/messageListStore";
import { useConversationIdStore } from "../store/conversationIdStore";
import { useUserInfoStore } from "../store/userInfoStore";
import type { ConversationFromApi, MessageFromApi } from "../types/types";

export const useWebSocket = () => {
  const wsRef = useRef<WebSocket | null>(null);

  const conversationId = useConversationIdStore((state) => state.conversationId);
  const setConversationList = useConversationListStore((state) => state.setConversationList);
  const setMessageList = useMessageListStore((state) => state.setMessageList);
  const userId = useUserInfoStore((state) => state.userInfo?.id);

  useEffect(() => {
    if (!userId) return;

    const ws = new WebSocket(`${import.meta.env.VITE_WS_URL}`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected");

      // Subscribe to conversation list updates
      ws.send(
        JSON.stringify({
          type: "subscribe",
          list: "conversation_list",
        })
      );

      // Subscribe to current conversation if open
      if (conversationId) {
        ws.send(
          JSON.stringify({
            type: "subscribe",
            conversationId,
          })
        );
      }
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === "new_conversation_activity") {
        console.log("Updating conversation list (WebSocket)");
        const updatedConv: ConversationFromApi = message.data;

        console.log("Updated convresponse: ",JSON.stringify(updatedConv, null, 2));

        // Update list quickly without refetch
        setConversationList((prev) => {
          const existingIndex = prev.findIndex((c) => c.id === updatedConv.id);
          if (existingIndex !== -1) {
            const updatedList = [...prev];
            updatedList[existingIndex] = { ...updatedList[existingIndex], ...updatedConv };
            return updatedList;
          }
          return [updatedConv, ...prev];
        });
      }

      if (message.type === "new_message") {
        const newMessage: MessageFromApi & { conversationId: string } = message.data;

        // Always update conversation list with the latest message
        setConversationList((prev) =>
          prev.map((conv) =>
            conv.id === newMessage.conversationId
              ? { ...conv, Message: [newMessage] }
              : conv
          )
        );

        // Additionally update message list if viewing this conversation
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
  }, [conversationId, userId, setConversationList, setMessageList]);
};
