
import { useState } from 'react';
import { toast } from 'sonner';
import { GradesState, saveGrades } from '@/utils/gradeStorage';

interface Student {
  id: number;
  name: string;
  proficiencyLevel: string;
  className?: string;
}

interface GroupTableHandlersOptions {
  teacherId: string;
  groupTitle: string;
  canEdit: boolean;
  grades: GradesState;
  setGrades: React.Dispatch<React.SetStateAction<GradesState>>;
  setNotes: React.Dispatch<React.SetStateAction<string>>;
}

export const useGroupTableHandlers = ({
  teacherId, 
  groupTitle,
  canEdit,
  grades,
  setGrades,
  setNotes
}: GroupTableHandlersOptions) => {
  const [editingNameId, setEditingNameId] = useState<number | null>(null);
  const [editingNameValue, setEditingNameValue] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleDateChange = (idx: number, value: string) => {
    if (!canEdit) return;
    
    console.log('Date change requested:', idx, value);
    return value ? new Date(value) : null;
  };

  const handleGradeClick = (
    studentId: number,
    dateIdx: number,
    value: string,
  ) => {
    if (!canEdit) return;
    
    console.log('Grade click:', studentId, dateIdx, value);
    setGrades(prev => {
      const st = prev[studentId] || {};
      const arr = new Set(st[dateIdx] || []);
      if (arr.has(value)) {
        arr.delete(value);
      } else {
        arr.add(value);
      }
      
      const newGrades = {
        ...prev,
        [studentId]: { ...st, [dateIdx]: Array.from(arr) },
      };
      
      // Ensure immediate saving to localStorage
      saveGrades(teacherId, groupTitle, newGrades);
      return newGrades;
    });
  };

  const startEdit = (id: number, name: string) => {
    if (!canEdit) return;
    
    setEditingNameId(id);
    setEditingNameValue(name);
  };
  
  const saveEdit = (id: number) => {
    if (!canEdit || !editingNameValue.trim()) return;
    return id;
  };
  
  const cancelEdit = () => {
    setEditingNameId(null);
    setEditingNameValue("");
  };

  const handleResetGrades = () => {
    if (!canEdit) return;
    
    console.log('Resetting grades...');
    const emptyGrades = {};
    setGrades(emptyGrades);
    // Ensure immediate saving to localStorage
    saveGrades(teacherId, groupTitle, emptyGrades);
    toast.success('Grades have been reset successfully');
  };

  const handleNotesChange = (newNotes: string) => {
    if (!canEdit) return;
    
    console.log('Notes changed:', newNotes);
    setNotes(newNotes);
  };

  const filterStudents = (students: Student[]) => {
    return students.filter(student => 
      student.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return {
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
  };
};
