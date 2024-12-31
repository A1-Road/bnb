interface ConnectionStatusProps {
  isConnected: boolean;
}

export const ConnectionStatus = ({
  isConnected,
}: Readonly<ConnectionStatusProps>) => {
  return (
    <div
      className={`fixed top-2 right-2 w-3 h-3 rounded-full ${
        isConnected ? "bg-green-500" : "bg-red-500"
      }`}
      title={isConnected ? "Connecting…" : "Offline"}
    />
  );
};
