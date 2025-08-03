
import React from "react";
import { TeachersList } from "@/components/TeachersList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

import { useTeachers } from "@/hooks/useTeachers";

interface Teacher {
  id: string;
  name: string;
}

interface TeachersSectionProps {
  teachers: Teacher[];
  setTeachers: React.Dispatch<React.SetStateAction<Teacher[]>>;
}

export const TeachersSection: React.FC<TeachersSectionProps> = ({ 
  teachers, 
  setTeachers 
}) => {
  const { handleDeleteTeacher } = useTeachers();

  return (
    <Card className="w-full bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-[#8B5CF6]/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-[#8B5CF6]" />
          Teachers
        </CardTitle>
      </CardHeader>
      <CardContent>
        <TeachersList 
          teachers={teachers} 
          onDeleteTeacher={handleDeleteTeacher}
        />
      </CardContent>
    </Card>
  );
};
