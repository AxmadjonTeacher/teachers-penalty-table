
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { GradesState, loadDates, loadGrades, loadNotes, saveDates, saveGrades, saveNotes } from "@/utils/gradeStorage";
import { SearchBar } from "../SearchBar";
import { TableContainer } from "./TableContainer";
import { TeacherNotes } from "../TeacherNotes";
import { ExportActions } from "./ExportActions";
import { ResetGradesDialog } from "./ResetGradesDialog";

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
  teacherId: string;
  recentlyAddedId: number | null;
  onDeleteStudent: (id: number) => void;
  onEditStudentName: (id: number, newName: string) => void;
}

export const GroupTableComponent: React.FC<GroupTableProps> = ({
  students,
  title,
  teacherName,
  teacherId,
  recentlyAddedId,
  onDeleteStudent,
  onEditStudentName,
}) => {
  // Load initial state from localStorage
  const [dates, setDates] = useState<(Date | null)[]>(loadDates(teacherId, title));
  const [grades, setGrades] = useState<GradesState>(loadGrades(teacherId, title));
  const [notes, setNotes] = useState<string>(loadNotes(teacherId, title));
  const [editingNameId, setEditingNameId] = useState<number | null>(null);
  const [editingNameValue, setEditingNameValue] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const { isTeacher } = useAuth();
  
  // Save dates to localStorage whenever they change
  useEffect(() => {
    saveDates(teacherId, title, dates);
  }, [dates, teacherId, title]);
  
  // Save grades to localStorage whenever they change
  useEffect(() => {
    saveGrades(teacherId, title, grades);
  }, [grades, teacherId, title]);
  
  // Save notes to localStorage whenever they change
  useEffect(() => {
    saveNotes(teacherId, title, notes);
  }, [notes, teacherId, title]);

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

  const handleResetGrades = () => {
    setGrades({});
  };

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="overflow-hidden border-[#E5DEFF] animate-fade-in shadow-lg rounded-xl">
      <CardHeader className="bg-[#F1F0FB] pb-3 pt-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold text-[#1A1F2C]">
            {title}
          </CardTitle>
          <div className="flex gap-2">
            <ExportActions 
              title={title} 
              students={students} 
              dates={dates} 
              grades={grades} 
            />
            {isTeacher() && (
              <ResetGradesDialog onReset={handleResetGrades} />
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {students.length === 0 ? (
          <p className="text-gray-400 italic text-center py-8 bg-white">
            No students in this group yet.
          </p>
        ) : (
          <div className="space-y-4">
            <SearchBar 
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search students by name..."
            />
            <TableContainer 
              title={title}
              filteredStudents={filteredStudents}
              dates={dates}
              handleDateChange={handleDateChange}
              grades={grades}
              recentlyAddedId={recentlyAddedId}
              editingNameId={editingNameId}
              editingNameValue={editingNameValue}
              onEditStart={startEdit}
              onEditSave={saveEdit}
              onEditCancel={cancelEdit}
              onNameChange={setEditingNameValue}
              onDeleteStudent={onDeleteStudent}
              onGradeClick={handleGradeClick}
            />
            <div className="p-4 bg-white border border-[#E5DEFF] rounded-lg">
              <TeacherNotes notes={notes} setNotes={setNotes} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
