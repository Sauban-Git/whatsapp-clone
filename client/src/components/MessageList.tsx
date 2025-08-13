import dayjs from "dayjs";
import { useMessageListStore } from "../store/messageListStore";
import { useUserInfoStore } from "../store/userInfoStore";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
import { getDateLabel } from "../lib/getDateLabel";

dayjs.extend(isToday);
dayjs.extend(isYesterday);

export const MessageList = () => {
  const userInfo = useUserInfoStore((state) => state.userInfo);
  const messageList = useMessageListStore((state) => state.messageList);

  let lastDateLabel: string | null = null;

  return (
    <div className="flex-1 px-2 py-2 space-y-2 overflow-y-auto">
      {messageList.map((msg) => {
        const isSender = msg.sender.id === userInfo.id;
        const currentDateLabel = getDateLabel(msg.createdAt);

        const showDateSeparator = currentDateLabel !== lastDateLabel;
        if (showDateSeparator) lastDateLabel = currentDateLabel;

        return (
          <div key={msg.id}>
            {/* Date separator */}
            {showDateSeparator && (
              <div className="text-xs text-gray-300 text-center my-4">
                <span className="bg-gray-800 px-3 py-1 rounded-full shadow-sm">
                  {currentDateLabel}
                </span>
              </div>
            )}

            {/* Message bubble */}
            <div
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
                <div className="text-[10px] text-gray-200 opacity-70 mt-1 text-right">
                  {dayjs(msg.createdAt).format("h:mm A")}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
