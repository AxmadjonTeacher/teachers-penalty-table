
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { LogIn, Lock, LockOpen } from 'lucide-react';

export const LoginButton = () => {
  const { role, login, logout, isTeacher } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(password);
    if (success) {
      toast.success('Logged in as teacher');
      setIsOpen(false);
      setPassword('');
    } else {
      toast.error('Invalid password');
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
  };

  if (isTeacher()) {
    return (
      <Button 
        variant="outline" 
        onClick={handleLogout}
        className="gap-2"
      >
        <LockOpen className="h-4 w-4" />
        Logout
      </Button>
    );
  }

  return (
    <>
      <Button 
        variant="outline" 
        onClick={() => setIsOpen(true)}
        className="gap-2"
      >
        <Lock className="h-4 w-4" />
        Login as Teacher
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Login as Teacher</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleLogin} className="space-y-4 mt-4">
            <Input
              type="password"
              placeholder="Enter password (hint: 1234)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" className="w-full gap-2">
              <LogIn className="h-4 w-4" />
              Login
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
