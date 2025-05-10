
import React from "react";
import { TeachersList } from "@/components/TeachersList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface Teacher {
  id: string;
  name: string;
}

interface TeachersSectionProps {
  teachers: Teacher[];
  setTeachers: React.Dispatch<React.SetStateAction<Teacher[]>>;
}

export const TeachersSection: React.FC<TeachersSectionProps> = ({ 
  teachers, 
  setTeachers 
}) => {
  const { isTeacher, user, setOwnedTeacher } = useAuth();

  const handleDeleteTeacher = async (teacherId: string) => {
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
  };

  return (
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
  );
};
