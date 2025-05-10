
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface Teacher {
  id: string;
  name: string;
}

export const useTeachers = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);
  const { user, isTeacher, ownedTeacherId, setOwnedTeacher } = useAuth();
  const [deletedIds, setDeletedIds] = useState<string[]>([]);

  // Load teachers from Supabase
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        if (user) {
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
            
            // If user is a teacher and doesn't have an owned teacher yet
            // Check if any of these teachers were created by them
            if (isTeacher() && !ownedTeacherId) {
              const userTeacher = filteredTeachers.find(
                (teacher: any) => teacher.user_id === user.id
              );
              
              if (userTeacher) {
                setOwnedTeacher(userTeacher.id);
              }
            }
            return;
          }
        } else {
          // Clear teachers if no user is logged in
          setTeachers([]);
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
  }, [user, isTeacher, ownedTeacherId, setOwnedTeacher, deletedIds]);

  // Save to localStorage as a backup
  useEffect(() => {
    localStorage.setItem("teachers", JSON.stringify(teachers));
    console.log("Teachers saved to localStorage:", teachers);
  }, [teachers]);

  const handleAddTeacher = async (name: string) => {
    if (!isTeacher()) {
      toast.error("You need teacher access to add new teachers");
      return;
    }
    
    if (!user) {
      // Fallback to localStorage if user is not logged in
      const newTeacher: Teacher = {
        id: Date.now().toString(),
        name,
      };
      setTeachers((prev) => [...prev, newTeacher]);
      setRecentlyAddedId(newTeacher.id);
      setTimeout(() => setRecentlyAddedId(null), 700);
      setOwnedTeacher(newTeacher.id);
      toast.success("Teacher added successfully!");
      return;
    }
    
    try {
      // Add to Supabase if user is logged in
      const { data, error } = await supabase
        .from('teachers')
        .insert([{ name, user_id: user.id }])
        .select();
        
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        const newTeacher = data[0] as Teacher;
        setTeachers((prev) => [...prev, newTeacher]);
        setRecentlyAddedId(newTeacher.id);
        setTimeout(() => setRecentlyAddedId(null), 700);
        setOwnedTeacher(newTeacher.id);
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
      
      // If connected to Supabase, delete from there first
      if (user) {
        const { error } = await supabase
          .from('teachers')
          .delete()
          .eq('id', teacherId);
          
        if (error) {
          throw error;
        }
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
      
      // Reset owned teacher if needed
      setOwnedTeacher(null);
      
      toast.success("Teacher deleted successfully");
    } catch (error) {
      console.error('Error deleting teacher:', error);
      toast.error('Failed to delete teacher');
    }
  }, [teachers, user, setOwnedTeacher]);

  return {
    teachers,
    setTeachers,
    recentlyAddedId,
    handleAddTeacher,
    handleDeleteTeacher
  };
};
