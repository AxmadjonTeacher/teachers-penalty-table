
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { GroupTableComponent } from "@/components/GroupTable/GroupTableComponent";
import { StudentForm } from "@/components/StudentForm";
import { GradeLegend } from "@/components/GradeLegend";
import { toast } from "sonner";
import { ChevronLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Student {
  id: number;
  name: string;
  proficiencyLevel: string;
  className?: string;
}

interface Teacher {
  id: string;
  name: string;
}

const TeacherPage = () => {
  const { teacherId } = useParams<{ teacherId: string }>();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [recentlyAddedId, setRecentlyAddedId] = useState<number | null>(null);

  // Load teacher data
  useEffect(() => {
    const fetchTeacher = async () => {
      if (!teacherId) return;
      
      try {
        // Try to fetch from Supabase first
        const { data, error } = await supabase
          .from('teachers')
          .select('id, name, user_id')
          .eq('id', teacherId)
          .single();
          
        if (error) {
          console.error('Error fetching teacher:', error);
        } else if (data) {
          setTeacher(data);
          return;
        }
        
        // Fallback to localStorage
        const savedTeachers = localStorage.getItem("teachers");
        if (savedTeachers) {
          const teachersList = JSON.parse(savedTeachers);
          const currentTeacher = teachersList.find((t: Teacher) => t.id === teacherId);
          setTeacher(currentTeacher || null);
        }
      } catch (err) {
        console.error('Failed to fetch teacher:', err);
      }
    };
    
    fetchTeacher();
  }, [teacherId]);

  // Load students
  useEffect(() => {
    const fetchStudents = async () => {
      if (!teacherId) return;
      
      try {
        // Try to fetch from Supabase first
        const { data, error } = await supabase
          .from('students')
          .select('*')
          .eq('teacher_id', teacherId);
          
        if (error) {
          console.error('Error fetching students:', error);
        } else if (data && data.length > 0) {
          // Convert Supabase format to our format
          const formattedStudents = data.map(student => ({
            id: parseInt(student.id),
            name: student.name,
            proficiencyLevel: student.proficiency_level,
            className: student.class_name
          }));
          
          setStudents(formattedStudents);
          return;
        }
        
        // Fallback to localStorage
        const savedStudents = localStorage.getItem(`students_${teacherId}`);
        if (savedStudents) {
          setStudents(JSON.parse(savedStudents));
        }
      } catch (err) {
        console.error('Failed to fetch students:', err);
      }
    };
    
    fetchStudents();
    
    // Set up real-time subscription for students
    if (teacherId) {
      const studentsChannel = supabase
        .channel('students-changes')
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'students',
            filter: `teacher_id=eq.${teacherId}` 
          }, 
          () => {
            console.log('Students changed, refreshing data');
            fetchStudents();
          }
        )
        .subscribe();
        
      return () => {
        supabase.removeChannel(studentsChannel);
      };
    }
  }, [teacherId]);

  // Save students data
  useEffect(() => {
    if (students.length > 0 && teacherId) {
      localStorage.setItem(`students_${teacherId}`, JSON.stringify(students));
    }
  }, [students, teacherId]);


  const handleAddStudent = async (name: string, proficiencyLevel: string, className?: string) => {
    
    try {
      const newStudentId = Date.now();
      const newStudent: Student = {
        id: newStudentId,
        name,
        proficiencyLevel,
        className: className || "",
      };
      
      // Add to Supabase
      if (teacherId) {
        const { error } = await supabase
          .from('students')
          .insert({
            id: newStudentId.toString(),
            name,
            proficiency_level: proficiencyLevel,
            class_name: className || "",
            teacher_id: teacherId
          });
          
        if (error) {
          console.error('Error adding student to Supabase:', error);
          toast.error("Failed to add student to database");
          return;
        }
      }
      
      // Update local state
      setStudents((prev) => [...prev, newStudent]);
      setRecentlyAddedId(newStudent.id);
      setTimeout(() => setRecentlyAddedId(null), 700);
      toast.success("Student added successfully!");
    } catch (err) {
      console.error('Failed to add student:', err);
      toast.error("Failed to add student");
    }
  };

  const handleDeleteStudent = async (id: number) => {
    
    try {
      // Delete from Supabase
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id.toString());
        
      if (error) {
        console.error('Error deleting student from Supabase:', error);
        toast.error("Failed to delete student from database");
        return;
      }
      
      // Update local state
      setStudents((prev) => prev.filter((stu) => stu.id !== id));
      toast.success("Student removed.");
    } catch (err) {
      console.error('Failed to delete student:', err);
      toast.error("Failed to delete student");
    }
  };

  const handleEditStudentName = async (id: number, newName: string) => {
    
    try {
      // Update in Supabase
      const { error } = await supabase
        .from('students')
        .update({ name: newName })
        .eq('id', id.toString());
        
      if (error) {
        console.error('Error updating student name in Supabase:', error);
        toast.error("Failed to update student name in database");
        return;
      }
      
      // Update local state
      setStudents((prev) =>
        prev.map((stu) => (stu.id === id ? { ...stu, name: newName } : stu))
      );
    } catch (err) {
      console.error('Failed to update student name:', err);
      toast.error("Failed to update student name");
    }
  };

  // If teacher not found, render error message
  if (!teacher) {
    return (
      <div className="p-8 text-center">
        <p className="mb-4">Teacher not found</p>
        <Button asChild>
          <Link to="/">Go Home</Link>
        </Button>
      </div>
    );
  }

  const grades56Group = students.filter(
    (student) => student.proficiencyLevel === "Grades 5-6"
  );
  const grades78Group = students.filter(
    (student) => student.proficiencyLevel === "Grades 7-8"
  );
  const grades911Group = students.filter(
    (student) => student.proficiencyLevel === "Grades 9-11"
  );

  const groups = [
    { title: "Grades 5-6", value: "grades-5-6", students: grades56Group },
    { title: "Grades 7-8", value: "grades-7-8", students: grades78Group },
    { title: "Grades 9-11", value: "grades-9-11", students: grades911Group }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#8B5CF6]/10 to-white py-8 px-2 md:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm shadow-sm rounded-b-xl py-4">
          <div className="flex flex-col items-center gap-3 animate-fade-in">
            <div className="self-start w-full flex justify-between px-4">
              <Link to="/">
                <Button variant="outline" className="gap-1">
                  <ChevronLeft className="h-4 w-4" /> Back to Teachers
                </Button>
              </Link>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] via-[#7C3AED] to-[#6D28D9] tracking-tight drop-shadow">
              Monitoring App
            </h1>
            <h2 className="text-2xl font-bold text-[#1A1F2C] mb-4">
              {teacher.name}'s Groups
            </h2>
          </div>
        </header>
        
        <aside className="w-full animate-scale-in p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-[#8B5CF6]/20 hover:shadow-xl transition-all duration-300">
          <h2 className="text-2xl font-semibold mb-6 text-[#1A1F2C] flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#8B5CF6]" />
            Add New Student
          </h2>
          <StudentForm onAddStudent={handleAddStudent} />
        </aside>
        
        <main className="w-full space-y-8">
          <Tabs defaultValue="grades-5-6" className="w-full">
            <TabsList className="sticky top-[140px] z-40 w-full mb-6 bg-white/70 p-1 shadow-sm">
              {groups.map(group => (
                <TabsTrigger 
                  key={group.value} 
                  value={group.value}
                  className="flex-1 py-3 data-[state=active]:bg-[#8B5CF6]/10 data-[state=active]:text-[#8B5CF6] data-[state=active]:shadow-md"
                >
                  {group.title}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {groups.map(group => (
              <TabsContent key={group.value} value={group.value} className="mt-0">
                <GroupTableComponent
                  title={group.title}
                  students={group.students}
                  teacherName={teacher.name}
                  teacherId={teacherId || ''} 
                  recentlyAddedId={recentlyAddedId}
                  onDeleteStudent={handleDeleteStudent}
                  onEditStudentName={handleEditStudentName}
                  canEdit={true}
                />
              </TabsContent>
            ))}
          </Tabs>
        </main>
        
        <GradeLegend />
      </div>
    </div>
  );
};

export default TeacherPage;
