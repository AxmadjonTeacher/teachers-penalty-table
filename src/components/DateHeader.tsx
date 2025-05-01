
import React from "react";
import { useAuth } from "@/contexts/AuthContext";

function formatDateHeader(date: Date | null) {
  if (!date) return "";
  return `${date.getDate()} ${date.toLocaleString("en-US", { month: "long" })}`;
}

interface DateHeaderProps {
  date: Date | null;
  onDateChange: (val: string) => void;
}

export const DateHeader: React.FC<DateHeaderProps> = ({ date, onDateChange }) => {
  const { isTeacher } = useAuth();
  
  return (
    <div className="min-w-[200px] text-center border-l-2 border-gray-200 px-2 py-2">
      <input
        type="date"
        value={date ? (date as Date).toISOString().split('T')[0] : ""}
        onChange={e => onDateChange(e.target.value)}
        className={`border border-[#E5DEFF] px-2 py-1 rounded w-[120px] text-xs
          ${isTeacher() 
            ? "focus:outline-[#8B5CF6] focus:border-[#8B5CF6]" 
            : "bg-gray-50 cursor-not-allowed"}`}
        disabled={!isTeacher()}
      />
      <div className="text-xs text-gray-500 min-h-[16px] font-medium mt-1">
        {formatDateHeader(date)}
      </div>
    </div>
  );
};
