import { Button } from "../common/Button";
import { ProfilePhotoUpload } from "./ProfilePhotoUpload";

interface ProfileFormData {
  photo: string | null;
  name: string;
  username: string;
  phone: string;
  bio: string;
}

interface ProfileFormProps {
  profile: ProfileFormData;
  onProfileChange: (updates: Partial<ProfileFormData>) => void;
  onPhotoUpload: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ProfileForm = ({
  profile,
  onProfileChange,
  onPhotoUpload,
  onSubmit,
}: ProfileFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="flex justify-center">
        <ProfilePhotoUpload
          photo={profile.photo}
          onPhotoUpload={onPhotoUpload}
        />
      </div>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Name *"
          value={profile.name}
          onChange={(e) => onProfileChange({ name: e.target.value })}
          className="w-full p-3 rounded-lg border border-gray-300 focus:border-blue-500 outline-none"
          required
        />
        <input
          type="text"
          placeholder="Username *"
          value={profile.username}
          onChange={(e) => onProfileChange({ username: e.target.value })}
          className="w-full p-3 rounded-lg border border-gray-300 focus:border-blue-500 outline-none"
          required
        />
        <input
          type="tel"
          placeholder="Phone Number (optional)"
          value={profile.phone}
          onChange={(e) => onProfileChange({ phone: e.target.value })}
          className="w-full p-3 rounded-lg border border-gray-300 focus:border-blue-500 outline-none"
        />
        <textarea
          placeholder="Bio (optional)"
          value={profile.bio}
          onChange={(e) => onProfileChange({ bio: e.target.value })}
          className="w-full p-3 rounded-lg border border-gray-300 focus:border-blue-500 outline-none resize-none h-24"
        />
      </div>

      <Button type="submit" className="w-full">
        FINISH
      </Button>
    </form>
  );
};
