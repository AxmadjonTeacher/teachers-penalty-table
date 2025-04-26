
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { GroupTable } from "@/components/GroupTable";
import { StudentForm } from "@/components/StudentForm";
import { GradeLegend } from "@/components/GradeLegend";
import { toast } from "sonner";
import { ChevronLeft } from "lucide-react";

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
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [recentlyAddedId, setRecentlyAddedId] = useState<number | null>(null);

  useEffect(() => {
    const savedTeachers = localStorage.getItem("teachers");
    if (savedTeachers) {
      const teachersList = JSON.parse(savedTeachers);
      const currentTeacher = teachersList.find((t: Teacher) => t.id === teacherId);
      setTeacher(currentTeacher || null);
    }
    
    const savedStudents = localStorage.getItem(`students_${teacherId}`);
    if (savedStudents) {
      setStudents(JSON.parse(savedStudents));
    }
  }, [teacherId]);

  useEffect(() => {
    if (students.length > 0) {
      localStorage.setItem(`students_${teacherId}`, JSON.stringify(students));
    }
  }, [students, teacherId]);

  const handleAddStudent = (name: string, proficiencyLevel: string, className?: string) => {
    const newStudent: Student = {
      id: Date.now(),
      name,
      proficiencyLevel,
      className: className || "",
    };
    setStudents((prev) => [...prev, newStudent]);
    setRecentlyAddedId(newStudent.id);
    setTimeout(() => setRecentlyAddedId(null), 700);
    toast.success("Student added successfully!");
  };

  const handleDeleteStudent = (id: number) => {
    setStudents((prev) => prev.filter((stu) => stu.id !== id));
    toast.success("Student removed.");
  };

  const handleEditStudentName = (id: number, newName: string) => {
    setStudents((prev) =>
      prev.map((stu) => (stu.id === id ? { ...stu, name: newName } : stu))
    );
  };

  // Groups
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#8B5CF6]/10 to-white py-8 px-2 md:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm shadow-sm rounded-b-xl py-4">
          <div className="flex flex-col items-center gap-3 animate-fade-in">
            <Link to="/" className="self-start absolute left-4 top-4">
              <Button variant="outline" className="mb-4 gap-1">
                <ChevronLeft className="h-4 w-4" /> Back to Teachers
              </Button>
            </Link>
            
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
                <GroupTable
                  title={group.title}
                  students={group.students}
                  teacherName={teacher.name}
                  recentlyAddedId={recentlyAddedId}
                  onDeleteStudent={handleDeleteStudent}
                  onEditStudentName={handleEditStudentName}
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
