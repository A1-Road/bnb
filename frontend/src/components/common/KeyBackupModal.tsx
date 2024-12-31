interface KeyBackupModalProps {
  onClose: () => void;
  onComplete: () => void;
}

export const KeyBackupModal = ({
  onClose,
  onComplete,
}: KeyBackupModalProps) => {
  return (
    <div className="text-center space-y-4">
      <h2 className="text-xl font-semibold">Backup Your Keys</h2>
      <p className="text-gray-600">
        Please save your encryption keys in a secure location.
      </p>
      <div className="flex gap-2 justify-center">
        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Later
        </button>
        <button
          onClick={onComplete}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Done
        </button>
      </div>
    </div>
  );
};
