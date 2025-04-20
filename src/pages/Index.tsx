
import { useState } from "react";
import { StudentForm } from "@/components/StudentForm";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Toaster } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

  const categorizedStudents = {
    "Beginner Group": filteredStudents.filter(
      (student) => student.proficiencyLevel === "Beginner Group"
    ),
    "Intermediate Group": filteredStudents.filter(
      (student) => student.proficiencyLevel === "Intermediate Group"
    ),
    "Advanced Group": filteredStudents.filter(
      (student) => student.proficiencyLevel === "Advanced Group"
    ),
  };

  const StudentTable = ({ students, title }: { students: Student[]; title: string }) => (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <h3 className="text-lg font-semibold mb-4 text-[#1A1F2C]">{title}</h3>
      {students.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No students in this group yet.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Proficiency Level</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.proficiencyLevel}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#E5DEFF] p-8">
      <Toaster richColors />
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#1A1F2C] mb-2">Student English Level Manager</h1>
          <p className="text-gray-600">Keep track of your students' English proficiency levels</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <h2 className="text-xl font-semibold mb-4 text-[#1A1F2C]">Add New Student</h2>
            <StudentForm onAddStudent={handleAddStudent} />
          </div>

          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold mb-4 text-[#1A1F2C]">Student List</h2>
            <div className="relative mb-6">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search students by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="space-y-6">
              {Object.entries(categorizedStudents).map(([level, students]) => (
                <StudentTable key={level} title={level} students={students} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
