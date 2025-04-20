
import { useState } from "react";
import { StudentForm } from "@/components/StudentForm";
import { StudentCard } from "@/components/StudentCard";
import { Toaster } from "sonner";

interface Student {
  id: number;
  name: string;
  grade: number;
}

const Index = () => {
  const [students, setStudents] = useState<Student[]>([]);

  const handleAddStudent = (name: string, grade: number) => {
    const newStudent: Student = {
      id: Date.now(),
      name,
      grade,
    };
    setStudents((prev) => [...prev, newStudent]);
  };

  return (
    <div className="min-h-screen bg-[#E5DEFF] p-8">
      <Toaster richColors />
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#1A1F2C] mb-2">Student Grade Manager</h1>
          <p className="text-gray-600">Keep track of your students' performance</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4 text-[#1A1F2C]">Add New Student</h2>
            <StudentForm onAddStudent={handleAddStudent} />
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4 text-[#1A1F2C]">Student List</h2>
            <div className="grid gap-4">
              {students.length === 0 ? (
                <p className="text-center text-gray-500 bg-white p-4 rounded-lg">
                  No students added yet. Add your first student!
                </p>
              ) : (
                students.map((student) => (
                  <StudentCard
                    key={student.id}
                    name={student.name}
                    grade={student.grade}
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
