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
          href="/contacts"
          className={twMerge(
            "flex-1 py-3 text-center",
            pathname === "/contacts" && "text-tg-theme-button"
          )}
        >
          Friends
        </Link>
        <Link
          href="/"
          className={twMerge(
            "flex-1 py-3 text-center",
            pathname === "/" && "text-tg-theme-button"
          )}
        >
          Home
        </Link>
        <Link
          href="/profile"
          className={twMerge(
            "flex-1 py-3 text-center",
            pathname === "/profile" && "text-tg-theme-button"
          )}
        >
          Account
        </Link>
      </div>
    </nav>
  );
};
