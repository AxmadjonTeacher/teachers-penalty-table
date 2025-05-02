
import React from "react";
import { useAuth } from '@/contexts/AuthContext';

interface TeacherNotesProps {
  notes: string;
  setNotes: (val: string) => void;
}

export const TeacherNotes: React.FC<TeacherNotesProps> = ({ notes, setNotes }) => {
  const { isTeacher } = useAuth();
  
  return (
    <div className="mt-3">
      <label className="block text-[#8B5CF6] font-semibold mb-1">Teacher's Notes</label>
      <textarea
        value={notes}
        onChange={e => setNotes(e.target.value)}
        placeholder="Write your notes or feedback here..."
        className="w-full min-h-[48px] rounded-md border border-[#8B5CF6]/20 bg-white px-2 py-1 text-base shadow-sm focus:outline-[#8B5CF6] text-sm"
        disabled={!isTeacher()}
        readOnly={!isTeacher()}
      />
    </div>
  );
};
