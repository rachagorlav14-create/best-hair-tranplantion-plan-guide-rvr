import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import { AuthProvider } from "@/contexts/AuthContext";
import RequireAuth from "@/components/RequireAuth";
import SiteLayout from "@/components/layout/SiteLayout";
import Landing from "@/pages/Landing";
import Auth from "@/pages/Auth";
import Learn from "@/pages/Learn";
import Calculator from "@/pages/Calculator";
import PhotoAssessment from "@/pages/PhotoAssessment";
import Clinics from "@/pages/Clinics";
import ClinicDetail from "@/pages/ClinicDetail";
import ClinicCompare from "@/pages/ClinicCompare";
import CostEstimator from "@/pages/CostEstimator";
import Recovery from "@/pages/Recovery";
import Medications from "@/pages/Medications";
import PreOp from "@/pages/PreOp";
import Planning from "@/pages/Planning";
import Profile from "@/pages/Profile";
import Admin from "@/pages/Admin";
import View360 from "@/pages/View360";
import HTPlan from "@/pages/HTPlan";
import Doctors from "@/pages/Doctors";
import BaldnessLibrary from "@/pages/BaldnessLibrary";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route element={<SiteLayout />}>
              <Route path="/" element={<Landing />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/learn" element={<Learn />} />
              <Route path="/calculator" element={<Calculator />} />
              <Route path="/photo-assessment" element={<RequireAuth><PhotoAssessment /></RequireAuth>} />
              <Route path="/planning" element={<RequireAuth><Planning /></RequireAuth>} />
              <Route path="/clinics" element={<Clinics />} />
              <Route path="/clinics/:id" element={<ClinicDetail />} />
              <Route path="/compare" element={<ClinicCompare />} />
              <Route path="/cost" element={<CostEstimator />} />
              <Route path="/pre-op" element={<PreOp />} />
              <Route path="/recovery" element={<RequireAuth><Recovery /></RequireAuth>} />
              <Route path="/medications" element={<RequireAuth><Medications /></RequireAuth>} />
              <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
              <Route path="/admin" element={<RequireAuth adminOnly><Admin /></RequireAuth>} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
