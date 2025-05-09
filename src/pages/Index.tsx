
import React from "react";
import { LoginButton } from "@/components/LoginButton";
import { useAuth } from "@/contexts/AuthContext";
import { TeachersSection } from "@/components/TeachersSection";
import { AddTeacherSection } from "@/components/AddTeacherSection";
import { useTeachers } from "@/hooks/useTeachers";

const Index = () => {
  const { isTeacher, user, ownedTeacherId } = useAuth();
  const { teachers, setTeachers, handleAddTeacher } = useTeachers();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#8B5CF6]/10 to-white py-8 px-2 md:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col items-center gap-3 animate-fade-in">
          <div className="self-end">
            <LoginButton />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] via-[#7C3AED] to-[#6D28D9] tracking-tight drop-shadow">
            Monitoring App
          </h1>
          <p className="text-lg text-gray-600 text-center max-w-2xl">
            Monitor student participation and track penalties across different grade groups
          </p>
        </header>
        
        {user && isTeacher() && !ownedTeacherId && (
          <AddTeacherSection onAddTeacher={handleAddTeacher} />
        )}
        
        <main className="w-full space-y-8">
          <TeachersSection teachers={teachers} setTeachers={setTeachers} />
        </main>
      </div>
    </div>
  );
};

export default Index;
