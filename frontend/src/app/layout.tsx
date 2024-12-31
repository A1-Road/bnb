"use client";

import "./globals.css";
import { Navigation } from "@/components/layout/Navigation";
import { useEncryption } from "@/hooks/useEncryption";
import { KeyBackupModal } from "@/components/common/KeyBackupModal";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { keyPair, showInitialBackup, setShowInitialBackup } = useEncryption();

  const handleCloseBackupModal = () => {
    setShowInitialBackup(false);
    localStorage.setItem("key_backup_seen", "true");
  };

  return (
    <html lang="en">
      <body>
        {children}
        <Navigation />
        {showInitialBackup && keyPair && (
          <KeyBackupModal keyPair={keyPair} onClose={handleCloseBackupModal} />
        )}
      </body>
    </html>
  );
}
