
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { GroupTable } from "./GroupTable";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Student {
  id: number;
  name: string;
  proficiencyLevel: string;
}

interface CollapsibleGroupProps {
  intermediateGroup: Student[];
  advancedGroup: Student[];
  recentlyAddedId: number | null;
  onDeleteStudent: (id: number) => void;
}

export const CollapsibleGroup = ({
  intermediateGroup,
  advancedGroup,
  recentlyAddedId,
  onDeleteStudent,
}: CollapsibleGroupProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="w-full max-w-4xl mx-auto mt-2 animate-fade-in">
      <Button
        variant="outline"
        className="flex items-center justify-center gap-2 mx-auto mb-4 bg-white shadow-md hover:shadow-lg transition-all rounded-lg"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        aria-controls="collapsible-student-groups"
      >
        {expanded ? (
          <>
            Hide Intermediate & Advanced Groups
            <ChevronUp className="w-5 h-5" />
          </>
        ) : (
          <>
            Show Intermediate & Advanced Groups
            <ChevronDown className="w-5 h-5" />
          </>
        )}
      </Button>
      {expanded && (
        <div
          id="collapsible-student-groups"
          className="space-y-6"
          aria-live="polite"
        >
          <GroupTable
            title="Intermediate Group"
            students={intermediateGroup}
            recentlyAddedId={recentlyAddedId}
            onDeleteStudent={onDeleteStudent}
          />
          <GroupTable
            title="Advanced Group"
            students={advancedGroup}
            recentlyAddedId={recentlyAddedId}
            onDeleteStudent={onDeleteStudent}
          />
        </div>
      )}
    </div>
  );
};
