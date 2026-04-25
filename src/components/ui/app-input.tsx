"use client";

import clsx from "clsx";
import { Input, InputNumber, type InputNumberProps, type InputProps } from "antd";

type AppInputSize = "sm" | "md" | "lg";

export interface AppInputProps extends Omit<InputProps, "size"> {
  uiSize?: AppInputSize;
}

export interface AppInputNumberProps extends Omit<InputNumberProps<number>, "size"> {
  uiSize?: AppInputSize;
}

const inputSizeClasses: Record<AppInputSize, string> = {
  sm: "!h-9 !text-[13px]",
  md: "!h-10 !text-[13px]",
  lg: "!h-12 !text-[13px]",
};

const numberSizeClasses: Record<AppInputSize, string> = {
  sm: "!h-9 [&_.ant-input-number-input]:!h-9",
  md: "!h-10 [&_.ant-input-number-input]:!h-10",
  lg: "!h-12 [&_.ant-input-number-input]:!h-12",
};

export function AppInput({ uiSize = "md", className, ...props }: AppInputProps) {
  return (
    <Input
      {...props}
      className={clsx(
        "!rounded-none !border-[#8f8f8f] !bg-transparent !px-4 !text-[#1b1b1b] placeholder:!text-[#7a7a7a]",
        inputSizeClasses[uiSize],
        className,
      )}
    />
  );
}

export function AppInputNumber({
  uiSize = "md",
  className,
  controls,
  ...props
}: AppInputNumberProps) {
  return (
    <InputNumber<number>
      {...props}
      controls={controls ?? false}
      className={clsx(
        "!w-full !rounded-none !border-[#8f8f8f] !bg-transparent !px-1 [&_.ant-input-number-input]:!px-3 [&_.ant-input-number-input]:!text-[13px] [&_.ant-input-number-input]:!text-[#1b1b1b]",
        numberSizeClasses[uiSize],
        className,
      )}
    />
  );
}
