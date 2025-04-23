
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

interface Student {
  id: number;
  name: string;
  proficiencyLevel: string;
  className?: string;
}

interface GroupTableProps {
  students: Student[];
  title: string;
  month: string;
  teacherName: string;
  recentlyAddedId: number | null;
  onDeleteStudent: (id: number) => void;
}

const DAYS = ["Day 1", "Day 2", "Day 3"];

const gradeButtons = [
  { value: "+", color: "text-green-600", title: "Everything is done" },
  { value: "K", color: "text-orange-500", title: "Kelmedi" },
  { value: "KQ", color: "text-yellow-600", title: "Kech keldi" },
  { value: "V", color: "text-red-500", title: "Vazifa qilmadi" }
];

// Store notes and grade states in parent GroupTable, mapped by group title (for notes)
// and studentId+day for grades (local state works for now as persistence is not requested)
export const GroupTable = ({
  students,
  title,
  month,
  teacherName,
  recentlyAddedId,
  onDeleteStudent,
}: GroupTableProps) => {
  // Notes state (per group table)
  const [notes, setNotes] = useState("");

  // Per-student-per-day grade state (not persisted)
  const [grades, setGrades] = useState<{
    [studentId: number]: { [day: string]: string }
  }>({});

  const handleGradeClick = (
    studentId: number,
    day: string,
    gradeValue: string
  ) => {
    setGrades((prev) => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || {}),
        [day]: (prev[studentId]?.[day] === gradeValue ? "" : gradeValue)
      }
    }));
  };

  return (
    <div
      className="rounded-xl p-4 shadow-md border-2 bg-gradient-to-bl from-white/90 to-[#E5DEFF]/60 border-[#E5DEFF] transition-all hover:shadow-lg animate-fade-in group mb-10"
      aria-label={`${title} students table`}
    >
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-1">
        <div>
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-[#9b87f5]"></span>
            <span className="tracking-tight group-hover:text-[#8B5CF6] transition-colors">
              {title}
            </span>
          </h3>
          <div className="text-sm font-medium text-[#8B5CF6] mt-1">
            Teacher: <span className="font-bold">{teacherName || "—"}</span>
          </div>
        </div>
        <span className="text-sm text-[#8B5CF6] font-bold">{month}</span>
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
                <TableHead className="font-semibold text-[#1A1F2C]/70 w-1/5">Full Name / Class</TableHead>
                <TableHead className="font-semibold text-[#1A1F2C]/70">Day</TableHead>
                <TableHead className="font-semibold text-[#1A1F2C]/70">Grade</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) =>
                DAYS.map(day => (
                  <TableRow
                    key={student.id + "-" + day}
                    className={`hover:bg-[#9b87f5]/10 transition-all duration-300 ${
                      recentlyAddedId === student.id && day === "Day 1"
                        ? "animate-scale-in bg-[#C4B5FD]/30"
                        : ""
                    }`}
                  >
                    {/* Only show name/class for first day row */}
                    {day === "Day 1" ? (
                      <TableCell rowSpan={DAYS.length} className="font-medium align-top">
                        <div className="flex flex-col">
                          <span>{student.name}</span>
                          <span className="text-xs text-gray-400">
                            {student.className ? `Class: ${student.className}` : ""}
                          </span>
                        </div>
                      </TableCell>
                    ) : null}
                    <TableCell className="min-w-[70px]">{day}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {gradeButtons.map(({ value, color, title: tooltip }) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() => handleGradeClick(student.id, day, value)}
                            className={`px-3 py-1.5 rounded-md border transition-all duration-100
                              ${
                                grades[student.id]?.[day] === value
                                  ? `${color} font-bold bg-gray-100 border-gray-300 scale-110 shadow`
                                  : "text-gray-500 hover:bg-gray-100 border-transparent"
                              }`}
                            title={tooltip}
                          >
                            {value}
                          </button>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      {/* Only show delete button for first row */}
                      {day === "Day 1" && (
                        <DeleteButton
                          onClick={() => onDeleteStudent(student.id)}
                          title="Delete student"
                        />
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          {/* Teacher's Notes section below the student's table */}
          <div className="mt-6">
            <label className="block text-[#8B5CF6] font-semibold mb-2">Teacher’s Notes</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Write your notes or feedback here..."
              className="w-full min-h-[60px] rounded-md border border-[#8B5CF6]/20 bg-white px-3 py-2 text-base shadow-sm focus:outline-[#8B5CF6]"
            />
          </div>
        </div>
      )}
    </div>
  );
};

