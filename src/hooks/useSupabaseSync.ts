
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { GradesState } from '@/utils/gradeStorage';
import { useAuth } from '@/contexts/AuthContext';

type SyncOptions = {
  teacherId: string;
  groupTitle: string;
  dates: (Date | null)[];
  grades: GradesState;
  notes: string;
  setDates: React.Dispatch<React.SetStateAction<(Date | null)[]>>;
  setGrades: React.Dispatch<React.SetStateAction<GradesState>>;
  setNotes: React.Dispatch<React.SetStateAction<string>>;
};

export const useSupabaseSync = ({
  teacherId,
  groupTitle,
  dates,
  grades,
  notes,
  setDates,
  setGrades,
  setNotes
}: SyncOptions) => {
  const { user } = useAuth();

  // Save dates to Supabase
  useEffect(() => {
    if (!user) return;
    
    console.log('Syncing dates to Supabase...');
    const formatDatesForSupabase = dates.map(date => date ? date.toISOString() : null);
    
    const syncDates = async () => {
      try {
        const { error } = await supabase
          .from('class_dates')
          .upsert({
            teacher_id: teacherId,
            group_name: groupTitle,
            dates: formatDatesForSupabase,
          }, {
            onConflict: 'teacher_id, group_name'
          });
          
        if (error) {
          console.error('Error syncing dates to Supabase:', error);
          toast.error('Failed to sync dates with the server');
        } else {
          console.log('Dates synced successfully');
        }
      } catch (err) {
        console.error('Failed to sync dates:', err);
        toast.error('Failed to sync dates with the server');
      }
    };
    
    syncDates();
  }, [dates, teacherId, groupTitle, user]);

  // Save grades to Supabase
  useEffect(() => {
    if (!user) return;
    
    console.log('Syncing grades to Supabase...');
    
    const syncGrades = async () => {
      try {
        // Convert the grades object to an array format suitable for Supabase
        const gradesToSync = [];
        
        for (const [studentId, studentDates] of Object.entries(grades)) {
          for (const [dateIdx, gradeValues] of Object.entries(studentDates)) {
            if (dates[parseInt(dateIdx)] && gradeValues.length > 0) {
              gradesToSync.push({
                student_id: studentId,
                date: dates[parseInt(dateIdx)]?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
                values: gradeValues,
              });
            }
          }
        }
        
        if (gradesToSync.length > 0) {
          console.log('Grades to sync:', gradesToSync);
          const { error } = await supabase
            .from('grades')
            .upsert(gradesToSync, {
              onConflict: 'student_id, date'
            });
            
          if (error) {
            console.error('Error syncing grades to Supabase:', error);
            toast.error('Failed to sync grades with the server');
          } else {
            console.log('Grades synced successfully');
          }
        }
      } catch (err) {
        console.error('Failed to sync grades:', err);
        toast.error('Failed to sync grades with the server');
      }
    };
    
    syncGrades();
  }, [grades, teacherId, groupTitle, user, dates]);

  // Save notes to Supabase
  useEffect(() => {
    if (!user) return;
    
    console.log('Syncing notes to Supabase...');
    
    const syncNotes = async () => {
      try {
        const { error } = await supabase
          .from('teacher_notes')
          .upsert({
            teacher_id: teacherId,
            group_name: groupTitle,
            notes: notes,
          }, {
            onConflict: 'teacher_id, group_name'
          });
          
        if (error) {
          console.error('Error syncing notes to Supabase:', error);
          toast.error('Failed to sync notes with the server');
        } else {
          console.log('Notes synced successfully');
        }
      } catch (err) {
        console.error('Failed to sync notes:', err);
        toast.error('Failed to sync notes with the server');
      }
    };
    
    syncNotes();
  }, [notes, teacherId, groupTitle, user]);

  return null;
};
