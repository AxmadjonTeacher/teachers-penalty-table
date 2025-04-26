
import React, { useState, useEffect } from "react";
import { TeachersList } from "@/components/TeachersList";
import { TeacherForm } from "@/components/TeacherForm";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

interface Teacher {
  id: string;
  name: string;
}

const Index = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  useEffect(() => {
    const savedTeachers = localStorage.getItem("teachers");
    if (savedTeachers) {
      setTeachers(JSON.parse(savedTeachers));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("teachers", JSON.stringify(teachers));
  }, [teachers]);

  const handleAddTeacher = (name: string) => {
    const newTeacher: Teacher = {
      id: Date.now().toString(),
      name,
    };
    setTeachers((prev) => [...prev, newTeacher]);
    setRecentlyAddedId(newTeacher.id);
    setTimeout(() => setRecentlyAddedId(null), 700);
    toast.success("Teacher added successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#8B5CF6]/10 to-white py-8 px-2 md:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col items-center gap-3 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] via-[#7C3AED] to-[#6D28D9] tracking-tight drop-shadow">
            Monitoring App
          </h1>
          <p className="text-lg text-gray-600 text-center max-w-2xl">
            Monitor student participation and track penalties across different grade groups
          </p>
        </header>
        
        <Card className="w-full animate-scale-in p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-[#8B5CF6]/20 hover:shadow-xl transition-all duration-300">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-2xl font-semibold text-[#1A1F2C] flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#8B5CF6]" />
              Add New Teacher
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <TeacherForm onAddTeacher={handleAddTeacher} />
          </CardContent>
        </Card>
        
        <main className="w-full space-y-8">
          <Card className="w-full bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-[#8B5CF6]/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-[#8B5CF6]" />
                Teachers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TeachersList teachers={teachers} />
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Index;
