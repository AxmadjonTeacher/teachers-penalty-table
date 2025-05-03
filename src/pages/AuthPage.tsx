
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { 
  RadioGroup, 
  RadioGroupItem 
} from "@/components/ui/radio-group";
import { Lock, User } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";

const AuthPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState("viewer");
  const [teacherPasswordOpen, setTeacherPasswordOpen] = useState(false);
  const [teacherPassword, setTeacherPassword] = useState("");
  const navigate = useNavigate();
  const { user, login } = useAuth();

  useEffect(() => {
    // Redirect if user is already logged in
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const verifyTeacherRole = async () => {
    if (teacherPassword === "teacherme") {
      toast.success("Teacher role verified");
      localStorage.setItem("userRole", "teacher");
      setTeacherPasswordOpen(false);
      return true;
    } else {
      toast.error("Invalid teacher password");
      return false;
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // If teacher role is selected, verify password first
    if (selectedRole === "teacher") {
      const verified = await verifyTeacherRole();
      if (!verified) return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: selectedRole,
          }
        }
      });

      if (error) throw error;
      toast.success("Registration successful! Please check your email for verification.");
    } catch (error: any) {
      setError(error.message || "An error occurred during sign up");
      toast.error("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    // If teacher role is selected, verify password first
    if (selectedRole === "teacher") {
      const verified = await verifyTeacherRole();
      if (!verified) return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      toast.success("Logged in successfully!");
      navigate("/");
    } catch (error: any) {
      setError(error.message || "Invalid login credentials");
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#8B5CF6]/10 to-white py-8 px-2 md:px-8">
      <Card className="w-full max-w-md shadow-lg border border-[#8B5CF6]/20 animate-fade-in">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-[#1A1F2C] mb-2">Monitoring App</CardTitle>
          <CardDescription>Login or create an account to access your dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Label className="text-sm font-medium mb-2 block">Select your role</Label>
            <RadioGroup 
              defaultValue="viewer" 
              value={selectedRole} 
              onValueChange={(value) => {
                setSelectedRole(value);
                if (value === "teacher") {
                  setTeacherPasswordOpen(true);
                }
              }}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="viewer" id="viewer" />
                <Label htmlFor="viewer" className="flex items-center gap-2">
                  <User size={16} />
                  Viewer
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="teacher" id="teacher" />
                <Label htmlFor="teacher" className="flex items-center gap-2">
                  <Lock size={16} />
                  Teacher
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-login">Email</Label>
                  <Input
                    id="email-login"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-login">Password</Label>
                  <Input
                    id="password-login"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED]" disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-register">Email</Label>
                  <Input
                    id="email-register"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-register">Password</Label>
                  <Input
                    id="password-register"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED]" disabled={loading}>
                  {loading ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          
          {error && (
            <Alert className="mt-4 border-red-200 text-red-800 bg-red-50">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex justify-center border-t p-4 text-sm text-gray-500">
          Monitoring App — All rights reserved
        </CardFooter>
      </Card>

      {/* Teacher Password Dialog */}
      <Dialog open={teacherPasswordOpen} onOpenChange={setTeacherPasswordOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Teacher Verification</DialogTitle>
            <DialogDescription>
              Please enter the teacher password to access teacher features.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="teacher-password">Teacher Password</Label>
              <Input
                id="teacher-password"
                type="password"
                placeholder="Enter password"
                value={teacherPassword}
                onChange={(e) => setTeacherPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button 
              variant="outline" 
              onClick={() => {
                setTeacherPasswordOpen(false);
                setSelectedRole("viewer");
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={async () => {
                const verified = await verifyTeacherRole();
                if (!verified) {
                  setSelectedRole("viewer");
                }
              }}
              className="bg-[#8B5CF6] hover:bg-[#7C3AED]"
            >
              Verify
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AuthPage;
