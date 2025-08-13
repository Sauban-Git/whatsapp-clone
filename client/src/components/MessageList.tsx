import { useMessageListStore } from "../store/messageListStore";
import { useUserInfoStore } from "../store/userInfoStore";

export const MessageList = () => {

  const userInfo = useUserInfoStore((state) => state.userInfo);
  const messageList = useMessageListStore((state) => state.messageList);

  return (
    <div className="">
      <div className="flex-1 e p-4 space-y-2">
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
      </div>
    </div>
  );
};
