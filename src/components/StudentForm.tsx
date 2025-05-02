
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useAuth } from '@/contexts/AuthContext';

interface StudentFormProps {
  onAddStudent: (name: string, proficiencyLevel: string) => void;
}

export const StudentForm = ({ onAddStudent }: StudentFormProps) => {
  const [name, setName] = useState("");
  const [proficiencyLevel, setProficiencyLevel] = useState("");
  const { isTeacher } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isTeacher()) {
      toast.error("You need teacher access to add new students");
      return;
    }

    if (!name.trim()) {
      toast.error("Please enter a student name");
      return;
    }

    if (!proficiencyLevel) {
      toast.error("Please select a grade level");
      return;
    }

    onAddStudent(name, proficiencyLevel);
    setName("");
    setProficiencyLevel("");
    toast.success("Student added successfully!");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 transition-all hover:shadow-xl">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-[#1A1F2C] font-medium">
          Full Name
        </Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter student's full name"
          className="h-12 text-lg bg-white/80 backdrop-blur-sm border-white/20"
          disabled={!isTeacher()}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="proficiency" className="text-[#1A1F2C] font-medium">
          Grade Level
        </Label>
        <Select value={proficiencyLevel} onValueChange={setProficiencyLevel} disabled={!isTeacher()}>
          <SelectTrigger className="h-12 text-lg bg-white/80 backdrop-blur-sm border-white/20">
            <SelectValue placeholder="Select grade level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Grades 5-6">Grades 5-6</SelectItem>
            <SelectItem value="Grades 7-8">Grades 7-8</SelectItem>
            <SelectItem value="Grades 9-11">Grades 9-11</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button 
        type="submit" 
        className="w-full h-12 text-lg bg-[#9b87f5] hover:bg-[#7E69AB] transition-colors"
        disabled={!isTeacher()}
      >
        Add Student
      </Button>
    </form>
  );
};
