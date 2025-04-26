
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DeleteButton } from "@/components/ui/DeleteButton";
import { GradeCell } from "./GradeCell";
import { Check, X } from "lucide-react";

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
  return (
    <tr
      className={`border-b border-gray-200 last:border-0 hover:bg-[#f6f4ff] transition-all ${
        recentlyAddedId === student.id ? "animate-scale-in bg-[#e7e4fb]" : ""
      }`}
    >
      <td className="px-3 py-3 align-middle min-w-[200px] sticky left-0 bg-white">
        <div className="flex flex-col gap-1">
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
            <div className="flex items-center gap-1">
              <span className="whitespace-nowrap font-medium">{student.name || <span className="text-gray-300 italic">No name</span>}</span>
              <Button
                onClick={() => onEditStart(student.id, student.name)}
                variant="ghost"
                size="sm"
                className="px-1 py-1 text-xs text-[#8B5CF6] hover:text-[#7C3AED] hover:bg-[#8B5CF6]/10"
                title="Edit"
              >
                Edit
              </Button>
            </div>
          )}
          {student.className && (
            <span className="text-[11px] text-gray-400">
              {student.className}
            </span>
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
        />
      ))}
      <td className="align-middle px-2 py-2 border-l-2 border-gray-200">
        <DeleteButton
          onClick={() => onDelete(student.id)}
          title="Delete student"
        />
      </td>
    </tr>
  );
};
