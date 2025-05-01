
import { Button } from "./button";
import { Trash2 } from "lucide-react";

interface DeleteButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  title?: string;
}

export const DeleteButton = ({ onClick, disabled, title = "Delete" }: DeleteButtonProps) => (
  <Button
    variant="ghost"
    size="icon"
    className="ml-2 transition text-gray-400 hover:text-red-500 hover:bg-red-50"
    onClick={onClick}
    disabled={disabled}
    title={title}
    type="button"
  >
    <Trash2 className="h-4 w-4" />
  </Button>
);
