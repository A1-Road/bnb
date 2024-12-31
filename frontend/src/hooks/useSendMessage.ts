import { useState } from "react";
import { encryptMessage, encryptFile } from "@/utils/encryption";
import type { KeyPair } from "@/utils/encryption";

interface SendMessageOptions {
  encrypt?: boolean;
  keyPair?: KeyPair;
  recipientPublicKey?: string;
}

export const useSendMessage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (
    message: string,
    file?: File,
    options?: SendMessageOptions
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();

      // メッセージの暗号化
      if (options?.encrypt && options.keyPair && options.recipientPublicKey) {
        // テキストの暗号化
        const encryptedContent = encryptMessage(
          message,
          options.keyPair.privateKey,
          options.recipientPublicKey
        );
        formData.append("message", encryptedContent);
        formData.append("encrypted", "true");
        formData.append("publicKey", options.keyPair.publicKey);

        // ファイルの暗号化
        if (file) {
          if (file.size > 10 * 1024 * 1024) {
            throw new Error("File size should be less than 10MB");
          }
          const encryptedFile = await encryptFile(
            file,
            options.keyPair.privateKey,
            options.recipientPublicKey
          );
          formData.append("encryptedData", encryptedFile.encryptedData);
          formData.append("mimeType", encryptedFile.mimeType);
        }
      } else {
        formData.append("message", message);
        if (file) formData.append("file", file);
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
