interface FilePreviewBadgeProps {
  fileName: string;
  onRemove: () => void;
}

export const FilePreviewBadge = ({
  fileName,
  onRemove,
}: FilePreviewBadgeProps) => {
  return (
    <div className="inline-flex items-center mb-3 px-4">
      <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-lg">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
          />
        </svg>
        <span className="text-sm text-gray-600 truncate max-w-[200px]">
          {fileName}
        </span>
        <button
          onClick={onRemove}
          className="text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      </div>
    </div>
  );
};
