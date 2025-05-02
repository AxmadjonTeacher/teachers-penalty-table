
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { LogIn, LogOut, Lock, LockOpen, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const LoginButton = () => {
  const { user, role, login, logout, isTeacher } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const success = await login(password);
      if (success) {
        toast.success('Logged in as teacher');
        setIsOpen(false);
        setPassword('');
      } else {
        toast.error('Invalid password');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred during login');
    }
  };

  const handleLogout = () => {
    logout();
  };

  // If user is logged in
  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <User className="h-4 w-4" />
            {user.email?.split('@')[0]}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem disabled>
              Role: {isTeacher() ? 'Teacher' : 'Viewer'}
            </DropdownMenuItem>
            {!isTeacher() && (
              <DropdownMenuItem onClick={() => setIsOpen(true)}>
                <Lock className="mr-2 h-4 w-4" />
                <span>Become Teacher</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // If user is not logged in
  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        onClick={() => setIsOpen(true)}
        className="gap-2"
      >
        <Lock className="h-4 w-4" />
        Teacher Access
      </Button>

      <Button 
        asChild
        variant="default"
        className="bg-[#8B5CF6] hover:bg-[#7C3AED] gap-2"
      >
        <Link to="/auth">
          <LogIn className="h-4 w-4" />
          Login / Register
        </Link>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Login as Teacher</DialogTitle>
            <DialogDescription>
              Enter the teacher password to access additional features.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleLogin} className="space-y-4 mt-4">
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" className="w-full gap-2">
              <LockOpen className="h-4 w-4" />
              Become Teacher
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
