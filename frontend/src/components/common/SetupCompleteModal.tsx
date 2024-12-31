interface SetupCompleteModalProps {
  onClose: () => void;
}

export const SetupCompleteModal = ({ onClose }: SetupCompleteModalProps) => {
  return (
    <div className="text-center space-y-4">
      <h2 className="text-xl font-semibold">Setup Complete!</h2>
      <p className="text-gray-600">
        Your profile has been set up successfully.
      </p>
      <button
        onClick={onClose}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Get Started
      </button>
    </div>
  );
};
