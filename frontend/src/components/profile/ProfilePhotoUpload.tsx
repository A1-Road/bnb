import Image from "next/image";

interface ProfilePhotoUploadProps {
  photo: string | null;
  onPhotoUpload: () => void;
}

export const ProfilePhotoUpload = ({
  photo,
  onPhotoUpload,
}: ProfilePhotoUploadProps) => {
  return (
    <button type="button" onClick={onPhotoUpload} className="relative group">
      {photo ? (
        <Image
          src={photo}
          alt="Profile"
          width={100}
          height={100}
          className="rounded-full"
        />
      ) : (
        <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
          <span className="text-3xl text-gray-400">+</span>
        </div>
      )}
      <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
        <span className="text-white text-sm">Change</span>
      </div>
    </button>
  );
};
