
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { AuthGuard } from "./components/AuthGuard";
import { HelpButton } from "./components/HelpButton";
import Index from "./pages/Index";
import TeacherPage from "./pages/TeacherPage";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <HelpButton />
          <Routes>
            {/* Public routes */}
            <Route element={<AuthGuard requireAuth={false} />}>
              <Route path="/auth" element={<AuthPage />} />
            </Route>
            
            {/* Protected routes */}
            <Route element={<AuthGuard requireAuth={true} />}>
              <Route path="/" element={<Index />} />
              <Route path="/teacher/:teacherId" element={<TeacherPage />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
