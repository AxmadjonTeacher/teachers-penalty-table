
import React from "react";
import { format } from "date-fns";
import { Calendar } from "lucide-react";

interface DateHeaderProps {
  date: Date | null;
  onDateChange: (value: string) => void;
  readOnly?: boolean;
}

export const DateHeader: React.FC<DateHeaderProps> = ({ 
  date, 
  onDateChange,
  readOnly = false 
}) => {
  const formattedDate = date ? format(new Date(date), "dd/MM/yy") : "Set date";
  
  return (
    <div className="flex flex-col items-center px-2 py-2">
      <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
        <Calendar className="h-3 w-3" />
        <span>Date</span>
      </div>
      
      {readOnly ? (
        <div className="border rounded px-2 py-1 text-xs text-gray-600 bg-gray-50">
          {date ? formattedDate : "No date"}
        </div>
      ) : (
        <input
          type="date"
          value={date ? format(new Date(date), "yyyy-MM-dd") : ""}
          onChange={(e) => onDateChange(e.target.value)}
          className="w-full text-center text-xs border border-gray-300 rounded px-2 py-1"
          placeholder="Set date"
        />
      )}
    </div>
  );
};
