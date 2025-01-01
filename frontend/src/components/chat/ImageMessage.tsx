import Image from "next/image";
import { useState } from "react";
import { formatTimestamp } from "../../utils/date";
import { LoadingSpinner } from "../common/LoadingSpinner";

interface ImageMessageProps {
  mediaUrl: string;
  timestamp: string;
  isOwn: boolean;
  isEncrypted: boolean;
  status?: string;
}

export const ImageMessage = ({
  mediaUrl,
  timestamp,
  isOwn,
  isEncrypted,
  status,
}: ImageMessageProps) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div
      className={`
        relative max-w-[70%] rounded-2xl overflow-hidden
        ${isOwn ? "bg-blue-500" : "bg-white"}
        shadow-[0_1px_2px_rgba(0,0,0,0.1)]
      `}
    >
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <LoadingSpinner />
          </div>
        )}
        <Image
          src={mediaUrl}
          alt="Image message"
          width={300}
          height={200}
          className="object-cover"
          onLoad={() => setIsLoading(false)}
        />
      </div>
      <div className="absolute bottom-2 right-2 flex items-center bg-black/50 px-2 py-1 rounded-full">
        <span className="text-[11px] text-white">
          {formatTimestamp(timestamp)}
        </span>
        {isEncrypted && <span className="ml-1 text-white">🔒</span>}
        {isOwn && (
          <span className="ml-1 text-white">
            {status === "read" ? "✓✓" : "✓"}
          </span>
        )}
      </div>
    </div>
  );
};
