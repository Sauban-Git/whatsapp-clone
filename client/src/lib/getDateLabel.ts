
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";

dayjs.extend(isToday);
dayjs.extend(isYesterday);

export const getDateLabel = (dateStr: string) => {
  const date = dayjs(dateStr);

  if (date.isToday()) return "Today";
  if (date.isYesterday()) return "Yesterday";

  return date.format("D MMMM YYYY");
};