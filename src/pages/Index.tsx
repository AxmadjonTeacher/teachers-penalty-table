
import { useState, useEffect } from "react";
import { StudentForm } from "@/components/StudentForm";
import { Toaster } from "sonner";
import { toast } from "sonner";
import { GroupTable } from "@/components/GroupTable";
import { GradeLegend } from "@/components/GradeLegend";

const STORAGE_KEY = "studentData";

interface Student {
  id: number;
  name: string;
  proficiencyLevel: string;
  date?: Date;
}

const Index = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [recentlyAddedId, setRecentlyAddedId] = useState<number | null>(null);

  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      setStudents(JSON.parse(savedData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  }, [students]);

  const handleAddStudent = (name: string, proficiencyLevel: string) => {
    const newStudent: Student = {
      id: Date.now(),
      name,
      proficiencyLevel,
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

  const handleDateChange = (studentId: number, date: Date) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === studentId ? { ...student, date } : student
      )
    );
  };

  const grades56Group = students.filter(
    (student) => student.proficiencyLevel === "Grades 5-6"
  );

  const grades78Group = students.filter(
    (student) => student.proficiencyLevel === "Grades 7-8"
  );

  const grades911Group = students.filter(
    (student) => student.proficiencyLevel === "Grades 9-11"
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#8B5CF6]/10 to-white py-8 px-2 md:px-8">
      <Toaster richColors />
      <div className="max-w-7xl mx-auto space-y-10">
        <header className="text-center space-y-4 flex items-center justify-center animate-fade-in">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] via-[#7C3AED] to-[#6D28D9] mb-2 tracking-tight drop-shadow">
            Teachers Penalty Table
          </h1>
        </header>

        <div className="flex flex-col gap-10">
          <aside className="w-full animate-scale-in p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-[#8B5CF6]/20 hover:shadow-xl transition-all duration-300">
            <h2 className="text-2xl font-semibold mb-6 text-[#1A1F2C] flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#8B5CF6]" />
              Add New Student
            </h2>
            <StudentForm onAddStudent={handleAddStudent} />
          </aside>

          <main className="w-full space-y-8">
            <GradeLegend />
            <div className="space-y-6">
              <GroupTable
                title="Grades 5-6"
                students={grades56Group}
                recentlyAddedId={recentlyAddedId}
                onDeleteStudent={handleDeleteStudent}
              />
              <GroupTable
                title="Grades 7-8"
                students={grades78Group}
                recentlyAddedId={recentlyAddedId}
                onDeleteStudent={handleDeleteStudent}
              />
              <GroupTable
                title="Grades 9-11"
                students={grades911Group}
                recentlyAddedId={recentlyAddedId}
                onDeleteStudent={handleDeleteStudent}
              />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Index;
