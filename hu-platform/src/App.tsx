import { ToastProvider } from "@/components/ui/toast";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/index";
import SignIn from "./pages/Signin";
import Register from "./pages/Register";
import Events from "./pages/Event";
import Leaderboard from "./pages/Leaderboard";
import Community from "./pages/community";
import Resources from "./pages/Resource";
import ProjectSubmission from "./pages/ProjectSubmission";
import Dashboard from "./pages/Dashboard";
import PasswordReset from "./pages/PasswordReset";
import Calendar from "./pages/Calendar";
import NotFound from "./pages/Notfound";
import TestSupabase from "./pages/testsupabase";
// import { useState, useEffect } from 'react'
// import { supabase } from './lib/supabase'



const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="hackersunity-theme">
      <AuthProvider>
        <TooltipProvider>
          <ToastProvider />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/register" element={<Register />} />
              <Route path="/events" element={<Events />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/community" element={<Community />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/submit-project" element={<ProjectSubmission />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/reset-password" element={<PasswordReset />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/test-supabase" element={<TestSupabase />} />

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
