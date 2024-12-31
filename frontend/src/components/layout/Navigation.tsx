"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";

export const Navigation = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-tg-theme-bg border-t border-tg-theme-button">
      <div className="flex justify-around">
        <Link
          href="/"
          className={twMerge(
            "flex-1 py-3 text-center",
            pathname === "/" && "text-tg-theme-button"
          )}
        >
          ホーム
        </Link>
        <Link
          href="/settings"
          className={twMerge(
            "flex-1 py-3 text-center",
            pathname === "/settings" && "text-tg-theme-button"
          )}
        >
          設定
        </Link>
      </div>
    </nav>
  );
};
