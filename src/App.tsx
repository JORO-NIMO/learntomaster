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
import AuthRoute from "./components/AuthRoute";
import OnlineSync from "./components/OnlineSync";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
          {/* Register online event to sync queued items when connection is restored */}
          <OnlineSync />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <AuthRoute>
                  <Dashboard />
                </AuthRoute>
              }
            />
            <Route
              path="/dashboard/subjects"
              element={
                <AuthRoute>
                  <Subjects />
                </AuthRoute>
              }
            />
            <Route
              path="/dashboard/learn"
              element={
                <AuthRoute>
                  <LearnPage />
                </AuthRoute>
              }
            />
            <Route path="/subjects" element={<Subjects />} />
            <Route path="/subjects/:subjectId" element={<SubjectDetail />} />
            <Route path="/subjects/:subjectId/topic/:topicId" element={<LearnPage />} />
            <Route
              path="/profile"
              element={
                <AuthRoute>
                  <Profile />
                </AuthRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <AuthRoute>
                  <Settings />
                </AuthRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <AuthRoute>
                  <Analytics />
                </AuthRoute>
              }
            />
            <Route
              path="/referral"
              element={
                <AuthRoute>
                  <Referral />
                </AuthRoute>
              }
            />
            <Route
              path="/teacher"
              element={
                <AuthRoute>
                  <TeacherDashboard />
                </AuthRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <AuthRoute>
                  <AdminPanel />
                </AuthRoute>
              }
            />
            <Route
              path="/authoring"
              element={
                <AuthRoute>
                  <AuthoringTool />
                </AuthRoute>
              }
            />
            <Route
              path="/help"
              element={
                <AuthRoute>
                  <HelpDocs />
                </AuthRoute>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
