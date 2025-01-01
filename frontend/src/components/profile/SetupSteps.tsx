interface SetupStepsProps {
  currentStep: number;
  totalSteps: number;
}

export const SetupSteps = ({ currentStep, totalSteps }: SetupStepsProps) => {
  return (
    <div className="flex justify-center space-x-2 mb-6">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div
          key={`step-${index + 1}`}
          className={`h-2 w-2 rounded-full ${
            index <= currentStep ? "bg-blue-500" : "bg-gray-300"
          }`}
        />
      ))}
    </div>
  );
};
