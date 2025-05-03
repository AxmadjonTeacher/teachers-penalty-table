
import React, { useState, useEffect } from "react";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StudentRow } from "./StudentRow";
import { DateHeader } from "./DateHeader";
import { TeacherNotes } from "./TeacherNotes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SearchBar } from "./SearchBar";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { FileSpreadsheet, FileText } from "lucide-react";
import { jsPDF } from "jspdf";
import * as XLSX from 'xlsx';
import { GradesState, loadDates, loadGrades, loadNotes, saveDates, saveGrades, saveNotes } from "@/utils/gradeStorage";

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

export const GroupTable = ({
  students,
  title,
  teacherName,
  teacherId,
  recentlyAddedId,
  onDeleteStudent,
  onEditStudentName,
}: GroupTableProps) => {
  // Load initial state from localStorage
  const [dates, setDates] = useState<(Date | null)[]>(loadDates(teacherId, title));
  const [grades, setGrades] = useState<GradesState>(loadGrades(teacherId, title));
  const [notes, setNotes] = useState<string>(loadNotes(teacherId, title));
  const [editingNameId, setEditingNameId] = useState<number | null>(null);
  const [editingNameValue, setEditingNameValue] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const { isTeacher } = useAuth();
  const isMobile = useIsMobile();
  
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
    toast.success("All grades have been reset");
  };

  const exportToPDF = () => {
    const pdf = new jsPDF();
    const table = document.getElementById(`table-${title}`);
    if (!table) return;
    
    pdf.text(title, 20, 10);
    
    let yPos = 30;
    students.forEach((student) => {
      const studentText = `${student.name} - ${
        Object.entries(grades[student.id] || {})
          .map(([dateIdx, gradeArr]) => `${dates[Number(dateIdx)]?.toLocaleDateString() || 'N/A'}: ${gradeArr.join(', ')}`)
          .join(' | ')
      }`;
      pdf.text(studentText, 20, yPos);
      yPos += 10;
    });
    
    pdf.save(`${title}-grades.pdf`);
    toast.success("PDF exported successfully");
  };

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    
    const data = students.map(student => ({
      Name: student.name,
      Class: student.className || 'N/A',
      ...Object.entries(grades[student.id] || {}).reduce((acc, [dateIdx, gradeArr]) => ({
        ...acc,
        [`${dates[Number(dateIdx)]?.toLocaleDateString() || 'N/A'}`]: gradeArr.join(', ')
      }), {})
    }));
    
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, title);
    XLSX.writeFile(wb, `${title}-grades.xlsx`);
    toast.success("Excel file exported successfully");
  };

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="overflow-hidden border-[#E5DEFF] animate-fade-in shadow-lg rounded-xl">
      <CardHeader className={`bg-[#F1F0FB] pb-3 pt-4 ${isMobile ? 'px-3' : ''}`}>
        <div className={`flex ${isMobile ? 'flex-col gap-3' : 'justify-between items-center'}`}>
          <CardTitle className="text-xl font-semibold text-[#1A1F2C]">
            {title}
          </CardTitle>
          <div className={`flex ${isMobile ? 'w-full justify-between' : 'gap-2'}`}>
            <Button
              variant="outline"
              size={isMobile ? "sm" : "default"}
              onClick={exportToPDF}
              className="gap-1"
            >
              <FileText className="h-4 w-4" />
              {!isMobile && "PDF"}
            </Button>
            <Button
              variant="outline"
              size={isMobile ? "sm" : "default"}
              onClick={exportToExcel}
              className="gap-1"
            >
              <FileSpreadsheet className="h-4 w-4" />
              {!isMobile && "Excel"}
            </Button>
            {isTeacher() && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="destructive" 
                    size={isMobile ? "sm" : "default"}
                  >
                    Reset
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action will reset all grades while keeping student names. This cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleResetGrades}>
                      Reset Grades
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className={`p-4 ${isMobile ? 'px-2' : ''}`}>
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
            <div className="overflow-x-auto rounded-lg border border-[#E5DEFF] -mx-2 md:mx-0">
              <div className="min-w-[600px]"> {/* Ensure minimum width for small screens */}
                <Table id={`table-${title}`}>
                  <TableHeader className="sticky top-0 z-30 w-full">
                    <TableRow className="bg-gradient-to-r from-[#F1F0FB] to-[#F6F4FF] hover:bg-[#F1F0FB]/80">
                      <TableHead className="sticky left-0 z-20 font-semibold text-[#1A1F2C]/70 min-w-[200px] px-3 py-4 border-b bg-[#F1F0FB]">
                        Full Name / Class
                      </TableHead>
                      {dates.map((_, idx) => (
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
                    {filteredStudents.map((student, idx) => (
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
              </div>
              {isMobile && (
                <div className="bg-[#F1F0FB]/70 p-2 text-xs text-center">
                  Scroll horizontally to view all data
                </div>
              )}
            </div>
            <div className={`p-4 bg-white border border-[#E5DEFF] rounded-lg ${isMobile ? 'px-3' : ''}`}>
              <TeacherNotes notes={notes} setNotes={setNotes} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
