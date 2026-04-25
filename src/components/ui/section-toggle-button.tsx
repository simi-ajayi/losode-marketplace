"use client";

import clsx from "clsx";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";

import { AppButton, type AppButtonProps } from "@/components/ui/app-button";

interface SectionToggleButtonProps
  extends Pick<AppButtonProps, "onClick" | "aria-controls" | "aria-expanded" | "disabled"> {
  expanded: boolean;
  label: React.ReactNode;
  className?: string;
  labelClassName?: string;
  iconClassName?: string;
}

export function SectionToggleButton({
  expanded,
  label,
  className,
  labelClassName,
  iconClassName,
  ...props
}: SectionToggleButtonProps) {
  return (
    <AppButton
      {...props}
      variant="text"
      className={clsx(
        "!h-auto !w-full !justify-between !px-0 !py-0 !font-normal !tracking-normal",
        className,
      )}
    >
      <span className={clsx("text-left", labelClassName)}>{label}</span>
      {expanded ? (
        <MinusOutlined className={clsx("text-[16px] leading-none", iconClassName)} />
      ) : (
        <PlusOutlined className={clsx("text-[16px] leading-none", iconClassName)} />
      )}
    </AppButton>
  );
}
