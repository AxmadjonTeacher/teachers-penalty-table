
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Teacher {
  id: string;
  name: string;
}

export const useTeachers = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);

  // Load teachers from Supabase
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        // Try to fetch from Supabase
        const { data, error } = await supabase
          .from('teachers')
          .select('id, name, user_id');
          
        if (error) {
          throw error;
        }
        
        if (data) {
          console.log("Teachers fetched from Supabase:", data);
          
          // Filter out any teachers that were deleted in this session
          const filteredTeachers = data.filter(
            (teacher: any) => !deletedIds.includes(teacher.id)
          ) as Teacher[];
          
          setTeachers(filteredTeachers);
          return;
        }
      } catch (error) {
        console.error('Error fetching teachers from Supabase:', error);
        toast.error('Failed to fetch teachers');
      }
      
      // Fallback to localStorage if Supabase fetch fails
      const savedTeachers = localStorage.getItem("teachers");
      if (savedTeachers) {
        console.log("Teachers fetched from localStorage:", JSON.parse(savedTeachers));
        const localTeachers = JSON.parse(savedTeachers);
        // Filter out any deleted teachers
        const filteredTeachers = localTeachers.filter(
          (teacher: Teacher) => !deletedIds.includes(teacher.id)
        );
        setTeachers(filteredTeachers);
      }
    };
    
    fetchTeachers();
  }, [deletedIds]);

  // Save to localStorage as a backup
  useEffect(() => {
    localStorage.setItem("teachers", JSON.stringify(teachers));
    console.log("Teachers saved to localStorage:", teachers);
  }, [teachers]);

  const handleAddTeacher = async (name: string) => {
    
    try {
      // Add to Supabase
      const { data, error } = await supabase
        .from('teachers')
        .insert([{ name, user_id: null }])
        .select();
        
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        const newTeacher = data[0] as Teacher;
        setTeachers((prev) => [...prev, newTeacher]);
        setRecentlyAddedId(newTeacher.id);
        setTimeout(() => setRecentlyAddedId(null), 700);
        toast.success("Teacher added successfully!");
      }
    } catch (error) {
      console.error('Error adding teacher to Supabase:', error);
      toast.error('Failed to add teacher');
    }
  };

  const handleDeleteTeacher = useCallback(async (teacherId: string) => {
    try {
      console.log("Deleting teacher with ID:", teacherId);
      
      // Delete from Supabase
      const { error } = await supabase
        .from('teachers')
        .delete()
        .eq('id', teacherId);
        
      if (error) {
        throw error;
      }
      
      // Add to deleted IDs list to prevent re-fetching
      setDeletedIds(prev => [...prev, teacherId]);
      
      // Remove from local state
      setTeachers(prev => prev.filter(teacher => teacher.id !== teacherId));
      
      // Update localStorage
      const updatedTeachers = teachers.filter(teacher => teacher.id !== teacherId);
      localStorage.setItem("teachers", JSON.stringify(updatedTeachers));
      
      // Also delete any related student data
      const studentsKey = `students_${teacherId}`;
      localStorage.removeItem(studentsKey);
      
      
      toast.success("Teacher deleted successfully");
    } catch (error) {
      console.error('Error deleting teacher:', error);
      toast.error('Failed to delete teacher');
    }
  }, [teachers]);

  return {
    teachers,
    setTeachers,
    recentlyAddedId,
    handleAddTeacher,
    handleDeleteTeacher
  };
};
