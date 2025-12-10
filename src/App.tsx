import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import StudentDashboard from "./pages/dashboard/StudentDashboard";
import Subjects from "./pages/Subjects";
import SubjectDetail from "./pages/SubjectDetail";
import LearnPage from "./pages/LearnPage";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Analytics from "./pages/Analytics";
import Referral from "./pages/Referral";
import TeacherDashboard from "./pages/dashboard/TeacherDashboard";
import AdminPanel from "./pages/AdminPanel";
import AuthoringTool from "./pages/AuthoringTool";
import HelpDocs from "./pages/HelpDocs";
import Teachers from "./pages/Teachers";
import Schools from "./pages/Schools";
import Students from "./pages/Students";
import Pricing from "./pages/Pricing";
import Demo from "./pages/Demo";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import Community from "./pages/Community";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import PublicSubjects from "./pages/PublicSubjects";
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
              <Route path="/students" element={<Students />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/demo" element={<Demo />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/community" element={<Community />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/subjects" element={<PublicSubjects />} />
              <Route path="/subjects/:id" element={<PublicSubjects />} /> {/* Redirect/Showcase for public */}

              {/* Student Routes */}
              <Route
                path="/dashboard"
                element={
                  <RoleBasedRoute allowedRoles={['student']}>
                    <StudentDashboard />
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
