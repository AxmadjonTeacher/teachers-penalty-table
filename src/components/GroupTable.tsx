
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
import { CalendarDays } from "lucide-react";

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
  dates: Date[];
  onChangeDates: (dates: Date[]) => void;
}

const gradeButtons = [
  { value: "+", color: "text-green-600", title: "Everything is done" },
  { value: "K", color: "text-orange-500", title: "Kelmedi" },
  { value: "KQ", color: "text-yellow-600", title: "Kech keldi" },
  { value: "V", color: "text-red-500", title: "Vazifa qilmadi" }
];

// Maps studentId+date to symbol
type GradesState = {
  [studentId: number]: {
    [dateKey: string]: string
  }
};

function formatDateShort(date: Date): string {
  return `${date.getDate().toString().padStart(2, "0")}.${(date.getMonth() + 1).toString().padStart(2, "0")}`;
}

export const GroupTable = ({
  students,
  title,
  month,
  teacherName,
  recentlyAddedId,
  onDeleteStudent,
  dates,
  onChangeDates,
}: GroupTableProps) => {
  // Grades (not persisted)
  const [grades, setGrades] = useState<GradesState>({});

  // Notes (not persisted)
  const [notes, setNotes] = useState("");

  // Editing dates (by default, date fields not in edit mode)
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editDateValue, setEditDateValue] = useState("");

  const handleGradeClick = (
    studentId: number,
    dateKey: string,
    gradeValue: string
  ) => {
    setGrades((prev) => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || {}),
        [dateKey]: (prev[studentId]?.[dateKey] === gradeValue ? "" : gradeValue)
      }
    }));
  };

  // Date editing helpers
  const handleDateEdit = (idx: number) => {
    setEditIdx(idx);
    setEditDateValue(dates[idx].toISOString().split('T')[0]);
  };
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    setEditDateValue(e.target.value);
  };
  const handleDateSave = (idx: number) => {
    if (!editDateValue) {
      setEditIdx(null);
      return;
    }
    const newDateObj = new Date(editDateValue);
    if (isNaN(newDateObj.getTime())) {
      setEditIdx(null);
      return;
    }
    const newDates = [...dates];
    newDates[idx] = newDateObj;
    onChangeDates(newDates);
    setEditIdx(null);
  };
  const handleAddDate = () => {
    const today = new Date();
    onChangeDates([...dates, today]);
    setEditIdx(dates.length);
    setEditDateValue(today.toISOString().split('T')[0]);
  };
  const handleRemoveDate = (idx: number) => {
    const newDates = dates.filter((_, i) => i !== idx);
    onChangeDates(newDates);
    if (editIdx === idx) setEditIdx(null);
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
        <span className="text-sm text-[#8B5CF6] font-bold">{month}</span>
      </div>
      {/* Editable tracked dates at the top */}
      <div className="flex flex-wrap gap-2 items-center mb-3">
        <span className="font-medium text-gray-700 flex items-center gap-1">
          <CalendarDays className="w-4 h-4" /> Performance Dates:
        </span>
        {dates.map((date, idx) => (
          <div key={idx} className="flex items-center gap-1">
            {editIdx === idx ? (
              <>
                <input
                  type="date"
                  value={editDateValue}
                  onChange={e => handleDateChange(e, idx)}
                  className="border px-1 rounded"
                  style={{ width: 120 }}
                />
                <button className="text-green-600 text-xs font-bold" title="Save" onClick={() => handleDateSave(idx)}>Save</button>
                <button className="text-gray-400 ml-1 text-xs" title="Cancel" onClick={() => setEditIdx(null)}>✕</button>
              </>
            ) : (
              <>
                <button
                  className="text-base font-medium bg-gray-100 px-2 rounded hover:bg-[#E5DEFF] border border-gray-200"
                  onClick={() => handleDateEdit(idx)}
                  title="Edit date"
                >
                  {formatDateShort(date)}
                </button>
                <button className="text-red-300 hover:text-red-600 px-1" title="Remove date" onClick={() => handleRemoveDate(idx)}>&times;</button>
              </>
            )}
          </div>
        ))}
        <button
          className="ml-2 px-2 text-sm text-[#8B5CF6] hover:underline"
          onClick={handleAddDate}
          title="Add new date"
        >
          + Add
        </button>
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
                <TableHead className="font-semibold text-[#1A1F2C]/70 min-w-[170px]">Full Name / Class</TableHead>
                {dates.map((date, idx) => (
                  <TableHead key={idx} className="font-semibold text-[#1A1F2C]/70 text-center min-w-[110px]">{formatDateShort(date)}</TableHead>
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
                    <div className="flex flex-col">
                      <span>{student.name}</span>
                      <span className="text-xs text-gray-400">
                        {student.className ? `Class: ${student.className}` : ""}
                      </span>
                    </div>
                  </TableCell>
                  {dates.map((date, dateIdx) => (
                    <TableCell key={dateIdx} className="text-center">
                      <div className="flex gap-1 justify-center">
                        {gradeButtons.map(({ value, color, title: tooltip }) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() => handleGradeClick(student.id, date.toISOString(), value)}
                            className={`px-2 py-1 rounded-md border transition-all duration-100
                              ${
                                grades[student.id]?.[date.toISOString()] === value
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
                  ))}
                  <TableCell className="align-top">
                    <DeleteButton
                      onClick={() => onDeleteStudent(student.id)}
                      title="Delete student"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {/* Teacher's Notes section at bottom */}
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
