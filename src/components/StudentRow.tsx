
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DeleteButton } from "@/components/ui/DeleteButton";
import { GradeCell } from "./GradeCell";
import { Check, X, Edit } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface Student {
  id: number;
  name: string;
  proficiencyLevel: string;
  className?: string;
}

interface StudentRowProps {
  student: Student;
  index: number;
  dates: (Date | null)[];
  grades: { [dateIdx: number]: string[] };
  recentlyAddedId: number | null;
  editingNameId: number | null;
  editingNameValue: string;
  onEditStart: (id: number, name: string) => void;
  onEditSave: (id: number) => void;
  onEditCancel: () => void;
  onNameChange: (val: string) => void;
  onDelete: (id: number) => void;
  onGradeClick: (studentId: number, dateIdx: number, value: string) => void;
}

export const StudentRow: React.FC<StudentRowProps> = ({
  student,
  index,
  dates,
  grades,
  recentlyAddedId,
  editingNameId,
  editingNameValue,
  onEditStart,
  onEditSave,
  onEditCancel,
  onNameChange,
  onDelete,
  onGradeClick,
}) => {
  const { isTeacher } = useAuth();
  
  return (
    <tr
      className={`border-b border-gray-200 last:border-0 hover:bg-[#f6f4ff] transition-all ${
        recentlyAddedId === student.id ? "animate-scale-in bg-[#e7e4fb]" : ""
      }`}
    >
      <td className="px-3 py-3 align-middle min-w-[250px] sticky left-0 bg-white z-20 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col gap-1 w-full max-w-[180px]">
            {editingNameId === student.id ? (
              <div className="flex gap-2 items-center">
                <Input
                  value={editingNameValue}
                  onChange={e => onNameChange(e.target.value)}
                  className="h-7 w-full py-1 border-[#8B5CF6]/30 focus:border-[#8B5CF6]"
                />
                <Button
                  size="sm"
                  onClick={() => onEditSave(student.id)}
                  className="px-2 py-1 bg-[#8B5CF6] hover:bg-[#7C3AED]"
                  title="Save"
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onEditCancel}
                  className="px-2 py-1 text-gray-400"
                  title="Cancel"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="whitespace-nowrap font-medium truncate">
                  {student.name || <span className="text-gray-300 italic">No name</span>}
                </span>
                {isTeacher() && (
                  <Button
                    onClick={() => onEditStart(student.id, student.name)}
                    variant="ghost"
                    size="sm"
                    className="px-1 py-1 text-xs text-[#8B5CF6] hover:text-[#7C3AED] hover:bg-[#8B5CF6]/10 flex-shrink-0"
                    title="Edit"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                )}
              </div>
            )}
            {student.className && (
              <span className="text-[11px] text-gray-400 truncate">
                {student.className}
              </span>
            )}
          </div>
          {isTeacher() && (
            <DeleteButton
              onClick={() => onDelete(student.id)}
              title="Delete student"
            />
          )}
        </div>
      </td>
      {dates.map((_d, dateIdx) => (
        <GradeCell
          key={dateIdx}
          studentId={student.id}
          dateIdx={dateIdx}
          selected={grades[dateIdx] || []}
          onGradeClick={onGradeClick}
          isTeacher={isTeacher()}
        />
      ))}
    </tr>
  );
};
