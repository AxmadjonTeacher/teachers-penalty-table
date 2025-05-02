
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';

interface TeacherFormProps {
  onAddTeacher: (name: string) => void;
}

export const TeacherForm: React.FC<TeacherFormProps> = ({ onAddTeacher }) => {
  const [teacherName, setTeacherName] = useState("");
  const { isTeacher } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isTeacher()) {
      toast.error("You need teacher access to add new teachers");
      return;
    }
    
    if (teacherName.trim() === "") {
      toast.error("Please enter a teacher name");
      return;
    }

    onAddTeacher(teacherName);
    setTeacherName("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-3">
      <div className="flex-1 min-w-[200px]">
        <Input
          type="text"
          value={teacherName}
          onChange={(e) => setTeacherName(e.target.value)}
          placeholder="Enter teacher's name"
          className="w-full"
          disabled={!isTeacher()}
        />
      </div>
      <Button 
        type="submit" 
        className="bg-[#8B5CF6] hover:bg-[#7C3AED]"
        disabled={!isTeacher()}
      >
        <Plus className="mr-1 h-4 w-4" /> Add Teacher
      </Button>
    </form>
  );
};
