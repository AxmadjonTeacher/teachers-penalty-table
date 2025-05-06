
import React from 'react';
import { CardContent } from "@/components/ui/card";
import { SearchBar } from "../SearchBar";
import { TableContainer } from "./TableContainer";
import { TeacherNotes } from "../TeacherNotes";
import { GradesState } from "@/utils/gradeStorage";

interface Student {
  id: number;
  name: string;
  proficiencyLevel: string;
  className?: string;
}

interface GroupContentProps {
  students: Student[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
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
  onNameChange: (value: string) => void;
  onDeleteStudent: (id: number) => void;
  onGradeClick: (studentId: number, dateIdx: number, value: string) => void;
  notes: string;
  onNotesChange: (value: string) => void;
  title: string;
  canEdit: boolean;
}

export const GroupContent: React.FC<GroupContentProps> = ({
  students,
  searchQuery,
  setSearchQuery,
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
  onGradeClick,
  notes,
  onNotesChange,
  title,
  canEdit
}) => {
  return (
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
            onEditStart={onEditStart}
            onEditSave={onEditSave}
            onEditCancel={onEditCancel}
            onNameChange={onNameChange}
            onDeleteStudent={onDeleteStudent}
            onGradeClick={onGradeClick}
            canEdit={canEdit}
          />
          <div className="p-4 bg-white border border-[#E5DEFF] rounded-lg">
            <TeacherNotes 
              notes={notes} 
              setNotes={onNotesChange} 
              readOnly={!canEdit}
            />
          </div>
        </div>
      )}
    </CardContent>
  );
};
