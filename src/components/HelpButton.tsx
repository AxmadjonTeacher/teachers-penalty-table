
import React from "react";
import { HelpCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const HelpButton: React.FC = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="fixed bottom-4 right-4 z-50 bg-white shadow-lg border border-[#E5DEFF] hover:bg-[#F6F4FF]"
        >
          Help 👨🏻‍💻
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Need Help?</DialogTitle>
          <DialogDescription>Contact our support specialist.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">My name:</p>
            <p className="text-sm">Yodgorov Axmadjon</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">My contact:</p>
            <a 
              href="https://t.me/ahmet_just" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-sm text-blue-600 hover:underline"
            >
              https://t.me/ahmet_just
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
