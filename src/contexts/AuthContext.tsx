
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
        setSession(session);
        setUser(session?.user ?? null);
        
        // If session exists, fetch the user's role from profiles
        if (session?.user) {
          setTimeout(() => {
            fetchUserRole(session.user.id);
          }, 0);
        } else {
          setRole('viewer');
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      // If session exists, fetch the user's role
      if (session?.user) {
        fetchUserRole(session.user.id);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRole = async (userId: string) => {
    try {
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
        setRole(data.role);
      }
    } catch (error) {
      console.error('Failed to fetch user role:', error);
    }
  };

  // Backward compatibility with old auth system
  const login = async (password: string) => {
    // Using the hardcoded password for teacher role (for backward compatibility)
    if (password === 'teacherme') {
      // If user is authenticated, update their role in the profiles table
      if (user) {
        try {
          const { error } = await supabase
            .from('profiles')
            .update({ role: 'teacher' })
            .eq('id', user.id);

          if (error) throw error;
          setRole('teacher');
          // Save role to localStorage for backward compatibility
          localStorage.setItem('userRole', 'teacher');
          return true;
        } catch (error) {
          console.error('Error updating role:', error);
          return false;
        }
      } else {
        // Legacy behavior if no user is logged in
        setRole('teacher');
        localStorage.setItem('userRole', 'teacher');
        return true;
      }
    }
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
    }
  };

  const isTeacher = () => role === 'teacher';

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
