
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
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface Student {
  id: number;
  name: string;
  proficiencyLevel: string;
  date?: Date;
}

const levelColors: Record<string, string> = {
  "Grades 5-6": "bg-[#E5DEFF] text-[#9b87f5]",
  "Grades 7-8": "bg-[#FDE1D3] text-[#E97D27]",
  "Grades 9-11": "bg-[#D3E4FD] text-[#4170AB]",
};

interface StudentRowProps {
  student: Student;
  recentlyAddedId: number | null;
  onDeleteStudent: (id: number) => void;
  onDateChange: (studentId: number, date: Date) => void;
}

const StudentRow = ({ student, recentlyAddedId, onDeleteStudent, onDateChange }: StudentRowProps) => {
  const [grade, setGrade] = useState<string>("");

  const gradeColors = {
    "+": "text-green-600",
    "K": "text-orange-500",
    "KQ": "text-yellow-600",
    "V": "text-red-500"
  };

  const handleGradeClick = (newGrade: string) => {
    setGrade(grade === newGrade ? "" : newGrade);
  };

  return (
    <TableRow
      className={`hover:bg-[#9b87f5]/10 transition-all duration-300 ${
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
        <div className="flex gap-2">
          {Object.entries(gradeColors).map(([gradeOption, colorClass]) => (
            <button
              key={gradeOption}
              onClick={() => handleGradeClick(gradeOption)}
              className={`px-2 py-1 rounded hover:bg-gray-100 transition-colors ${
                grade === gradeOption ? `font-bold ${colorClass}` : "text-gray-500"
              }`}
            >
              {gradeOption}
            </button>
          ))}
        </div>
      </TableCell>
      <TableCell>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[180px] pl-3 text-left font-normal",
                !student.date && "text-muted-foreground"
              )}
            >
              {student.date ? (
                format(student.date, "PPP")
              ) : (
                <span>Pick a date</span>
              )}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={student.date}
              onSelect={(date) => date && onDateChange(student.id, date)}
              initialFocus
              className="rounded-md border"
            />
          </PopoverContent>
        </Popover>
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
  onDateChange: (studentId: number, date: Date) => void;
}

export const GroupTable = ({
  students,
  title,
  recentlyAddedId,
  onDeleteStudent,
  onDateChange,
}: GroupTableProps) => (
  <div
    className="rounded-xl p-4 shadow-md border-2 bg-gradient-to-bl from-white/90 to-[#E5DEFF]/60 border-[#E5DEFF] transition-all hover:shadow-lg animate-fade-in group"
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
      <div className="overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold text-[#1A1F2C]/70">Name</TableHead>
              <TableHead className="font-semibold text-[#1A1F2C]/70">Grade Level</TableHead>
              <TableHead className="font-semibold text-[#1A1F2C]/70">Grade</TableHead>
              <TableHead className="font-semibold text-[#1A1F2C]/70">Date</TableHead>
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
                onDateChange={onDateChange}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    )}
  </div>
);
