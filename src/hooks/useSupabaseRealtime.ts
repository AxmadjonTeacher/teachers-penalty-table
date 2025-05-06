
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { GradesState, saveGrades, saveDates, saveNotes } from '@/utils/gradeStorage';
import { useAuth } from '@/contexts/AuthContext';

type RealtimeOptions = {
  teacherId: string;
  groupTitle: string;
  dates: (Date | null)[];
  setDates: React.Dispatch<React.SetStateAction<(Date | null)[]>>;
  setGrades: React.Dispatch<React.SetStateAction<GradesState>>;
  setNotes: React.Dispatch<React.SetStateAction<string>>;
};

export const useSupabaseRealtime = ({
  teacherId,
  groupTitle,
  dates,
  setDates,
  setGrades,
  setNotes
}: RealtimeOptions) => {
  const { user } = useAuth();

  // Set up real-time subscription for changes
  useEffect(() => {
    if (!user) return;
    
    console.log('Setting up real-time subscription for data changes');
    
    // Subscribe to class_dates changes
    const datesChannel = supabase
      .channel('dates-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'class_dates',
          filter: `teacher_id=eq.${teacherId}` 
        }, 
        payload => {
          console.log('Real-time dates update received:', payload);
          if (payload.new && payload.new.group_name === groupTitle) {
            const newDates = payload.new.dates.map((dateStr: string | null) => 
              dateStr ? new Date(dateStr) : null
            );
            setDates(newDates);
            saveDates(teacherId, groupTitle, newDates);
          }
        }
      )
      .subscribe();
      
    // Subscribe to grades changes  
    const gradesChannel = supabase
      .channel('grades-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'grades' 
        }, 
        payload => {
          console.log('Real-time grades update received:', payload);
          // Full refresh of grades when changes are detected
          fetchGradesFromSupabase();
        }
      )
      .subscribe();
      
    // Subscribe to notes changes  
    const notesChannel = supabase
      .channel('notes-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'teacher_notes',
          filter: `teacher_id=eq.${teacherId}` 
        }, 
        payload => {
          console.log('Real-time notes update received:', payload);
          if (payload.new && payload.new.group_name === groupTitle) {
            setNotes(payload.new.notes);
            saveNotes(teacherId, groupTitle, payload.new.notes);
          }
        }
      )
      .subscribe();
    
    // Cleanup function
    return () => {
      supabase.removeChannel(datesChannel);
      supabase.removeChannel(gradesChannel);
      supabase.removeChannel(notesChannel);
    };
    
    // Helper function to fetch grades
    async function fetchGradesFromSupabase() {
      try {
        console.log(`Re-fetching grades from Supabase for teacher: ${teacherId}`);
        
        const { data, error } = await supabase
          .from('grades')
          .select('student_id, date, values')
          .order('date', { ascending: true });
          
        if (error) {
          console.error('Error fetching grades from Supabase:', error);
          return;
        }
        
        if (data && data.length > 0) {
          // Convert Supabase format back to our local format
          const newGrades: GradesState = {};
          
          data.forEach((grade: any) => {
            const studentId = grade.student_id;
            const dateString = grade.date;
            const dateObj = new Date(dateString);
            
            let dateIdx = dates.findIndex(d => 
              d && d.toISOString().split('T')[0] === dateObj.toISOString().split('T')[0]
            );
            
            if (dateIdx === -1) return;
            
            if (!newGrades[studentId]) {
              newGrades[studentId] = {};
            }
            
            newGrades[studentId][dateIdx] = grade.values;
          });
          
          if (Object.keys(newGrades).length > 0) {
            console.log('Updating grades from real-time update:', newGrades);
            setGrades(prevGrades => {
              const combinedGrades = { ...prevGrades };
              
              // Update with new grades
              for (const [studentId, studentDates] of Object.entries(newGrades)) {
                if (!combinedGrades[studentId]) {
                  combinedGrades[studentId] = {};
                }
                
                for (const [dateIdx, values] of Object.entries(studentDates)) {
                  combinedGrades[studentId][dateIdx] = values;
                }
              }
              
              // Save to localStorage
              saveGrades(teacherId, groupTitle, combinedGrades);
              return combinedGrades;
            });
          }
        }
      } catch (err) {
        console.error('Failed to fetch grades from real-time update:', err);
      }
    }
  }, [user, teacherId, groupTitle, dates, setDates, setGrades, setNotes]);

  return null;
};
