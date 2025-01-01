interface ConnectionStatusProps {
  isConnected: boolean;
}

export const ConnectionStatus = ({ isConnected }: ConnectionStatusProps) => {
  return (
    <div
      className={`fixed top-0 right-0 m-2 px-2 py-1 rounded-full text-xs ${
        isConnected ? "bg-green-500" : "bg-red-500"
      } text-white`}
    >
      {isConnected ? "Connected" : "Reconnecting..."}
    </div>
  );
};
