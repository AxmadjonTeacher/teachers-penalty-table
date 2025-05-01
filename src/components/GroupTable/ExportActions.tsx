
import React from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FileSpreadsheet, FileText } from "lucide-react";
import { jsPDF } from "jspdf";
import * as XLSX from 'xlsx';
import { GradesState } from "@/utils/gradeStorage";

interface Student {
  id: number;
  name: string;
  proficiencyLevel: string;
  className?: string;
}

interface ExportActionsProps {
  title: string;
  students: Student[];
  dates: (Date | null)[];
  grades: GradesState;
}

export const ExportActions: React.FC<ExportActionsProps> = ({ title, students, dates, grades }) => {
  const exportToPDF = () => {
    const pdf = new jsPDF();
    const table = document.getElementById(`table-${title}`);
    if (!table) return;
    
    pdf.text(title, 20, 10);
    
    let yPos = 30;
    students.forEach((student, index) => {
      const studentText = `${student.name} - ${
        Object.entries(grades[student.id] || {})
          .map(([dateIdx, gradeArr]) => `${dates[Number(dateIdx)]?.toLocaleDateString() || 'N/A'}: ${gradeArr.join(', ')}`)
          .join(' | ')
      }`;
      pdf.text(studentText, 20, yPos);
      yPos += 10;
    });
    
    pdf.save(`${title}-grades.pdf`);
    toast.success("PDF exported successfully");
  };

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    
    const data = students.map(student => ({
      Name: student.name,
      Class: student.className || 'N/A',
      ...Object.entries(grades[student.id] || {}).reduce((acc, [dateIdx, gradeArr]) => ({
        ...acc,
        [`${dates[Number(dateIdx)]?.toLocaleDateString() || 'N/A'}`]: gradeArr.join(', ')
      }), {})
    }));
    
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, title);
    XLSX.writeFile(wb, `${title}-grades.xlsx`);
    toast.success("Excel file exported successfully");
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={exportToPDF}
        className="gap-2"
      >
        <FileText className="h-4 w-4" />
        PDF
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={exportToExcel}
        className="gap-2"
      >
        <FileSpreadsheet className="h-4 w-4" />
        Excel
      </Button>
    </>
  );
};
