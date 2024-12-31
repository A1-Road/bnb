import { Button } from "../common/Button";
import { FileUpload } from "../common/FileUpload";

interface ProfileInfoFormProps {
  name: string;
  setName: (name: string) => void;
  avatar: File | null;
  setAvatar: (file: File | null) => void;
  onNext: () => void;
}

export const ProfileInfoForm = ({
  name,
  setName,
  avatar,
  setAvatar,
  onNext,
}: ProfileInfoFormProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-center">Set up your profile</h2>
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Enter your name"
        />
      </div>
      <div>
        <label
          htmlFor="file-upload"
          className="block text-sm font-medium text-gray-700"
        >
          Avatar
        </label>
        <FileUpload
          accept="image/*"
          onChange={setAvatar}
          currentFile={avatar}
          className="mt-1"
        />
      </div>
      <Button onClick={onNext} disabled={!name.trim()} className="w-full">
        Next
      </Button>
    </div>
  );
};
