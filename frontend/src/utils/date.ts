import { format, isToday, isYesterday } from "date-fns";
import { ja } from "date-fns/locale";

export const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  return format(date, "HH:mm", { locale: ja });
};

export const formatMessageDate = (timestamp: string) => {
  const date = new Date(timestamp);
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "yyyy/MM/dd", { locale: ja });
};
