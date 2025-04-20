
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface StudentFormProps {
  onAddStudent: (name: string, proficiencyLevel: string) => void;
}

export const StudentForm = ({ onAddStudent }: StudentFormProps) => {
  const [name, setName] = useState("");
  const [proficiencyLevel, setProficiencyLevel] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error("Please enter a student name");
      return;
    }

    if (!proficiencyLevel) {
      toast.error("Please select a proficiency level");
      return;
    }

    onAddStudent(name, proficiencyLevel);
    setName("");
    setProficiencyLevel("");
    toast.success("Student added successfully!");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white rounded-lg shadow-sm">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter student's full name"
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="proficiency">English Proficiency</Label>
        <Select value={proficiencyLevel} onValueChange={setProficiencyLevel}>
          <SelectTrigger>
            <SelectValue placeholder="Select proficiency level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Beginner Group">Beginner Group</SelectItem>
            <SelectItem value="Intermediate Group">Intermediate Group</SelectItem>
            <SelectItem value="Advanced Group">Advanced Group</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="w-full bg-[#9b87f5] hover:bg-[#7E69AB]">
        Add Student
      </Button>
    </form>
  );
};
