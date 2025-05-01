
import React from "react";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StudentRow } from "../StudentRow";
import { DateHeader } from "../DateHeader";
import { GradesState } from "@/utils/gradeStorage";

interface Student {
  id: number;
  name: string;
  proficiencyLevel: string;
  className?: string;
}

interface TableContainerProps {
  title: string;
  filteredStudents: Student[];
  dates: (Date | null)[];
  handleDateChange: (idx: number, value: string) => void;
  grades: GradesState;
  recentlyAddedId: number | null;
  editingNameId: number | null;
  editingNameValue: string;
  onEditStart: (id: number, name: string) => void;
  onEditSave: (id: number) => void;
  onEditCancel: () => void;
  onNameChange: (val: string) => void;
  onDeleteStudent: (id: number) => void;
  onGradeClick: (studentId: number, dateIdx: number, value: string) => void;
}

export const TableContainer: React.FC<TableContainerProps> = ({
  title,
  filteredStudents,
  dates,
  handleDateChange,
  grades,
  recentlyAddedId,
  editingNameId,
  editingNameValue,
  onEditStart,
  onEditSave,
  onEditCancel,
  onNameChange,
  onDeleteStudent,
  onGradeClick
}) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-[#E5DEFF]">
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
              onEditStart={onEditStart}
              onEditSave={onEditSave}
              onEditCancel={onEditCancel}
              onNameChange={onNameChange}
              onDelete={onDeleteStudent}
              onGradeClick={onGradeClick}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
