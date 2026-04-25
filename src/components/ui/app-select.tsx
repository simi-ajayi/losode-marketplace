"use client";

import clsx from "clsx";
import { Select, type SelectProps } from "antd";

type AppSelectSize = "sm" | "md" | "lg";

export interface AppSelectProps extends Omit<SelectProps, "size"> {
  uiSize?: AppSelectSize;
}

const sizeClasses: Record<AppSelectSize, string> = {
  sm: "[&_.ant-select-selector]:!h-9 [&_.ant-select-selection-item]:!leading-[34px] [&_.ant-select-selection-placeholder]:!leading-[34px]",
  md: "[&_.ant-select-selector]:!h-10 [&_.ant-select-selection-item]:!leading-[38px] [&_.ant-select-selection-placeholder]:!leading-[38px]",
  lg: "[&_.ant-select-selector]:!h-12 [&_.ant-select-selection-item]:!leading-[46px] [&_.ant-select-selection-placeholder]:!leading-[46px]",
};

export function AppSelect({ uiSize = "md", className, ...props }: AppSelectProps) {
  return (
    <Select
      {...props}
      className={clsx(
        "min-w-[88px] [&_.ant-select-selector]:!rounded-none [&_.ant-select-selector]:!border-[#8f8f8f] [&_.ant-select-selector]:!bg-transparent [&_.ant-select-selection-item]:!text-[14px] [&_.ant-select-selection-item]:!text-[#1f1f1f] [&_.ant-select-selection-placeholder]:!text-[#7b7b7b]",
        sizeClasses[uiSize],
        className,
      )}
    />
  );
}
