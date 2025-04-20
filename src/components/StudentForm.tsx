
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface StudentFormProps {
  onAddStudent: (name: string, grade: number) => void;
}

export const StudentForm = ({ onAddStudent }: StudentFormProps) => {
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error("Please enter a student name");
      return;
    }

    const gradeNum = Number(grade);
    if (isNaN(gradeNum) || gradeNum < 0 || gradeNum > 100) {
      toast.error("Grade must be a number between 0 and 100");
      return;
    }

    onAddStudent(name, gradeNum);
    setName("");
    setGrade("");
    toast.success("Student added successfully!");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white rounded-lg shadow-sm">
      <div className="space-y-2">
        <Label htmlFor="name">Student Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter student name"
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="grade">Grade</Label>
        <Input
          id="grade"
          type="number"
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          placeholder="Enter grade (0-100)"
          min="0"
          max="100"
          className="w-full"
        />
      </div>
      <Button type="submit" className="w-full bg-[#9b87f5] hover:bg-[#7E69AB]">
        Add Student
      </Button>
    </form>
  );
};
