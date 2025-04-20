
interface StudentCardProps {
  name: string;
  proficiencyLevel: string;
}

export const StudentCard = ({ name, proficiencyLevel }: StudentCardProps) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <h3 className="font-medium text-lg text-[#1A1F2C]">{name}</h3>
      <div className="mt-2">
        <p className="text-gray-600">
          Proficiency: {proficiencyLevel}
        </p>
      </div>
    </div>
  );
};
