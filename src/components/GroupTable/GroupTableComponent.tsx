
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { GradesState, loadDates, loadGrades, loadNotes } from "@/utils/gradeStorage";
import { GroupHeader } from "./GroupHeader";
import { GroupContent } from "./GroupContent";
import { toast } from "sonner";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useSupabaseSync } from "@/hooks/useSupabaseSync";
import { useSupabaseFetch } from "@/hooks/useSupabaseFetch";
import { useSupabaseRealtime } from "@/hooks/useSupabaseRealtime";
import { useGroupTableHandlers } from "./useGroupTableHandlers";

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
  canEdit?: boolean;
}

export const GroupTableComponent: React.FC<GroupTableProps> = ({
  students,
  title,
  teacherName,
  teacherId,
  recentlyAddedId,
  onDeleteStudent,
  onEditStudentName,
  canEdit = false,
}) => {
  // Load initial state from localStorage
  const [dates, setDates] = useState<(Date | null)[]>(loadDates(teacherId, title));
  const [grades, setGrades] = useState<GradesState>(loadGrades(teacherId, title));
  const [notes, setNotes] = useState<string>(loadNotes(teacherId, title));

  // Set up localStorage persistence
  useLocalStorage({
    teacherId,
    groupTitle: title,
    dates,
    grades,
    notes
  });

  // Set up Supabase sync
  useSupabaseSync({
    teacherId,
    groupTitle: title,
    dates,
    grades,
    notes,
    setDates,
    setGrades,
    setNotes
  });

  // Fetch data from Supabase
  useSupabaseFetch({
    teacherId,
    groupTitle: title,
    dates,
    setDates,
    setGrades,
    setNotes
  });

  // Set up real-time subscriptions
  useSupabaseRealtime({
    teacherId,
    groupTitle: title,
    dates,
    setDates,
    setGrades,
    setNotes
  });

  // Set up event handlers
  const {
    editingNameId,
    editingNameValue,
    searchQuery,
    setSearchQuery,
    handleDateChange,
    handleGradeClick,
    startEdit,
    saveEdit,
    cancelEdit,
    handleResetGrades,
    handleNotesChange,
    filterStudents,
    setEditingNameValue
  } = useGroupTableHandlers({
    teacherId,
    groupTitle: title,
    canEdit,
    grades,
    setGrades,
    setNotes
  });

  // Filter students based on search query
  const filteredStudents = filterStudents(students);

  // Event handler wrappers
  const onDateChange = (idx: number, value: string) => {
    const newDate = handleDateChange(idx, value);
    if (newDate !== undefined) {
      setDates(prev => {
        const newDates = [...prev];
        newDates[idx] = newDate;
        return newDates;
      });
    }
  };

  const onEditSave = (id: number) => {
    if (editingNameValue.trim()) {
      onEditStudentName(id, editingNameValue.trim());
      cancelEdit();
    } else {
      toast.error("Student name cannot be empty");
    }
  };

  return (
    <Card className="overflow-hidden border-[#E5DEFF] animate-fade-in shadow-lg rounded-xl">
      <GroupHeader
        title={title}
        students={students}
        dates={dates}
        grades={grades}
        canEdit={canEdit}
        onReset={handleResetGrades}
      />
      <GroupContent
        students={students}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filteredStudents={filteredStudents}
        dates={dates}
        handleDateChange={onDateChange}
        grades={grades}
        recentlyAddedId={recentlyAddedId}
        editingNameId={editingNameId}
        editingNameValue={editingNameValue}
        onEditStart={startEdit}
        onEditSave={onEditSave}
        onEditCancel={cancelEdit}
        onNameChange={setEditingNameValue}
        onDeleteStudent={onDeleteStudent}
        onGradeClick={handleGradeClick}
        notes={notes}
        onNotesChange={handleNotesChange}
        title={title}
        canEdit={canEdit}
      />
    </Card>
  );
};
