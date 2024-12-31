interface MessageFormContainerProps {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
}

export const MessageFormContainer = ({
  children,
  onSubmit,
}: MessageFormContainerProps) => {
  return (
    <form className="flex items-end gap-2 p-2" onSubmit={onSubmit}>
      {children}
    </form>
  );
};
