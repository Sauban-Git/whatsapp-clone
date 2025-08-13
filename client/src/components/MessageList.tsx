import dayjs from "dayjs";
import { useMessageListStore } from "../store/messageListStore";
import { useUserInfoStore } from "../store/userInfoStore";

export const MessageList = () => {
  const userInfo = useUserInfoStore((state) => state.userInfo);
  const messageList = useMessageListStore((state) => state.messageList);

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "SENT":
        return "/images/sent.svg";
      case "DELIVERED":
        return "/images/delivered.svg";
      case "READ":
        return "/images/read.svg";
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 px-2 py-2 space-y-2 overflow-y-auto">
      {messageList.map((msg) => {
        const isSender = msg.sender.id === userInfo.id;

        const status = msg.statuses?.[0]?.status;
        const statusIcon = getStatusIcon(status);

        isSender ? console.log(msg.statuses) : console.log(msg.sender.id);
        return (
          <div
            key={msg.id}
            className={`flex ${isSender ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] px-4 py-2 text-sm rounded-xl shadow-md relative
            ${
              isSender
                ? "bg-[#144D37] text-white rounded-br-none"
                : "bg-gray-700 text-white rounded-bl-none"
            }`}
            >
              {msg.content}
              <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-gray-200 opacity-70">
                <span>{dayjs(msg.createdAt).format("h:mm A")}</span>
                {isSender && statusIcon && (
                  <img src={statusIcon} alt={status} className="w-6" />
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
