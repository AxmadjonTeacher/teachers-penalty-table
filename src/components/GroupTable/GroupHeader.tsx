
import React from 'react';
import { CardHeader, CardTitle } from "@/components/ui/card";
import { ExportActions } from "./ExportActions";
import { ResetGradesDialog } from "./ResetGradesDialog";


interface Student {
  id: number;
  name: string;
  proficiencyLevel: string;
  className?: string;
}

interface GroupHeaderProps {
  title: string;
  students: Student[];
  dates: (Date | null)[];
  grades: Record<number, Record<number, string[]>>;
  canEdit: boolean;
  onReset: () => void;
}

export const GroupHeader: React.FC<GroupHeaderProps> = ({
  title,
  students,
  dates,
  grades,
  canEdit,
  onReset
}) => {

  return (
    <CardHeader className="bg-[#F1F0FB] pb-3 pt-4">
      <div className="flex justify-between items-center">
        <CardTitle className="text-xl font-semibold text-[#1A1F2C]">
          {title}
          {!canEdit && (
            <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
              View only
            </span>
          )}
        </CardTitle>
        <div className="flex gap-2">
          <ExportActions 
            title={title} 
            students={students} 
            dates={dates} 
            grades={grades} 
          />
          {canEdit && (
            <ResetGradesDialog onReset={onReset} />
          )}
        </div>
      </div>
    </CardHeader>
  );
};
