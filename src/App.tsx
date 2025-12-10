import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Subjects from "./pages/Subjects";
import SubjectDetail from "./pages/SubjectDetail";
import LearnPage from "./pages/LearnPage";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Analytics from "./pages/Analytics";
import Referral from "./pages/Referral";
import TeacherDashboard from "./pages/TeacherDashboard";
import AdminPanel from "./pages/AdminPanel";
import AuthoringTool from "./pages/AuthoringTool";
import HelpDocs from "./pages/HelpDocs";
import Teachers from "./pages/Teachers";
import Schools from "./pages/Schools";
import OnlineSync from "./components/OnlineSync";
import RoleBasedRoute from "./components/RoleBasedRoute";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <TooltipProvider>
          <Toaster />
          {/* Register online event to sync queued items when connection is restored */}
          <OnlineSync />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/teachers" element={<Teachers />} />
              <Route path="/schools" element={<Schools />} />

              {/* Student Routes */}
              <Route
                path="/dashboard"
                element={
                  <RoleBasedRoute allowedRoles={['student']}>
                    <Dashboard />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/dashboard/subjects"
                element={
                  <RoleBasedRoute allowedRoles={['student']}>
                    <Subjects />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/dashboard/subject/:subjectId"
                element={
                  <RoleBasedRoute allowedRoles={['student']}>
                    <SubjectDetail />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/dashboard/learn/:lessonId"
                element={
                  <RoleBasedRoute allowedRoles={['student']}>
                    <LearnPage />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/dashboard/profile"
                element={
                  <RoleBasedRoute allowedRoles={['student', 'teacher', 'admin', 'school_admin']}>
                    <Profile />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/dashboard/settings"
                element={
                  <RoleBasedRoute allowedRoles={['student', 'teacher', 'admin', 'school_admin']}>
                    <Settings />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/dashboard/analytics"
                element={
                  <RoleBasedRoute allowedRoles={['student']}>
                    <Analytics />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/dashboard/referral"
                element={
                  <RoleBasedRoute allowedRoles={['student']}>
                    <Referral />
                  </RoleBasedRoute>
                }
              />

              {/* Teacher Routes */}
              <Route
                path="/teacher"
                element={
                  <RoleBasedRoute allowedRoles={['teacher']}>
                    <TeacherDashboard />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/authoring"
                element={
                  <RoleBasedRoute allowedRoles={['teacher', 'admin']}>
                    <AuthoringTool />
                  </RoleBasedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <RoleBasedRoute allowedRoles={['admin', 'school_admin']}>
                    <AdminPanel />
                  </RoleBasedRoute>
                }
              />

              <Route path="/help" element={<HelpDocs />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
};

export default App;
