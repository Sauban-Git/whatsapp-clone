import { useEffect, useRef, useState } from "react";
import { useMessageDisplayStore } from "../store/messageDisplayStore";
import { useMessageListStore } from "../store/messageListStore";
import type { MessageFromApi } from "../types/types";
import { useConversationIdStore } from "../store/conversationIdStore";
import axios from "../lib/axios";
import { MessageList } from "./MessageList";

export const Messages = () => {
  const conversationId = useConversationIdStore(
    (state) => state.conversationId
  );

  const conversationName = useConversationIdStore(
    (state) => state.conversationName
  );

  const messagesendRef = useRef<HTMLDivElement | null>(null);
  const setMessageDisplay = useMessageDisplayStore(
    (state) => state.setMessageDisplay
  );
  const setMessagesList = useMessageListStore((state) => state.setMessageList);
  const messageList = useMessageListStore((state) => state.messageList);

  const [newMessage, setNewMessage] = useState("");

  const getMessagesList = async () => {
    try {
      if (!conversationId) return;
      setMessagesList([]);
      const { data } = await axios.get<{ messages: MessageFromApi[] }>(
        `/messages/conversation/${conversationId}`
      );
      setMessagesList(data.messages);
    } catch (error) {
      console.error("Error while fetching messages: ", error);
    }
  };

  useEffect(() => {
    getMessagesList();
  }, [conversationId]);

  useEffect(() => {
    if (messagesendRef.current) {
      messagesendRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messageList]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      axios.post(`/messages/conversation/${conversationId}`, {
        content: newMessage,
      });
      setNewMessage("");
    } catch (error) {
      console.error("Error sending messages: ", error);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-gray-900 flex flex-col">
      <div className="sticky top-0 z-10 bg-gray-900 border-b border-gray-700 p-2 flex items-center gap-4">
        <button onClick={() => setMessageDisplay(false)}>
          <img className="w-8" src="/images/back.svg" alt="back" />
        </button>
        <div className="text-white">{conversationName}</div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-2">
        <MessageList />
        <div ref={messagesendRef} />
      </div>

      <div className="flex items-center justify-between gap-2 p-3 rounded-full border border-gray-700 bg-gray-800 sticky bottom-0">
        <input
          type="text"
          value={newMessage}
          onFocus={() => {
            setTimeout(() => {
              messagesendRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 100);
          }}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message"
          className="flex-1 px-4 py-2 rounded-full bg-gray-700 text-white placeholder-gray-400 outline-none"
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 rounded-full bg-[#25D366] text-white font-semibold hover:bg-[#1ebc5a] transition-colors duration-200"
        >
          Send
        </button>
      </div>
    </div>
  );
};
