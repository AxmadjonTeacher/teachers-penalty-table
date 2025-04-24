
import React from "react";

function formatDateHeader(date: Date | null) {
  if (!date) return "";
  return `${date.getDate()} ${date.toLocaleString("en-US", { month: "long" })}`;
}

interface DateHeaderProps {
  date: Date | null;
  onDateChange: (val: string) => void;
}

export const DateHeader: React.FC<DateHeaderProps> = ({ date, onDateChange }) => (
  <div className="min-w-[90px] text-center">
    <input
      type="date"
      value={date ? (date as Date).toISOString().split('T')[0] : ""}
      onChange={e => onDateChange(e.target.value)}
      className="border px-2 rounded w-[95px] text-xs mb-1"
      placeholder="Date"
    />
    <div className="text-xs text-gray-500 min-h-[18px]">
      {formatDateHeader(date)}
    </div>
  </div>
);
