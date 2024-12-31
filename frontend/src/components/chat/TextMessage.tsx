import { formatTimestamp } from "../../utils/date";

interface TextMessageProps {
  content: string;
  timestamp: string;
  isOwn: boolean;
  isEncrypted: boolean;
  status?: string;
}

export const TextMessage = ({
  content,
  timestamp,
  isOwn,
  isEncrypted,
  status,
}: TextMessageProps) => {
  return (
    <div
      className={`
        relative px-3 py-2 max-w-[70%] break-words
        ${
          isOwn
            ? "bg-blue-500 text-white rounded-2xl rounded-br-sm"
            : "bg-white text-gray-900 rounded-2xl rounded-bl-sm"
        }
        shadow-[0_1px_2px_rgba(0,0,0,0.1)]
      `}
    >
      <div className="text-[15px] leading-[22px]">{content}</div>
      <div className="text-[11px] mt-0.5 flex items-center justify-end">
        <span className={isOwn ? "text-blue-100" : "text-gray-400"}>
          {formatTimestamp(timestamp)}
        </span>
        {isEncrypted && <span className="ml-1">🔒</span>}
        {isOwn && (
          <span className="ml-1">{status === "read" ? "✓✓" : "✓"}</span>
        )}
      </div>
    </div>
  );
};
