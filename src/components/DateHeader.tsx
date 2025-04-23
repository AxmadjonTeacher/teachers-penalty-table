
import React from "react";

function formatDateHeader(date: Date | null) {
  if (!date) return "";
  // "23 April"
  return `${date.getDate()} ${date.toLocaleString("en-US", { month: "long" })}`;
}

interface DateHeaderProps {
  date: Date | null;
  onDateChange: (val: string) => void;
}

export const DateHeader: React.FC<DateHeaderProps> = ({ date, onDateChange }) => (
  <th className="font-semibold text-[#1A1F2C]/70 min-w-[110px] text-center">
    <div className="flex flex-col items-center">
      <input
        type="date"
        value={date ? (date as Date).toISOString().split('T')[0] : ""}
        onChange={e => onDateChange(e.target.value)}
        className="border px-2 rounded w-[95px] text-xs"
        placeholder="Date"
      />
      <span className="text-xs text-gray-500 min-h-[18px]">
        {formatDateHeader(date)}
      </span>
    </div>
  </th>
);
