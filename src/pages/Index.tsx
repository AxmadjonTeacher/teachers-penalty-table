import React, { useState, useEffect } from "react";
import { TeachersList } from "@/components/TeachersList";
import { TeacherForm } from "@/components/TeacherForm";
import { LoginButton } from "@/components/LoginButton";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Teacher {
  id: string;
  name: string;
}

const Index = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);
  const { isTeacher, user, ownedTeacherId, setOwnedTeacher, canManageTeacher } = useAuth();

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

  const handleDeleteTeacher = async (teacherId: string) => {
    if (!isTeacher()) {
      toast.error("You need teacher access to delete teachers");
      return;
    }
    
    try {
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
      
      // Remove from local state and localStorage
      setTeachers((prev) => prev.filter((teacher) => teacher.id !== teacherId));
      
      // Also delete any related student data
      const studentsKey = `students_${teacherId}`;
      localStorage.removeItem(studentsKey);
      
      // If this was the owned teacher, reset it
      if (teacherId === ownedTeacherId) {
        setOwnedTeacher(null);
      }
      
      toast.success("Teacher deleted successfully");
    } catch (error) {
      console.error('Error deleting teacher:', error);
      toast.error('Failed to delete teacher');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#8B5CF6]/10 to-white py-8 px-2 md:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col items-center gap-3 animate-fade-in">
          <div className="self-end">
            <LoginButton />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] via-[#7C3AED] to-[#6D28D9] tracking-tight drop-shadow">
            Monitoring App
          </h1>
          <p className="text-lg text-gray-600 text-center max-w-2xl">
            Monitor student participation and track penalties across different grade groups
          </p>
        </header>
        
        {user && isTeacher() && !ownedTeacherId && (
          <Card className="w-full animate-scale-in p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-[#8B5CF6]/20 hover:shadow-xl transition-all duration-300">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-2xl font-semibold text-[#1A1F2C] flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#8B5CF6]" />
                Add New Teacher
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <TeacherForm onAddTeacher={handleAddTeacher} />
            </CardContent>
          </Card>
        )}
        
        <main className="w-full space-y-8">
          <Card className="w-full bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-[#8B5CF6]/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-[#8B5CF6]" />
                Teachers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TeachersList 
                teachers={teachers} 
                onDeleteTeacher={handleDeleteTeacher}
              />
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Index;
