interface OnlineStatusProps {
  isOnline: boolean;
  lastSeen?: string;
}

export const OnlineStatus = ({ isOnline, lastSeen }: OnlineStatusProps) => {
  const formatLastSeen = (timestamp?: string) => {
    if (!timestamp) return "Offline";
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div
      className={`flex items-center gap-1 text-xs ${
        isOnline ? "text-green-600" : "text-gray-500"
      }`}
    >
      <span
        className={`w-2 h-2 rounded-full ${
          isOnline ? "bg-green-500" : "bg-gray-400"
        }`}
      />
      {isOnline ? "Online" : `Last seen ${formatLastSeen(lastSeen)}`}
    </div>
  );
};
