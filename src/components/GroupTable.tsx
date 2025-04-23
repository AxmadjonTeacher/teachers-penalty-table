
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
import { Input } from "@/components/ui/input";

// Performance grade options
const gradeButtons = [
  { value: "+", color: "text-green-600", title: "Everything is done" },
  { value: "K", color: "text-orange-500", title: "Kelmedi" },
  { value: "KQ", color: "text-yellow-600", title: "Kech keldi" },
  { value: "V", color: "text-red-500", title: "Vazifa qilmadi" },
];

interface Student {
  id: number;
  name: string;
  proficiencyLevel: string;
  className?: string;
}

interface GroupTableProps {
  students: Student[];
  title: string;
  teacherName: string;
  recentlyAddedId: number | null;
  onDeleteStudent: (id: number) => void;
  onEditStudentName: (id: number, newName: string) => void;
}

type GradesState = {
  [studentId: number]: {
    [dateIdx: number]: string[] // array of selected values (can choose 1 or multiple)
  }
};

function dateLabel(date: Date | null): string {
  if (!date) return "";
  // e.g., 23.04
  return `${(date.getDate()+"").padStart(2,"0")}.${(date.getMonth()+1+"").padStart(2,"0")}`;
}

export const GroupTable = ({
  students,
  title,
  teacherName,
  recentlyAddedId,
  onDeleteStudent,
  onEditStudentName,
}: GroupTableProps) => {
  // 3 days by default, can be changed
  const [dates, setDates] = useState<(Date|null)[]>([null, null, null]);

  // Grades state: studentId -> dateIdx -> string[]
  const [grades, setGrades] = useState<GradesState>({});

  // Which student is being edited (name)
  const [editingNameId, setEditingNameId] = useState<number | null>(null);
  const [editingNameValue, setEditingNameValue] = useState<string>("");

  // Teacher's notes for this group
  const [notes, setNotes] = useState("");

  // Date editing per cell
  const handleDateChange = (idx: number, value: string) => {
    setDates(prev => {
      const newDates = [...prev];
      newDates[idx] = value ? new Date(value) : null;
      return newDates;
    });
  };

  // Grade selection per cell
  const handleGradeClick = (
    studentId: number,
    dateIdx: number,
    value: string,
  ) => {
    setGrades(prev => {
      const st = prev[studentId] || {};
      const arr = new Set(st[dateIdx] || []);
      if (arr.has(value)) {
        arr.delete(value);
      } else {
        arr.add(value);
      }
      return {
        ...prev,
        [studentId]: { ...st, [dateIdx]: Array.from(arr) },
      };
    });
  };

  // Inline editing
  const startEdit = (id: number, name: string) => {
    setEditingNameId(id);
    setEditingNameValue(name);
  };
  const saveEdit = (id: number) => {
    onEditStudentName(id, editingNameValue.trim());
    setEditingNameId(null);
  };
  const cancelEdit = () => {
    setEditingNameId(null);
    setEditingNameValue("");
  };

  return (
    <div className="rounded-xl p-4 shadow-md border-2 bg-gradient-to-bl from-white/90 to-[#E5DEFF]/60 border-[#E5DEFF] transition-all hover:shadow-lg animate-fade-in group mb-10" aria-label={`${title} students table`}>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-2">
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
      </div>
      {/* Editable tracked dates above columns */}
      <div className="flex justify-end mb-2">
        <div className="flex gap-6">
          {[0,1,2].map(idx =>
            <div key={idx} className="flex flex-col items-center">
              <input
                type="date"
                value={dates[idx] ? (dates[idx] as Date).toISOString().split('T')[0] : ""}
                onChange={e => handleDateChange(idx, e.target.value)}
                className="border px-2 rounded w-[105px] text-sm"
                placeholder="Date"
              />
              <span className="text-xs text-gray-400 min-h-[18px]">
                {dates[idx] ? dateLabel(dates[idx]) : ""}
              </span>
            </div>
          )}
        </div>
      </div>
      {students.length === 0 ? (
        <p className="text-gray-400 italic text-center py-6 bg-gray-50/80 rounded-lg">
          No students in this group yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold text-[#1A1F2C]/70 min-w-[200px]">Full Name / Class</TableHead>
                {[0,1,2].map(idx => (
                  <TableHead key={idx} className="font-semibold text-[#1A1F2C]/70 min-w-[110px] text-center">
                    {dates[idx]? dateLabel(dates[idx]) : "Date"}
                  </TableHead>
                ))}
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map(student => (
                <TableRow
                  key={student.id}
                  className={`hover:bg-[#9b87f5]/10 transition-all duration-300 ${
                    recentlyAddedId === student.id
                      ? "animate-scale-in bg-[#C4B5FD]/30"
                      : ""
                  }`}
                >
                  <TableCell className="font-medium align-top">
                    <div className="flex flex-col gap-1">
                      {editingNameId === student.id ? (
                        <div className="flex gap-2 items-center">
                          <Input
                            value={editingNameValue}
                            onChange={e => setEditingNameValue(e.target.value)}
                            className="h-8 w-full"
                          />
                          <Button size="sm" onClick={() => saveEdit(student.id)} className="px-2 py-1" title="Save">Save</Button>
                          <Button size="sm" variant="ghost" onClick={cancelEdit} className="px-2 py-1 text-gray-400" title="Cancel">Cancel</Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span>{student.name || <span className="text-gray-300 italic">No name</span>}</span>
                          <Button onClick={() => startEdit(student.id, student.name)} variant="ghost" size="sm" className="px-1 py-1 text-xs text-[#8B5CF6]">Edit</Button>
                        </div>
                      )}
                      {student.className && (
                        <span className="text-xs text-gray-400">
                          Class: {student.className}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  {[0,1,2].map(dateIdx => (
                    <TableCell key={dateIdx} className="text-center">
                      <div className="flex flex-wrap gap-2 justify-center">
                        {gradeButtons.map(({ value, color, title: tooltip }) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() => handleGradeClick(student.id, dateIdx, value)}
                            className={`px-2 py-1 rounded-md border transition-all duration-100 select-none
                              ${grades[student.id]?.[dateIdx]?.includes(value)
                                ? `${color} font-bold bg-gray-100 border-gray-300 scale-105 shadow`
                                : "text-gray-400 hover:bg-gray-100 border-transparent"
                              }`}
                            title={tooltip}
                          >
                            {value}
                          </button>
                        ))}
                      </div>
                    </TableCell>
                  ))}
                  <TableCell className="align-top pr-2">
                    <DeleteButton
                      onClick={() => onDeleteStudent(student.id)}
                      title="Delete student"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {/* Teacher's Notes section at bottom of table */}
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
