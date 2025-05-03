
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  role: string;
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
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string>('viewer');
  
  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        // If session exists, fetch the user's role from profiles
        if (session?.user) {
          setTimeout(() => {
            fetchUserRole(session.user.id);
          }, 0);
        } else {
          // Check localStorage for role (for backward compatibility)
          const storedRole = localStorage.getItem('userRole');
          setRole(storedRole === 'teacher' ? 'teacher' : 'viewer');
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      
      // If session exists, fetch the user's role
      if (session?.user) {
        fetchUserRole(session.user.id);
      } else {
        // Check localStorage for role (for backward compatibility)
        const storedRole = localStorage.getItem('userRole');
        setRole(storedRole === 'teacher' ? 'teacher' : 'viewer');
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRole = async (userId: string) => {
    try {
      // Check localStorage first for backward compatibility
      const storedRole = localStorage.getItem('userRole');
      if (storedRole === 'teacher') {
        console.log('Setting role to teacher from localStorage');
        setRole('teacher');
        return;
      }
      
      console.log('Fetching user role from Supabase for user ID:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user role:', error);
        return;
      }

      if (data) {
        console.log('Role from Supabase:', data.role);
        setRole(data.role);
        // Also update localStorage
        if (data.role === 'teacher') {
          localStorage.setItem('userRole', 'teacher');
        }
      }
    } catch (error) {
      console.error('Failed to fetch user role:', error);
    }
  };

  // Teacher role function - for verifying teacher password
  const login = async (password: string) => {
    console.log('Attempting login with password');
    // Using the hardcoded password for teacher role
    if (password === 'teacherme') {
      try {
        console.log('Password correct, setting teacher role');
        // If user is authenticated, update their role in the profiles table
        if (user) {
          console.log('Updating role in Supabase for user:', user.id);
          const { error } = await supabase
            .from('profiles')
            .update({ role: 'teacher' })
            .eq('id', user.id);

          if (error) {
            console.error('Error updating role in Supabase:', error);
          }
        }
        
        // Always set local state and localStorage
        console.log('Setting role to teacher in state and localStorage');
        setRole('teacher');
        localStorage.setItem('userRole', 'teacher');
        return true;
      } catch (error) {
        console.error('Error in login process:', error);
        // Attempt localStorage fallback
        setRole('teacher');
        localStorage.setItem('userRole', 'teacher');
        return true;
      }
    }
    console.log('Password incorrect');
    return false;
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setRole('viewer');
      localStorage.removeItem('userRole');
      toast.success("Logged out successfully");
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error("Failed to log out");
    }
  };

  const isTeacher = () => {
    // Check both state and localStorage to ensure consistency
    return role === 'teacher' || localStorage.getItem('userRole') === 'teacher';
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading, 
      role,
      login,
      logout,
      isTeacher
    }}>
      {children}
    </AuthContext.Provider>
  );
};
