interface TypingIndicatorProps {
  isTyping: boolean;
  name: string;
}

export const TypingIndicator = ({ isTyping, name }: TypingIndicatorProps) => {
  if (!isTyping) return null;

  return (
    <div className="text-xs text-gray-500 animate-pulse">
      {name} is typing...
      <span className="inline-flex gap-0.5">
        <span className="animate-bounce">.</span>
        <span className="animate-bounce delay-100">.</span>
        <span className="animate-bounce delay-200">.</span>
      </span>
    </div>
  );
};
