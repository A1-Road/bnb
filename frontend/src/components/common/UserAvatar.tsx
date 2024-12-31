import Image from "next/image";

interface UserAvatarProps {
  name: string;
  avatarUrl?: string;
  size?: number;
  isOnline?: boolean;
}

export const UserAvatar = ({
  name,
  avatarUrl,
  size = 48,
  isOnline,
}: UserAvatarProps) => {
  return (
    <div className="relative">
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt={name}
          width={size}
          height={size}
          className="rounded-full"
        />
      ) : (
        <div
          className={`rounded-full bg-gray-200 flex items-center justify-center`}
          style={{ width: size, height: size }}
        >
          <span className="text-lg text-gray-500">{name.charAt(0)}</span>
        </div>
      )}
      {typeof isOnline !== "undefined" && (
        <div
          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
            isOnline ? "bg-green-500" : "bg-gray-300"
          }`}
        />
      )}
    </div>
  );
};
