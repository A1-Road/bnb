"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface FileUploadProps {
  accept: string;
  onChange: (file: File | null) => void;
  className?: string;
  disabled?: boolean;
}

export const FileUpload = ({
  accept,
  onChange,
  className = "",
  disabled,
}: FileUploadProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onChange(acceptedFiles[0] || null);
    },
    [onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { [accept]: [] },
    disabled,
    multiple: false,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  return (
    <div className={className}>
      <div
        {...getRootProps()}
        className={`inline-flex items-center gap-2 text-gray-600 ${
          disabled
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer hover:text-gray-900"
        }`}
      >
        <input {...getInputProps()} />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-7 h-7"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13"
          />
        </svg>
        {isDragActive && <span className="text-sm">Drop the file here...</span>}
      </div>
    </div>
  );
};
