
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Teacher {
  id: string;
  name: string;
}

interface TeachersListProps {
  teachers: Teacher[];
  onDeleteTeacher?: (teacherId: string) => void;
}

export const TeachersList: React.FC<TeachersListProps> = ({ teachers, onDeleteTeacher }) => {
  const { isTeacher } = useAuth();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {teachers.length === 0 ? (
        <p className="text-gray-400 italic col-span-full text-center py-4">
          No teachers available yet.
        </p>
      ) : (
        teachers.map((teacher) => (
          <Card 
            key={teacher.id} 
            className="transition-all duration-200 hover:shadow-lg hover:border-[#8B5CF6]/30 hover:bg-gray-50/70"
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl flex items-center gap-2">
                  <User className="h-5 w-5 text-[#8B5CF6]" />
                  {teacher.name || "Unnamed Teacher"}
                </CardTitle>
                {isTeacher() && onDeleteTeacher && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Teacher</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete {teacher.name}? This action cannot be undone.
                          All associated students and data will be lost.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => onDeleteTeacher(teacher.id)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <Link to={`/teacher/${teacher.id}`} className="block">
                <p className="text-sm text-gray-500">
                  View {teacher.name}'s groups and students
                </p>
              </Link>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};
