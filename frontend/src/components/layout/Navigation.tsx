"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";
import {
  UsersIcon,
  HomeIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

export const Navigation = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-tg-theme-bg border-t border-tg-theme-button shadow-lg backdrop-blur-lg">
      <div className="flex justify-around">
        <Link
          href="/contacts"
          className={twMerge(
            "flex-1 py-3 flex flex-col items-center transition-colors",
            "hover:bg-tg-theme-button/10",
            pathname === "/contacts" && "text-tg-theme-button"
          )}
        >
          <UsersIcon className="w-6 h-6" />
          <span className="text-xs mt-1">Friends</span>
        </Link>
        <Link
          href="/"
          className={twMerge(
            "flex-1 py-3 flex flex-col items-center transition-colors",
            "hover:bg-tg-theme-button/10",
            pathname === "/" && "text-tg-theme-button"
          )}
        >
          <HomeIcon className="w-6 h-6" />
          <span className="text-xs mt-1">Home</span>
        </Link>
        <Link
          href="/profile"
          className={twMerge(
            "flex-1 py-3 flex flex-col items-center transition-colors",
            "hover:bg-tg-theme-button/10",
            pathname === "/profile" && "text-tg-theme-button"
          )}
        >
          <UserCircleIcon className="w-6 h-6" />
          <span className="text-xs mt-1">Account</span>
        </Link>
      </div>
    </nav>
  );
};
