import { Button } from "../common/Button";
import { FileUpload } from "../common/FileUpload";
import type { ProfileData } from "@/hooks/useProfileSetup";

interface ProfileInfoFormProps {
  profile: ProfileData;
  onProfileChange: (updates: Partial<ProfileData>) => void;
  onPhotoUpload: () => void;
  onSubmit: () => void;
}

export const ProfileInfoForm = ({
  profile,
  onProfileChange,
  onPhotoUpload,
  onSubmit,
}: ProfileInfoFormProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-center">Set up your profile</h2>
      <div>
        <FileUpload
          accept="image/*"
          onChange={() => onPhotoUpload()}
          currentFile={profile.photo ? new File([], profile.photo) : null}
          className="flex justify-center"
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
        <textarea
          placeholder="Bio (optional)"
          value={profile.bio}
          onChange={(e) => onProfileChange({ bio: e.target.value })}
          className="w-full p-3 rounded-lg border border-gray-300 focus:border-blue-500 outline-none resize-none h-24"
        />
      </div>
      <Button onClick={onSubmit} disabled={!profile.name || !profile.username}>
        Next
      </Button>
    </div>
  );
};
