
import { useState } from "react";
import { StudentForm } from "@/components/StudentForm";
import { StudentCard } from "@/components/StudentCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Toaster } from "sonner";

interface Student {
  id: number;
  name: string;
  proficiencyLevel: string;
}

const Index = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddStudent = (name: string, proficiencyLevel: string) => {
    const newStudent: Student = {
      id: Date.now(),
      name,
      proficiencyLevel,
    };
    setStudents((prev) => [...prev, newStudent]);
  };

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#E5DEFF] p-8">
      <Toaster richColors />
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#1A1F2C] mb-2">Student English Level Manager</h1>
          <p className="text-gray-600">Keep track of your students' English proficiency levels</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4 text-[#1A1F2C]">Add New Student</h2>
            <StudentForm onAddStudent={handleAddStudent} />
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4 text-[#1A1F2C]">Student List</h2>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search students by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="grid gap-4">
              {filteredStudents.length === 0 ? (
                <p className="text-center text-gray-500 bg-white p-4 rounded-lg">
                  {students.length === 0 ? "No students added yet." : "No matching students found."}
                </p>
              ) : (
                filteredStudents.map((student) => (
                  <StudentCard
                    key={student.id}
                    name={student.name}
                    proficiencyLevel={student.proficiencyLevel}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
