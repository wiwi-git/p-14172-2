import { ComponentProps } from "react";

type ButtonProps = ComponentProps<"button">;

export default function Button({
  type = "button",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`border rounded px-3 py-1.5 bg-white cursor-pointer transition-colors hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    />
  );
}
