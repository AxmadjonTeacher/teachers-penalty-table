
import { useState, useEffect } from "react";
import { StudentForm } from "@/components/StudentForm";
import { Toaster } from "sonner";
import { toast } from "sonner";
import { GroupTable } from "@/components/GroupTable";
import { GradeLegend } from "@/components/GradeLegend";
import { format } from "date-fns";

const STORAGE_KEY = "studentData";

interface Student {
  id: number;
  name: string;
  proficiencyLevel: string;
  className?: string;
}

const Index = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [recentlyAddedId, setRecentlyAddedId] = useState<number | null>(null);
  const [teacherName, setTeacherName] = useState<string>("");
  const [studentLevel, setStudentLevel] = useState<string>("");
  // Try to persist teacher info as well (optional)
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      setStudents(JSON.parse(savedData));
    }
    const savedTeacher = localStorage.getItem("teacherName");
    if (savedTeacher) setTeacherName(savedTeacher);
    const savedLevel = localStorage.getItem("studentLevel");
    if (savedLevel) setStudentLevel(savedLevel);
  }, []);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  }, [students]);
  useEffect(() => {
    localStorage.setItem("teacherName", teacherName);
  }, [teacherName]);
  useEffect(() => {
    localStorage.setItem("studentLevel", studentLevel);
  }, [studentLevel]);

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

  // Students grouped by level, as before:
  const grades56Group = students.filter(
    (student) => student.proficiencyLevel === "Grades 5-6"
  );
  const grades78Group = students.filter(
    (student) => student.proficiencyLevel === "Grades 7-8"
  );
  const grades911Group = students.filter(
    (student) => student.proficiencyLevel === "Grades 9-11"
  );

  // Display only the selected level table if level is selected
  const groups = [
    { title: "Grades 5-6", students: grades56Group },
    { title: "Grades 7-8", students: grades78Group },
    { title: "Grades 9-11", students: grades911Group }
  ];
  const month = format(new Date(), "MMMM yyyy");

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#8B5CF6]/10 to-white py-8 px-2 md:px-8">
      <Toaster richColors />
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col items-center gap-3 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] via-[#7C3AED] to-[#6D28D9] tracking-tight drop-shadow">
            Teachers Penalty Table
          </h1>
          <div className="flex flex-col md:flex-row gap-3 items-center justify-center">
            <input
              type="text"
              value={teacherName}
              onChange={e => setTeacherName(e.target.value)}
              placeholder="Enter Teacher's Name"
              className="border border-[#8B5CF6]/40 px-3 py-2 rounded-lg shadow-sm focus:outline-[#8B5CF6] text-base"
              style={{ minWidth: 220 }}
            />
            <select
              value={studentLevel}
              onChange={e => setStudentLevel(e.target.value)}
              className="border border-[#8B5CF6]/40 px-3 py-2 rounded-lg shadow-sm focus:outline-[#8B5CF6] text-base"
            >
              <option value="">Select Student Level</option>
              <option value="Grades 5-6">Grades 5-6</option>
              <option value="Grades 7-8">Grades 7-8</option>
              <option value="Grades 9-11">Grades 9-11</option>
            </select>
            <span className="text-[#8B5CF6] font-semibold mx-2">{month}</span>
          </div>
          <div className="text-center text-[#8B5CF6] font-medium mt-2">
            {teacherName && studentLevel &&
              `Teacher: ${teacherName} • Level: ${studentLevel}`
            }
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
          {groups.filter(g => studentLevel === "" || g.title === studentLevel).map(g => (
            <GroupTable
              key={g.title}
              title={g.title}
              month={month}
              students={g.students}
              recentlyAddedId={recentlyAddedId}
              onDeleteStudent={handleDeleteStudent}
            />
          ))}
        </main>
        <GradeLegend />
      </div>
    </div>
  );
};

export default Index;
