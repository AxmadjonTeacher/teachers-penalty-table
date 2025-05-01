
import { Button } from "./button";
import { Trash2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface DeleteButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  title?: string;
}

export const DeleteButton = ({ onClick, disabled, title = "Delete" }: DeleteButtonProps) => {
  const isMobile = useIsMobile();
  
  return (
    <Button
      variant="ghost"
      size={isMobile ? "sm" : "icon"}
      className="ml-1 md:ml-2 transition text-gray-300 hover:text-red-500 hover:bg-red-50"
      onClick={onClick}
      disabled={disabled}
      title={title}
      type="button"
    >
      <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
    </Button>
  );
};
