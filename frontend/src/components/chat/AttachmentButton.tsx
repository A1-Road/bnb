import { FileUpload } from "../common/FileUpload";

interface AttachmentButtonProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export const AttachmentButton = ({
  onFileSelect,
  disabled,
}: AttachmentButtonProps) => {
  return (
    <FileUpload
      accept="image/*"
      onChange={(file) => file && onFileSelect(file)}
      currentFile={null}
      className="flex-shrink-0"
      disabled={disabled}
    />
  );
};
