
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteButton } from "@/components/ui/DeleteButton";
import { format } from "date-fns";

interface Student {
  id: number;
  name: string;
  proficiencyLevel: string;
}

interface StudentRowProps {
  student: Student;
  recentlyAddedId: number | null;
  onDeleteStudent: (id: number) => void;
}

const StudentRow = ({ student, recentlyAddedId, onDeleteStudent }: StudentRowProps) => {
  const [grade, setGrade] = useState<string>("");

  const gradeButtons = [
    { value: "+", color: "text-green-600", title: "Everything is done" },
    { value: "K", color: "text-orange-500", title: "Kelmadi" },
    { value: "KQ", color: "text-yellow-600", title: "Kech qoldi" },
    { value: "V", color: "text-red-500", title: "Vazifa qilmadi" }
  ];

  return (
    <TableRow
      className={`hover:bg-[#9b87f5]/10 transition-all duration-300 ${
        recentlyAddedId === student.id ? "animate-scale-in bg-[#C4B5FD]/30" : ""
      }`}
    >
      <TableCell className="font-medium group-hover:text-[#8B5CF6]">{student.name}</TableCell>
      <TableCell>
        <div className="flex gap-2">
          {gradeButtons.map(({ value, color, title }) => (
            <button
              key={value}
              onClick={() => setGrade(grade === value ? "" : value)}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                grade === value 
                  ? `${color} font-bold bg-gray-100` 
                  : "text-gray-500 hover:bg-gray-100"
              }`}
              title={title}
            >
              {value}
            </button>
          ))}
        </div>
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
  onDateChange?: (studentId: number, date: Date) => void; // Added this prop as optional
}

export const GroupTable = ({
  students,
  title,
  recentlyAddedId,
  onDeleteStudent,
  onDateChange, // Added this prop
}: GroupTableProps) => (
  <div
    className="rounded-xl p-4 shadow-md border-2 bg-gradient-to-bl from-white/90 to-[#E5DEFF]/60 border-[#E5DEFF] transition-all hover:shadow-lg animate-fade-in group"
    aria-label={`${title} students table`}
  >
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-xl font-semibold flex items-center gap-2">
        <span className="inline-block h-2 w-2 rounded-full bg-[#9b87f5]"></span>
        <span className="tracking-tight group-hover:text-[#8B5CF6] transition-colors">
          {title}
        </span>
      </h3>
      <span className="text-sm text-gray-500">
        {format(new Date(), 'MMMM d, yyyy')}
      </span>
    </div>
    {students.length === 0 ? (
      <p className="text-gray-400 italic text-center py-6 bg-gray-50/80 rounded-lg">
        No students in this group yet.
      </p>
    ) : (
      <div className="overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold text-[#1A1F2C]/70">Name</TableHead>
              <TableHead className="font-semibold text-[#1A1F2C]/70">Grade</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <StudentRow
                key={student.id}
                student={student}
                recentlyAddedId={recentlyAddedId}
                onDeleteStudent={onDeleteStudent}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    )}
  </div>
);
