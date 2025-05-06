
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { GradesState, saveDates, saveGrades, saveNotes } from '@/utils/gradeStorage';
import { useAuth } from '@/contexts/AuthContext';

type FetchOptions = {
  teacherId: string;
  groupTitle: string;
  dates: (Date | null)[];
  setDates: React.Dispatch<React.SetStateAction<(Date | null)[]>>;
  setGrades: React.Dispatch<React.SetStateAction<GradesState>>;
  setNotes: React.Dispatch<React.SetStateAction<string>>;
};

export const useSupabaseFetch = ({
  teacherId,
  groupTitle,
  dates,
  setDates,
  setGrades,
  setNotes
}: FetchOptions) => {
  const { user } = useAuth();

  // Fetch dates from Supabase
  useEffect(() => {
    const fetchDatesFromSupabase = async () => {
      if (user) {
        try {
          console.log(`Fetching dates from Supabase for teacher: ${teacherId}, group: ${groupTitle}`);
          const { data, error } = await supabase
            .from('class_dates')
            .select('dates')
            .eq('teacher_id', teacherId)
            .eq('group_name', groupTitle)
            .maybeSingle();
            
          if (error) {
            console.error('Error fetching dates from Supabase:', error);
            return;
          }
          
          if (data && data.dates) {
            console.log('Received dates from Supabase:', data.dates);
            const parsedDates = data.dates.map((dateStr: string | null) => 
              dateStr ? new Date(dateStr) : null
            );
            if (parsedDates.length > 0) {
              console.log('Setting dates from Supabase:', parsedDates);
              setDates(parsedDates);
              saveDates(teacherId, groupTitle, parsedDates);
            }
          }
        } catch (err) {
          console.error('Failed to fetch dates from Supabase:', err);
        }
      }
    };
    
    fetchDatesFromSupabase();
  }, [teacherId, groupTitle, user, setDates]);

  // Fetch grades from Supabase
  useEffect(() => {
    const fetchGradesFromSupabase = async () => {
      if (user) {
        try {
          console.log(`Fetching grades from Supabase for teacher: ${teacherId}`);
          
          // Fetch all grades for this teacher's students
          const { data, error } = await supabase
            .from('grades')
            .select('student_id, date, values')
            .order('date', { ascending: true });
            
          if (error) {
            console.error('Error fetching grades from Supabase:', error);
            return;
          }
          
          if (data && data.length > 0) {
            console.log('Received grades from Supabase:', data);
            
            // Convert Supabase format back to our local format
            const newGrades: GradesState = {};
            
            data.forEach((grade: any) => {
              const studentId = grade.student_id;
              // Find which date index this corresponds to
              const dateString = grade.date;
              const dateObj = new Date(dateString);
              
              let dateIdx = dates.findIndex(d => 
                d && d.toISOString().split('T')[0] === dateObj.toISOString().split('T')[0]
              );
              
              if (dateIdx === -1) {
                // If date not found, skip this grade
                return;
              }
              
              if (!newGrades[studentId]) {
                newGrades[studentId] = {};
              }
              
              newGrades[studentId][dateIdx] = grade.values;
            });
            
            // Only update if we have new data
            if (Object.keys(newGrades).length > 0) {
              console.log('Setting grades from Supabase:', newGrades);
              setGrades(prevGrades => ({
                ...prevGrades,
                ...newGrades
              }));
              saveGrades(teacherId, groupTitle, newGrades);
            }
          }
        } catch (err) {
          console.error('Failed to fetch grades from Supabase:', err);
        }
      }
    };
    
    fetchGradesFromSupabase();
  }, [teacherId, groupTitle, user, dates, setGrades]);

  // Fetch notes from Supabase
  useEffect(() => {
    const fetchNotesFromSupabase = async () => {
      if (user) {
        try {
          console.log(`Fetching notes from Supabase for teacher: ${teacherId}, group: ${groupTitle}`);
          const { data, error } = await supabase
            .from('teacher_notes')
            .select('notes')
            .eq('teacher_id', teacherId)
            .eq('group_name', groupTitle)
            .maybeSingle();
            
          if (error) {
            console.error('Error fetching notes from Supabase:', error);
            return;
          }
          
          if (data && data.notes) {
            console.log('Received notes from Supabase:', data.notes);
            setNotes(data.notes);
            saveNotes(teacherId, groupTitle, data.notes);
          }
        } catch (err) {
          console.error('Failed to fetch notes from Supabase:', err);
        }
      }
    };
    
    fetchNotesFromSupabase();
  }, [teacherId, groupTitle, user, setNotes]);

  return null;
};
