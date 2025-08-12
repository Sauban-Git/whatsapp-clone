import { useEffect, useRef, useState } from "react";
import { useMessageDisplayStore } from "../store/messageDisplay";

export const Messages = () => {
  const messagesendRef = useRef<HTMLDivElement | null>(null);
  const setMessageDisplay = useMessageDisplayStore(
    (state) => state.setMessageDisplay
  );

  const [messages, setMessages] = useState([
    { id: 1, text: "Hey! How are you?", from: "them" },
    { id: 2, text: "I'm good, thanks! You?", from: "me" },
    { id: 3, text: "Doing great. Ready for the meeting?", from: "them" },
    { id: 4, text: "Doing great. Ready for the meeting?", from: "them" },
    { id: 5, text: "Doing great. Ready for the meeting?", from: "them" },
    { id: 6, text: "Doing great. Ready for the meeting?", from: "them" },
    { id: 7, text: "Doing great. Ready for the meeting?", from: "them" },
    { id: 8, text: "Doing great. Ready for the meeting?", from: "them" },
    { id: 9, text: "Doing great. Ready for the meeting?", from: "them" },
    { id: 10, text: "Doing great. Ready for the meeting?", from: "them" },
    { id: 12, text: "Yes, all set!", from: "me" },
    { id: 13, text: "Yes, all set!", from: "me" },
    { id: 14, text: "Yes, all set!", from: "me" },
    { id: 15, text: "Yes, all set!", from: "me" },
    { id: 16, text: "Yes, all set!", from: "me" },
    { id: 17, text: "Yes, all set!", from: "me" },
    { id: 18, text: "Yes, all set!", from: "me" },
  ]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (messagesendRef.current) {
      messagesendRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    setMessages([
      ...messages,
      { id: Date.now(), text: newMessage, from: "me" },
    ]);
    setNewMessage("");
  };

  return (
    <div className="flex flex-col sm:h-screen bg-[#121212] text-white">
      <div className="p-3 flex justify-between sticky top-0 bg-[#121212]">
        <div>
          <button className="" onClick={() => setMessageDisplay(false)}>
            <img className="w-8" src="/images/back.svg" alt="back" />
          </button>
        </div>
        <div>
          <button>
            <img className="w-8" src="/images/menu.svg" alt="menu" />
          </button>
        </div>
      </div>
      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.from === "me" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg text-sm shadow
                ${
                  msg.from === "me"
                    ? "bg-green-600 text-white rounded-br-none"
                    : "bg-gray-700 text-white rounded-bl-none"
                }`}
            >
              {msg.text}
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
