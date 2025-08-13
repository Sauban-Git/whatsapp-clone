import { useMessageListStore } from "../store/messageListStore";
import { useUserInfoStore } from "../store/userInfoStore";

export const MessageList = () => {
  const userInfo = useUserInfoStore((state) => state.userInfo);
  const messageList = useMessageListStore((state) => state.messageList);

  return (
    <div className="flex-1 px-2 py-2 space-y-2 overflow-y-auto">
      {messageList.map((msg) => {
        const isSender = msg.sender.id === userInfo.id;
        return (
          <div
            key={msg.id}
            className={`flex ${isSender ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] px-4 py-2 text-sm rounded-xl shadow-md
            ${
              isSender
                ? "bg-[#25D366] text-white rounded-br-none"
                : "bg-gray-700 text-white rounded-bl-none"
            }`}
            >
              {msg.content}
            </div>
          </div>
        );
      })}
    </div>
  );
};
