
interface StudentCardProps {
  name: string;
  grade: number;
}

export const StudentCard = ({ name, grade }: StudentCardProps) => {
  const getGradeColor = (grade: number) => {
    if (grade >= 90) return "text-green-600";
    if (grade >= 80) return "text-blue-600";
    if (grade >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <h3 className="font-medium text-lg text-[#1A1F2C]">{name}</h3>
      <p className={`text-2xl font-bold ${getGradeColor(grade)}`}>
        {grade}%
      </p>
    </div>
  );
};
