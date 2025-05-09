
import { useState, useEffect } from "react";
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
            setTeachers(data as Teacher[]);
            
            // If user is a teacher and doesn't have an owned teacher yet
            // Check if any of these teachers were created by them
            if (isTeacher() && !ownedTeacherId) {
              const userTeacher = data.find(
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
        setTeachers(JSON.parse(savedTeachers));
      }
    };
    
    fetchTeachers();
  }, [user, isTeacher, ownedTeacherId, setOwnedTeacher]);

  // Save to localStorage as a backup
  useEffect(() => {
    localStorage.setItem("teachers", JSON.stringify(teachers));
  }, [teachers]);

  const handleAddTeacher = async (name: string) => {
    if (!isTeacher()) {
      toast.error("You need teacher access to add new teachers");
      return;
    }
    
    // Check if the user already has a teacher
    if (ownedTeacherId) {
      toast.error("You already have a teacher record. Each user can only manage one teacher.");
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

  return {
    teachers,
    setTeachers,
    recentlyAddedId,
    handleAddTeacher
  };
};
