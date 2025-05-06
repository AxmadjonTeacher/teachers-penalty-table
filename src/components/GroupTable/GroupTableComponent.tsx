
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { GradesState, loadDates, loadGrades, loadNotes, saveDates, saveGrades, saveNotes } from "@/utils/gradeStorage";
import { SearchBar } from "../SearchBar";
import { TableContainer } from "./TableContainer";
import { TeacherNotes } from "../TeacherNotes";
import { ExportActions } from "./ExportActions";
import { ResetGradesDialog } from "./ResetGradesDialog";
import { supabase } from "@/integrations/supabase/client";

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
  const [editingNameId, setEditingNameId] = useState<number | null>(null);
  const [editingNameValue, setEditingNameValue] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const { isTeacher, user } = useAuth();
  
  // Save dates to localStorage whenever they change
  useEffect(() => {
    saveDates(teacherId, title, dates);
    
    // Sync to Supabase if user is logged in
    if (user) {
      console.log('Syncing dates to Supabase...');
      const formatDatesForSupabase = dates.map(date => date ? date.toISOString() : null);
      
      const syncDates = async () => {
        try {
          const { data, error } = await supabase
            .from('class_dates')
            .upsert({
              teacher_id: teacherId,
              group_name: title,
              dates: formatDatesForSupabase,
            }, {
              onConflict: 'teacher_id, group_name'
            })
            .select();
            
          if (error) {
            console.error('Error syncing dates to Supabase:', error);
          }
        } catch (err) {
          console.error('Failed to sync dates:', err);
        }
      };
      
      syncDates();
    }
  }, [dates, teacherId, title, user]);
  
  // Fetch dates from Supabase on component mount
  useEffect(() => {
    const fetchDatesFromSupabase = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('class_dates')
            .select('dates')
            .eq('teacher_id', teacherId)
            .eq('group_name', title)
            .maybeSingle();
            
          if (error) {
            console.error('Error fetching dates from Supabase:', error);
            return;
          }
          
          if (data && data.dates) {
            const parsedDates = data.dates.map((dateStr: string | null) => 
              dateStr ? new Date(dateStr) : null
            );
            if (parsedDates.length > 0) {
              setDates(parsedDates);
            }
          }
        } catch (err) {
          console.error('Failed to fetch dates from Supabase:', err);
        }
      }
    };
    
    fetchDatesFromSupabase();
  }, [teacherId, title, user]);
  
  // Save grades to localStorage whenever they change
  useEffect(() => {
    saveGrades(teacherId, title, grades);
    
    // Sync to Supabase if user is logged in
    if (user) {
      console.log('Syncing grades to Supabase...');
      
      const syncGrades = async () => {
        try {
          // Convert the grades object to an array format suitable for Supabase
          // For each student and date, create a record
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
            const { error } = await supabase
              .from('grades')
              .upsert(gradesToSync, {
                onConflict: 'student_id, date'
              });
              
            if (error) {
              console.error('Error syncing grades to Supabase:', error);
            }
          }
        } catch (err) {
          console.error('Failed to sync grades:', err);
        }
      };
      
      syncGrades();
    }
  }, [grades, teacherId, title, user, dates]);
  
  // Fetch grades from Supabase on component mount
  useEffect(() => {
    const fetchGradesFromSupabase = async () => {
      if (user) {
        try {
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
              setGrades(prevGrades => ({
                ...prevGrades,
                ...newGrades
              }));
            }
          }
        } catch (err) {
          console.error('Failed to fetch grades from Supabase:', err);
        }
      }
    };
    
    fetchGradesFromSupabase();
  }, [teacherId, title, user, dates]);
  
  // Save notes to localStorage whenever they change
  useEffect(() => {
    saveNotes(teacherId, title, notes);
    
    // Sync to Supabase if user is logged in
    if (user) {
      console.log('Syncing notes to Supabase...');
      
      const syncNotes = async () => {
        try {
          const { error } = await supabase
            .from('teacher_notes')
            .upsert({
              teacher_id: teacherId,
              group_name: title,
              notes: notes,
            }, {
              onConflict: 'teacher_id, group_name'
            });
            
          if (error) {
            console.error('Error syncing notes to Supabase:', error);
          }
        } catch (err) {
          console.error('Failed to sync notes:', err);
        }
      };
      
      syncNotes();
    }
  }, [notes, teacherId, title, user]);
  
  // Fetch notes from Supabase on component mount
  useEffect(() => {
    const fetchNotesFromSupabase = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('teacher_notes')
            .select('notes')
            .eq('teacher_id', teacherId)
            .eq('group_name', title)
            .maybeSingle();
            
          if (error) {
            console.error('Error fetching notes from Supabase:', error);
            return;
          }
          
          if (data && data.notes) {
            setNotes(data.notes);
          }
        } catch (err) {
          console.error('Failed to fetch notes from Supabase:', err);
        }
      }
    };
    
    fetchNotesFromSupabase();
  }, [teacherId, title, user]);

  const handleDateChange = (idx: number, value: string) => {
    if (!canEdit) return;
    
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
    if (!canEdit) return;
    
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
      saveGrades(teacherId, title, newGrades);
      return newGrades;
    });
  };

  const startEdit = (id: number, name: string) => {
    if (!canEdit) return;
    
    setEditingNameId(id);
    setEditingNameValue(name);
  };
  
  const saveEdit = (id: number) => {
    if (!canEdit) return;
    
    onEditStudentName(id, editingNameValue.trim());
    setEditingNameId(null);
  };
  
  const cancelEdit = () => {
    setEditingNameId(null);
    setEditingNameValue("");
  };

  const handleResetGrades = () => {
    if (!canEdit) return;
    
    const emptyGrades = {};
    setGrades(emptyGrades);
    // Ensure immediate saving to localStorage
    saveGrades(teacherId, title, emptyGrades);
  };

  const handleNotesChange = (newNotes: string) => {
    if (!canEdit) return;
    
    setNotes(newNotes);
    // Ensure immediate saving to localStorage
    saveNotes(teacherId, title, newNotes);
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
            {isTeacher() && canEdit && (
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
              canEdit={canEdit}
            />
            <div className="p-4 bg-white border border-[#E5DEFF] rounded-lg">
              <TeacherNotes 
                notes={notes} 
                setNotes={handleNotesChange} 
                readOnly={!canEdit}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
