
import React, { useState } from "react";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StudentRow } from "./StudentRow";
import { DateHeader } from "./DateHeader";
import { TeacherNotes } from "./TeacherNotes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

  const handleDateChange = (idx: number, value: string) => {
    setDates(prev => {
      const newDates = [...prev];
      newDates[idx] = value ? new Date(value) : null;
      return newDates;
    });
  };

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
    <Card className="overflow-hidden border-[#E5DEFF] animate-fade-in shadow-md">
      <CardHeader className="bg-[#F1F0FB] pb-3 pt-4">
        <CardTitle className="text-xl font-semibold text-[#1A1F2C]">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {students.length === 0 ? (
          <p className="text-gray-400 italic text-center py-8 bg-white">
            No students in this group yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table className="border-collapse">
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-[#F1F0FB] to-[#F6F4FF]">
                  <TableHead className="font-semibold text-[#1A1F2C]/70 min-w-[200px] px-3 py-3 border-b">
                    Full Name / Class
                  </TableHead>
                  {[0,1,2].map(idx => (
                    <TableHead key={idx} className="p-0 min-w-[90px] border-b">
                      <DateHeader
                        date={dates[idx]}
                        onDateChange={val => handleDateChange(idx, val)}
                      />
                    </TableHead>
                  ))}
                  <TableHead className="px-1 py-1 w-[40px] border-b" />
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
            <div className="p-4 bg-white border-t border-gray-100">
              <TeacherNotes notes={notes} setNotes={setNotes} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
