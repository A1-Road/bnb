import { useState } from "react";

export const useSendMessage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (message: string, file?: File) => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("message", message);

      if (file) {
        // ファイルサイズのチェック (例: 10MB)
        if (file.size > 10 * 1024 * 1024) {
          throw new Error("File size should be less than 10MB");
        }
        formData.append("file", file);
      }

      const response = await fetch("/api/messages", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to send message");
      }

      return await response.json();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "エラーが発生しました";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { sendMessage, isLoading, error };
};
