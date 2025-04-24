
import React from "react";

const gradeButtons = [
  { value: "+", color: "text-green-600", title: "Everything is done" },
  { value: "K", color: "text-orange-500", title: "Kelmadi" },
  { value: "KQ", color: "text-yellow-600", title: "Kech qoldi" },
  { value: "V", color: "text-red-500", title: "Vazifa qilinmadi" },
];

interface GradeCellProps {
  studentId: number;
  dateIdx: number;
  selected: string[];
  onGradeClick: (studentId: number, dateIdx: number, value: string) => void;
}

export const GradeCell: React.FC<GradeCellProps> = ({
  studentId,
  dateIdx,
  selected,
  onGradeClick,
}) => (
  <td className="text-center px-2 py-1 border-l-2 border-gray-200">
    <div className="flex gap-1 justify-center">
      {gradeButtons.map(({ value, color, title }) => (
        <button
          key={value}
          type="button"
          onClick={() => onGradeClick(studentId, dateIdx, value)}
          className={`px-[6px] py-[2px] rounded border text-xs transition select-none
            ${selected.includes(value)
              ? `${color} font-bold bg-gray-100 border-gray-300 scale-105`
              : "text-gray-400 hover:bg-gray-100 border-transparent"
            }`}
          title={title}
        >
          {value}
        </button>
      ))}
    </div>
  </td>
);

