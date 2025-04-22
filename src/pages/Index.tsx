import { useState, useEffect } from "react";
import { StudentForm } from "@/components/StudentForm";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Toaster } from "sonner";
import { toast } from "sonner";
import { GroupTable } from "@/components/GroupTable";
import { StudentIcon } from "@/components/StudentIcon";
import { GradeLegend } from "@/components/GradeLegend";

const STORAGE_KEY = "studentData";

interface Student {
  id: number;
  name: string;
  proficiencyLevel: string;
}

const Index = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
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
    setSearchQuery("");
    toast.success("Student added successfully!");
  };

  const handleDeleteStudent = (id: number) => {
    setStudents((prev) => prev.filter((stu) => stu.id !== id));
    toast.success("Student removed.");
  };

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const beginnerGroup = students.filter(
    (student) => student.proficiencyLevel === "Beginner Group"
  );

  const intermediateGroup = students.filter(
    (student) => student.proficiencyLevel === "Intermediate Group"
  );

  const advancedGroup = students.filter(
    (student) => student.proficiencyLevel === "Advanced Group"
  );

  const searching = searchQuery.trim().length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#8B5CF6]/10 to-white py-8 px-2 md:px-8">
      <Toaster richColors />
      <div className="max-w-7xl mx-auto space-y-10">
        <header className="text-center space-y-4 flex items-center justify-center animate-fade-in">
          <StudentIcon />
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] via-[#7C3AED] to-[#6D28D9] mb-2 tracking-tight drop-shadow">
            Student English Level Manager
          </h1>
        </header>

        <div className="flex flex-col md:flex-row gap-10">
          <aside className="md:w-1/3 lg:w-1/4 sticky top-8 animate-scale-in p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-[#8B5CF6]/20 hover:shadow-xl transition-all duration-300">
            <h2 className="text-2xl font-semibold mb-6 text-[#1A1F2C] flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#8B5CF6]" />
              Add New Student
            </h2>
            <StudentForm onAddStudent={handleAddStudent} />
            
            <div className="w-full mt-6 animate-fade-in relative">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-[#8B5CF6]" />
              <Input
                placeholder="Search students by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-lg bg-white/90 backdrop-blur-md border-[#8B5CF6]/20 shadow-xl hover:shadow-2xl transition-all duration-300 focus:border-[#8B5CF6]/40"
              />
            </div>
          </aside>

          <main className="md:w-2/3 lg:w-3/4">
            <GradeLegend />
            {searching ? (
              <GroupTable
                title="Search Results"
                students={filteredStudents}
                recentlyAddedId={recentlyAddedId}
                onDeleteStudent={handleDeleteStudent}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <GroupTable
                  title="Beginner Group"
                  students={beginnerGroup}
                  recentlyAddedId={recentlyAddedId}
                  onDeleteStudent={handleDeleteStudent}
                />
                <GroupTable
                  title="Intermediate Group"
                  students={intermediateGroup}
                  recentlyAddedId={recentlyAddedId}
                  onDeleteStudent={handleDeleteStudent}
                />
                <GroupTable
                  title="Advanced Group"
                  students={advancedGroup}
                  recentlyAddedId={recentlyAddedId}
                  onDeleteStudent={handleDeleteStudent}
                />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Index;
