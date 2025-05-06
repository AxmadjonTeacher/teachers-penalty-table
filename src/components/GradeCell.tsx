
import React, { useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

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
  isTeacher: boolean;
}

export const GradeCell: React.FC<GradeCellProps> = ({
  studentId,
  dateIdx,
  selected,
  onGradeClick,
  isTeacher,
}) => {
  const isMobile = useIsMobile();
  
  // Ensure grade changes are saved whenever selected grades change
  useEffect(() => {
    // Nothing to do here, but this shows we're tracking changes
    // The actual saving happens in the parent component (GroupTable)
    console.log(`Grade cell updated for student ${studentId}, date ${dateIdx}, grades: ${selected.join(',')}`);
  }, [selected, studentId, dateIdx]);
  
  return (
    <td className="text-center px-1 py-1 md:px-2 md:py-2 border-l-2 border-gray-200 relative z-10">
      <div className={`flex flex-row gap-1 justify-center ${isMobile ? 'flex-wrap' : ''}`}>
        {gradeButtons.map(({ value, color, title }) => (
          <button
            key={value}
            type="button"
            onClick={() => isTeacher && onGradeClick(studentId, dateIdx, value)}
            className={`${isMobile ? 'w-6 h-6 flex items-center justify-center' : 'px-[6px] py-[2px]'} rounded border text-xs transition select-none
              ${selected.includes(value)
                ? `${color} font-bold bg-gray-100 border-gray-300 ${isMobile ? 'scale-100' : 'scale-105'} shadow-sm`
                : isTeacher 
                  ? "text-gray-400 hover:bg-gray-100 border-transparent hover:border-gray-200 cursor-pointer"
                  : "text-gray-400 border-transparent cursor-default"
              }`}
            title={isTeacher ? title : undefined}
            disabled={!isTeacher}
            aria-label={title}
          >
            {value}
          </button>
        ))}
      </div>
    </td>
  );
};
