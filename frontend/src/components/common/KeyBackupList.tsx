import type { KeyBackup } from "@/utils/encryption/keyManagement";

interface KeyBackupListProps {
  backups: KeyBackup[];
  onRestore: (backup: KeyBackup) => void;
}

export const KeyBackupList = ({ backups, onRestore }: KeyBackupListProps) => (
  <div className="mt-2 space-y-2">
    {backups.map((backup) => (
      <div
        key={backup.timestamp}
        className="flex items-center justify-between text-xs text-gray-500"
      >
        <span>Backup from {new Date(backup.timestamp).toLocaleString()}</span>
        <button
          onClick={() => onRestore(backup)}
          className="hover:text-gray-700"
        >
          Restore
        </button>
      </div>
    ))}
  </div>
);
