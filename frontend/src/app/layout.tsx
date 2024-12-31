"use client";

import { useEffect, useState } from "react";
import "./globals.css";
import { Navigation } from "@/components/layout/Navigation";
import { useEncryption } from "@/hooks/useEncryption";
import { KeyBackupModal } from "@/components/common/KeyBackupModal";
import { ProfileSetupModal } from "@/components/common/ProfileSetupModal";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { keyPair, showInitialBackup, setShowInitialBackup } = useEncryption();
  const [showProfileSetup, setShowProfileSetup] = useState(false);

  useEffect(() => {
    const hasCompletedSetup =
      localStorage.getItem("profile_setup_completed") === "true";
    setShowProfileSetup(!hasCompletedSetup);
  }, []);

  const handleProfileComplete = () => {
    setShowProfileSetup(false);
    setShowInitialBackup(true);
    localStorage.setItem("profile_setup_completed", "true");
  };

  const handleBackupComplete = () => {
    setShowInitialBackup(false);
    localStorage.setItem("key_backup_seen", "true");
  };

  return (
    <html lang="en">
      <body>
        {children}
        <Navigation />
        {showProfileSetup && (
          <ProfileSetupModal onComplete={handleProfileComplete} />
        )}
        {!showProfileSetup && showInitialBackup && keyPair && (
          <KeyBackupModal keyPair={keyPair} onClose={handleBackupComplete} />
        )}
      </body>
    </html>
  );
}
