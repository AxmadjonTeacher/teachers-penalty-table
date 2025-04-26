
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";

interface Teacher {
  id: string;
  name: string;
}

interface TeachersListProps {
  teachers: Teacher[];
}

export const TeachersList: React.FC<TeachersListProps> = ({ teachers }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {teachers.length === 0 ? (
        <p className="text-gray-400 italic col-span-full text-center py-4">
          No teachers available. Add a teacher to get started.
        </p>
      ) : (
        teachers.map((teacher) => (
          <Link to={`/teacher/${teacher.id}`} key={teacher.id}>
            <Card className="transition-all duration-200 hover:shadow-lg hover:border-[#8B5CF6]/30 hover:bg-gray-50/70">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center gap-2">
                  <User className="h-5 w-5 text-[#8B5CF6]" />
                  {teacher.name || "Unnamed Teacher"}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-gray-500">
                  View {teacher.name}'s groups and students
                </p>
              </CardContent>
            </Card>
          </Link>
        ))
      )}
    </div>
  );
};
