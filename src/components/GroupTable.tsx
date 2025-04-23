
import React, { useState } from "react";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StudentRow } from "./StudentRow";
import { DateHeader } from "./DateHeader";
import { TeacherNotes } from "./TeacherNotes";

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
    [dateIdx: number]: string[]
  }
};

export const GroupTable = ({
  students,
  title,
  teacherName,
  recentlyAddedId,
  onDeleteStudent,
  onEditStudentName,
}: GroupTableProps) => {
  const [dates, setDates] = useState<(Date | null)[]>([null, null, null]);
  const [grades, setGrades] = useState<GradesState>({});
  const [editingNameId, setEditingNameId] = useState<number | null>(null);
  const [editingNameValue, setEditingNameValue] = useState<string>("");
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
    <div className="rounded-xl p-4 shadow-md border-2 bg-gradient-to-bl from-white/90 to-[#E5DEFF]/60 border-[#E5DEFF] transition-all hover:shadow-lg animate-fade-in group mb-10">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-3 gap-2">
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
      <div className="flex justify-end mb-1">
        <div className="flex gap-4">
          {[0,1,2].map(idx =>
            <DateHeader
              key={idx}
              date={dates[idx]}
              onDateChange={val => handleDateChange(idx, val)}
            />
          )}
        </div>
      </div>

      {students.length === 0 ? (
        <p className="text-gray-400 italic text-center py-4 bg-gray-50/80 rounded-lg">
          No students in this group yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold text-[#1A1F2C]/70 min-w-[140px] px-2 py-1">Full Name / Class</TableHead>
                {[0,1,2].map(idx => (
                  <TableHead key={idx} className="font-semibold text-[#1A1F2C]/70 min-w-[90px] text-center px-1 py-1">
                    {/* Blank, handled by DateHeader above */}
                  </TableHead>
                ))}
                <TableHead className="px-1 py-1"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student, idx) => (
                <StudentRow
                  key={student.id}
                  student={student}
                  index={idx}
                  dates={dates}
                  grades={grades[student.id] || {}}
                  recentlyAddedId={recentlyAddedId}
                  editingNameId={editingNameId}
                  editingNameValue={editingNameValue}
                  onEditStart={startEdit}
                  onEditSave={saveEdit}
                  onEditCancel={cancelEdit}
                  onNameChange={setEditingNameValue}
                  onDelete={onDeleteStudent}
                  onGradeClick={handleGradeClick}
                />
              ))}
            </TableBody>
          </Table>
          <TeacherNotes notes={notes} setNotes={setNotes} />
        </div>
      )}
    </div>
  );
};

