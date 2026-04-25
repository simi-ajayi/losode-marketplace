"use client";

import clsx from "clsx";
import { Checkbox, type CheckboxProps } from "antd";

export function AppCheckbox({ className, ...props }: CheckboxProps) {
  return (
    <Checkbox
      {...props}
      className={clsx(
        "!text-[12px] !text-[#2c2c2c] [&_.ant-checkbox-inner]:!rounded-[4px] [&_.ant-checkbox-inner]:!border-[#8f8f8f]",
        className,
      )}
    />
  );
}
