
import { useEffect } from 'react';
import { GradesState, saveDates, saveGrades, saveNotes } from '@/utils/gradeStorage';

type LocalStorageOptions = {
  teacherId: string;
  groupTitle: string;
  dates: (Date | null)[];
  grades: GradesState;
  notes: string;
};

export const useLocalStorage = ({
  teacherId,
  groupTitle,
  dates,
  grades,
  notes
}: LocalStorageOptions) => {
  // Save dates to localStorage whenever they change
  useEffect(() => {
    console.log('Saving dates to localStorage:', dates);
    saveDates(teacherId, groupTitle, dates);
  }, [dates, teacherId, groupTitle]);
  
  // Save grades to localStorage whenever they change
  useEffect(() => {
    console.log('Saving grades to localStorage:', grades);
    saveGrades(teacherId, groupTitle, grades);
  }, [grades, teacherId, groupTitle]);
  
  // Save notes to localStorage whenever they change
  useEffect(() => {
    console.log('Saving notes to localStorage:', notes);
    saveNotes(teacherId, groupTitle, notes);
  }, [notes, teacherId, groupTitle]);

  return null;
};
