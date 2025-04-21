import { useState, useEffect, useRef } from "react";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { DeleteButton } from "@/components/ui/DeleteButton";
import { toast } from "sonner";

const levelColors: Record<string, string> = {
  "Beginner Group": "bg-[#E5DEFF] text-[#9b87f5]",
  "Intermediate Group": "bg-[#FDE1D3] text-[#E97D27]",
  "Advanced Group": "bg-[#D3E4FD] text-[#4170AB]",
};

interface Student {
  id: number;
  name: string;
  proficiencyLevel: string;
}

const STORAGE_KEY = "studentData";

const Index = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [openSheet, setOpenSheet] = useState(false);

  const [recentlyAddedId, setRecentlyAddedId] = useState<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setStudents(JSON.parse(saved));
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
  };

  const handleDeleteStudent = (id: number) => {
    setStudents((prev) => prev.filter((stu) => stu.id !== id));
    toast.success("Student removed.");
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

  const StudentTable = ({
    students,
    title,
  }: {
    students: Student[];
    title: string;
  }) => (
    <div className="rounded-xl p-6 shadow-md border-2 bg-gradient-to-bl from-white/90 to-[#E5DEFF]/60 border-[#E5DEFF] mb-6 transition-all hover:shadow-lg animate-fade-in">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <span className={`inline-block h-2 w-2 rounded-full ${levelColors[title] || "bg-[#9b87f5]"}`}></span>
        <span className="tracking-tight">{title}</span>
      </h3>
      {students.length === 0 ? (
        <p className="text-gray-400 italic text-center py-6 bg-gray-50/80 rounded-lg">
          No students in this group yet.
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold text-[#1A1F2C]/70">Name</TableHead>
              <TableHead className="font-semibold text-[#1A1F2C]/70">Proficiency Level</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow
                key={student.id}
                className={`hover:bg-[#9b87f5]/10 transition-all ${
                  recentlyAddedId === student.id ? "animate-scale-in bg-[#C4B5FD]/30" : ""
                }`}
              >
                <TableCell className="font-medium">{student.name}</TableCell>
                <TableCell>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${levelColors[student.proficiencyLevel] || "bg-[#9b87f5]/10"}`}>
                    {student.proficiencyLevel}
                  </span>
                </TableCell>
                <TableCell>
                  <DeleteButton onClick={() => handleDeleteStudent(student.id)} title="Delete student" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );

  const AllStudentTable = ({
    students,
  }: {
    students: Student[];
  }) => (
    <div className="rounded-xl p-6 shadow-md border-2 bg-gradient-to-bl from-white/95 to-[#E5DEFF]/50 border-[#d6bcfa] transition-all hover:shadow-xl animate-fade-in">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-[#1A1F2C]">
        <span className="inline-block h-2 w-2 rounded-full bg-[#9b87f5]"></span>
        Search Results
      </h3>
      {students.length === 0 ? (
        <p className="text-gray-400 italic text-center py-6 bg-gray-50/80 rounded-lg">
          No students found.
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold text-[#1A1F2C]/70">Name</TableHead>
              <TableHead className="font-semibold text-[#1A1F2C]/70">Proficiency Level</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow
                key={student.id}
                className={`hover:bg-[#9b87f5]/10 transition-all ${
                  recentlyAddedId === student.id ? "animate-scale-in bg-[#C4B5FD]/30" : ""
                }`}
              >
                <TableCell className="font-medium">{student.name}</TableCell>
                <TableCell>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${levelColors[student.proficiencyLevel] || "bg-[#9b87f5]/10"}`}>
                    {student.proficiencyLevel}
                  </span>
                </TableCell>
                <TableCell>
                  <DeleteButton onClick={() => handleDeleteStudent(student.id)} title="Delete student" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E5DEFF] to-white py-8 px-2 md:px-8">
      <Toaster richColors />
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#7E69AB] via-[#9b87f5] to-[#FDE1D3] mb-2 tracking-tight drop-shadow animate-fade-in">
            Student English Level Manager
          </h1>
          <p className="text-gray-700 text-lg max-w-2xl mx-auto animate-fade-in">
            Keep track of your students' English proficiency levels with our intuitive management system.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-10">
          <div className="md:w-1/3">
            <div className="sticky top-8 animate-scale-in">
              <h2 className="text-2xl font-semibold mb-6 text-[#1A1F2C] flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#9b87f5]" />
                Add New Student
              </h2>
              <StudentForm onAddStudent={handleAddStudent} />
            </div>
          </div>

          <div className="md:w-2/3 flex flex-col items-center gap-6">
            <h2 className="text-2xl font-semibold text-[#1A1F2C] flex items-center gap-2 mb-2 animate-fade-in">
              <span className="h-2 w-2 rounded-full bg-[#9b87f5]" />
              Student List
            </h2>
            <div className="w-full relative mb-4 animate-fade-in">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-500" />
              <Input
                placeholder="Search students by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-lg bg-white/90 backdrop-blur-md border-white/40 shadow-xl hover:shadow-2xl transition-all"
              />
            </div>

            <div className="w-full flex items-center justify-end mb-1 animate-fade-in">
              <Sheet open={openSheet} onOpenChange={setOpenSheet}>
                <SheetTrigger asChild>
                  <Button
                    variant="secondary"
                    className="px-6 py-3 rounded-lg shadow bg-gradient-to-l from-[#FDE1D3] to-[#9b87f5] text-base text-[#1A1F2C] font-bold hover:bg-[#7E69AB] border-0 hover:scale-105 transition"
                  >
                    Show Student Groups
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="max-w-lg w-full glass-morphism overflow-y-auto animate-slide-in-right">
                  <SheetHeader>
                    <SheetTitle className="mb-4 text-2xl font-bold bg-gradient-to-tr from-[#9b87f5] via-[#E5DEFF] to-[#FDE1D3] bg-clip-text text-transparent">
                      Student Groups
                    </SheetTitle>
                  </SheetHeader>
                  <div className="space-y-5 mt-4">
                    {Object.entries(categorizedStudents).map(([level, students]) => (
                      <StudentTable key={level} title={level} students={students} />
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            <div className="w-full">
              <AllStudentTable students={filteredStudents} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
