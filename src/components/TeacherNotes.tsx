
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface TeacherNotesProps {
  notes: string;
  setNotes: (value: string) => void;
  readOnly?: boolean;
}

export const TeacherNotes: React.FC<TeacherNotesProps> = ({ notes, setNotes, readOnly = false }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="notes" className="text-sm font-medium">
        Teacher Notes
      </Label>
      <Textarea
        id="notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder={readOnly ? "No notes available" : "Add your notes here..."}
        className="min-h-[100px]"
        readOnly={readOnly}
        disabled={readOnly}
      />
      {readOnly && (
        <p className="text-xs text-gray-500 italic">
          You are in view-only mode and cannot edit these notes.
        </p>
      )}
    </div>
  );
};
