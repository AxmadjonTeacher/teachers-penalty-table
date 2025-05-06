
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LockIcon, UnlockIcon } from "lucide-react";

interface TeacherNotesProps {
  notes: string;
  setNotes: (value: string) => void;
  readOnly?: boolean;
}

export const TeacherNotes: React.FC<TeacherNotesProps> = ({ notes, setNotes, readOnly = false }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="notes" className="text-sm font-medium">
          Teacher Notes
        </Label>
        {readOnly ? (
          <div className="text-xs text-gray-500 flex items-center gap-1">
            <LockIcon className="h-3 w-3" />
            <span>View only</span>
          </div>
        ) : (
          <div className="text-xs text-green-500 flex items-center gap-1">
            <UnlockIcon className="h-3 w-3" />
            <span>Editable</span>
          </div>
        )}
      </div>
      <Textarea
        id="notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder={readOnly ? "No notes available" : "Add your notes here..."}
        className={`min-h-[100px] ${readOnly ? 'bg-gray-50' : ''}`}
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
