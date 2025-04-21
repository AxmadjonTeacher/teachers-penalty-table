
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteButton } from "@/components/ui/DeleteButton";

interface Student {
  id: number;
  name: string;
  proficiencyLevel: string;
}

const levelColors: Record<string, string> = {
  "Beginner Group": "bg-[#E5DEFF] text-[#9b87f5]",
  "Intermediate Group": "bg-[#FDE1D3] text-[#E97D27]",
  "Advanced Group": "bg-[#D3E4FD] text-[#4170AB]",
};

interface DraggableRowProps {
  student: Student;
  recentlyAddedId: number | null;
  onDeleteStudent: (id: number) => void;
}

const DraggableRow = ({ student, recentlyAddedId, onDeleteStudent }: DraggableRowProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: student.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`hover:bg-[#9b87f5]/10 transition-all duration-300 cursor-move group ${
        recentlyAddedId === student.id ? "animate-scale-in bg-[#C4B5FD]/30" : ""
      }`}
    >
      <TableCell className="font-medium group-hover:text-[#8B5CF6]">{student.name}</TableCell>
      <TableCell>
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold ${
            levelColors[student.proficiencyLevel] || "bg-[#9b87f5]/10"
          }`}
        >
          {student.proficiencyLevel}
        </span>
      </TableCell>
      <TableCell>
        <DeleteButton
          onClick={() => onDeleteStudent(student.id)}
          title="Delete student"
        />
      </TableCell>
    </TableRow>
  );
};

interface GroupTableProps {
  students: Student[];
  title: string;
  recentlyAddedId: number | null;
  onDeleteStudent: (id: number) => void;
}

export const GroupTable = ({
  students,
  title,
  recentlyAddedId,
  onDeleteStudent,
}: GroupTableProps) => (
  <div
    className="rounded-xl p-6 shadow-md border-2 bg-gradient-to-bl from-white/90 to-[#E5DEFF]/60 border-[#E5DEFF] mb-6 transition-all hover:shadow-lg animate-fade-in group"
    aria-label={`${title} students table`}
  >
    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
      <span
        className={`inline-block h-2 w-2 rounded-full ${
          levelColors[title] || "bg-[#9b87f5]"
        }`}
      ></span>
      <span className="tracking-tight group-hover:text-[#8B5CF6] transition-colors">{title}</span>
    </h3>
    {students.length === 0 ? (
      <p className="text-gray-400 italic text-center py-6 bg-gray-50/80 rounded-lg">
        No students in this group yet.
      </p>
    ) : (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold text-[#1A1F2C]/70">Name</TableHead>
            <TableHead className="font-semibold text-[#1A1F2C]/70">
              Proficiency Level
            </TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <DraggableRow
              key={student.id}
              student={student}
              recentlyAddedId={recentlyAddedId}
              onDeleteStudent={onDeleteStudent}
            />
          ))}
        </TableBody>
      </Table>
    )}
  </div>
);
