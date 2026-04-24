import { Empty } from "antd";

interface EmptyStateProps {
  description: string;
}

export function EmptyState({ description }: EmptyStateProps) {
  return (
    <div className="rounded-3xl border border-[#f0e7da] bg-white p-10 shadow-sm">
      <Empty description={description} />
    </div>
  );
}
