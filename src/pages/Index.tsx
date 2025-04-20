
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
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 transition-all hover:shadow-xl">
      <h3 className="text-xl font-semibold mb-4 text-[#1A1F2C] flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-[#9b87f5]" />
        {title}
      </h3>
      {students.length === 0 ? (
        <p className="text-gray-500 text-center py-6 bg-gray-50/50 rounded-lg">No students in this group yet.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-[#1A1F2C]/70 font-semibold">Name</TableHead>
              <TableHead className="text-[#1A1F2C]/70 font-semibold">Proficiency Level</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id} className="hover:bg-[#9b87f5]/5 transition-colors">
                <TableCell className="font-medium">{student.name}</TableCell>
                <TableCell>{student.proficiencyLevel}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E5DEFF] to-white p-8">
      <Toaster richColors />
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-[#1A1F2C] mb-2 tracking-tight">
            Student English Level Manager
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Keep track of your students' English proficiency levels with our intuitive management system
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          <div className="md:col-span-1">
            <div className="sticky top-8">
              <h2 className="text-2xl font-semibold mb-6 text-[#1A1F2C] flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[#9b87f5]" />
                Add New Student
              </h2>
              <StudentForm onAddStudent={handleAddStudent} />
            </div>
          </div>

          <div className="md:col-span-2">
            <h2 className="text-2xl font-semibold mb-6 text-[#1A1F2C] flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[#9b87f5]" />
              Student List
            </h2>
            <div className="relative mb-8">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-500" />
              <Input
                placeholder="Search students by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-lg bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all"
              />
            </div>
            <div className="space-y-8">
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
