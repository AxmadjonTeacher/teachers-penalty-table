
import React from "react";
import { TeacherForm } from "@/components/TeacherForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AddTeacherSectionProps {
  onAddTeacher: (name: string) => Promise<void>;
}

export const AddTeacherSection: React.FC<AddTeacherSectionProps> = ({ 
  onAddTeacher 
}) => {

  return (
    <Card className="w-full animate-scale-in p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-[#8B5CF6]/20 hover:shadow-xl transition-all duration-300">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-2xl font-semibold text-[#1A1F2C] flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#8B5CF6]" />
          Add New Teacher
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <TeacherForm onAddTeacher={onAddTeacher} />
      </CardContent>
    </Card>
  );
};
