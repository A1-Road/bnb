import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../common/Button";
import { FileUpload } from "../common/FileUpload";
import type { ProfileFormData } from "@/schemas/profile";
import { profileSchema } from "@/schemas/profile";

interface ProfileInfoFormProps {
  initialData: ProfileFormData;
  onSubmit: (data: ProfileFormData) => void;
  onPhotoUpload: () => void;
}

export const ProfileInfoForm = ({
  initialData,
  onSubmit,
  onPhotoUpload,
}: ProfileInfoFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: initialData,
    mode: "onChange",
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h2 className="text-xl font-semibold text-center">Set up your profile</h2>

      <div>
        <FileUpload
          accept="image/*"
          onChange={() => onPhotoUpload()}
          className="flex justify-center"
        />
      </div>

      <div className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Name *"
            {...register("name")}
            className="w-full p-3 rounded-lg border border-gray-300 focus:border-blue-500 outline-none"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div>
          <input
            type="text"
            placeholder="Username *"
            {...register("username")}
            className="w-full p-3 rounded-lg border border-gray-300 focus:border-blue-500 outline-none"
          />
          {errors.username && (
            <p className="mt-1 text-sm text-red-500">
              {errors.username.message}
            </p>
          )}
        </div>

        <div>
          <input
            type="tel"
            placeholder="Phone Number (optional)"
            {...register("phone")}
            className="w-full p-3 rounded-lg border border-gray-300 focus:border-blue-500 outline-none"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <textarea
            placeholder="Bio (optional)"
            {...register("bio")}
            className="w-full p-3 rounded-lg border border-gray-300 focus:border-blue-500 outline-none resize-none h-24"
          />
          {errors.bio && (
            <p className="mt-1 text-sm text-red-500">{errors.bio.message}</p>
          )}
        </div>
      </div>

      <Button type="submit" disabled={!isValid} className="w-full">
        Next
      </Button>
    </form>
  );
};
