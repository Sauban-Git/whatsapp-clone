import { useEffect, useRef, useState } from "react";
import { useMessageDisplayStore } from "../store/messageDisplayStore";
import { useMessageListStore } from "../store/messageListStore";
import type { MessageFromApi } from "../types/types";
import { useConversationIdStore } from "../store/conversationIdStore";
import { useUserInfoStore } from "../store/userInfoStore";
import axios from "../lib/axios";

export const Messages = () => {
  const conversationId = useConversationIdStore(
    (state) => state.conversationId
  );

  const conversationName = useConversationIdStore((state) => state.conversationName)

  const userInfo = useUserInfoStore((state) => state.userInfo);

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
    <div className="flex flex-col sm:h-screen bg-[#121212] text-white">
      <div className="p-3 flex justify-between sticky top-0 bg-[#121212]">
        <div className="flex justify-start gap-4">
          <div>
            <button className="" onClick={() => setMessageDisplay(false)}>
              <img className="w-8" src="/images/back.svg" alt="back" />
            </button>
          </div>
          <div className="mt-1">{conversationName}</div>
        </div>
        <div>
          <button>
            <img className="w-8" src="/images/menu.svg" alt="menu" />
          </button>
        </div>
      </div>
      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messageList.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender.id === userInfo.id ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg text-sm shadow
                ${
                  msg.sender.id === userInfo.id
                    ? "bg-green-600 text-white rounded-br-none"
                    : "bg-gray-700 text-white rounded-bl-none"
                }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={messagesendRef} />
      </div>
      {/* Input Box */}
      <div className="p-2 sticky bottom-0 bg-[#1e1e1e] flex items-center space-x-2 rounded-4xl border-t border-gray-700 my-3">
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
          className="flex-1 px-4 py-2 rounded-full text-white placeholder-gray-400 focus:outline-none"
        />
        <button
          onClick={sendMessage}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full"
        >
          Send
        </button>
      </div>
    </div>
  );
};
