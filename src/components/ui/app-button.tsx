"use client";

import clsx from "clsx";
import { Button, type ButtonProps } from "antd";

type AppButtonVariant = "primary" | "outline" | "ghost" | "text" | "chip";
type AppButtonSize = "sm" | "md" | "lg" | "icon";

export interface AppButtonProps extends Omit<ButtonProps, "type" | "size"> {
  variant?: AppButtonVariant;
  uiSize?: AppButtonSize;
  fullWidth?: boolean;
}

const variantToType: Record<AppButtonVariant, ButtonProps["type"]> = {
  primary: "primary",
  outline: "default",
  ghost: "text",
  text: "text",
  chip: "default",
};

const variantClasses: Record<AppButtonVariant, string> = {
  primary:
    "!border-[#111111] !bg-[#111111] !text-white hover:!border-[#1b1b1b] hover:!bg-[#1b1b1b]",
  outline:
    "!border-[#2d2d2d]  !bg-transparent !text-[#222222] hover:!border-black hover:!bg-black/[0.03]",
  ghost:
    "!border-transparent !bg-transparent !text-[#2b2b2b] hover:!bg-black/[0.06]",
  text: "!border-transparent !justify-between flex !bg-transparent !text-[#2b2b2b] hover:!bg-transparent hover:!text-black",
  chip: "!rounded-full !border-[#bcbcbc] !bg-transparent !text-[#444444] hover:!border-black hover:!text-black",
};

const sizeClasses: Record<AppButtonSize, string> = {
  sm: "!h-9 !px-3 !text-[13px]",
  md: "!h-10 !px-4 !text-[14px]",
  lg: "!h-12 !px-6 !text-[15px]",
  icon: "!h-11 !w-11 !p-0",
};

export function AppButton({
  variant = "primary",
  uiSize = "md",
  fullWidth = false,
  className,
  ...props
}: AppButtonProps) {
  return (
    <Button
      {...props}
      type={variantToType[variant]}
      className={clsx(
        "!inline-flex !items-center !justify-enter !font-medium !shadow-none !transition-colors !duration-200 disabled:!opacity-70",
        variantClasses[variant],
        sizeClasses[uiSize],
        fullWidth ? "!w-full" : null,
        className,
      )}
    />
  );
}
