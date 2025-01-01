import { ButtonHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export const Button = ({
  children,
  className,
  variant = "primary",
  ...props
}: Readonly<ButtonProps>) => {
  return (
    <button
      className={twMerge(
        "py-2 px-4 rounded-lg",
        variant === "primary"
          ? "bg-tg-theme-button text-tg-theme-button-text"
          : "bg-gray-200 text-gray-800",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
