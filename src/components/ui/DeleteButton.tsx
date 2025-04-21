
import { Button } from "./button";
import { Trash2 } from "lucide-react";

interface DeleteButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  title?: string;
}

export const DeleteButton = ({ onClick, disabled, title = "Delete" }: DeleteButtonProps) => (
  <Button
    variant="destructive"
    size="icon"
    className="ml-2 transition hover:scale-110 hover:bg-red-500/80 animate-fade-in"
    onClick={onClick}
    disabled={disabled}
    title={title}
    type="button"
  >
    <Trash2 className="h-5 w-5" />
  </Button>
);
