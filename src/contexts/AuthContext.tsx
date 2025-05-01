
import React, { createContext, useContext, useState, useEffect } from 'react';

type Role = 'viewer' | 'teacher';

interface AuthContextType {
  role: Role;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  isTeacher: () => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<Role>('viewer');
  
  // Load role from localStorage on initial load
  useEffect(() => {
    const savedRole = localStorage.getItem('userRole');
    if (savedRole === 'teacher') {
      setRole('teacher');
    }
  }, []);

  const login = async (password: string) => {
    // Using the new password
    if (password === 'teacherme') {
      setRole('teacher');
      // Save role to localStorage
      localStorage.setItem('userRole', 'teacher');
      return true;
    }
    return false;
  };

  const logout = () => {
    setRole('viewer');
    // Remove role from localStorage
    localStorage.removeItem('userRole');
  };

  const isTeacher = () => role === 'teacher';

  return (
    <AuthContext.Provider value={{ role, login, logout, isTeacher }}>
      {children}
    </AuthContext.Provider>
  );
};
