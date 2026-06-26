import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import SiteLayout from "@/components/layout/SiteLayout";
import Landing from "@/pages/Landing";
import Learn from "@/pages/Learn";
import Calculator from "@/pages/Calculator";
import PhotoPlanner from "@/pages/PhotoPlanner";
import Clinics from "@/pages/Clinics";
import CostEstimator from "@/pages/CostEstimator";
import Recovery from "@/pages/Recovery";
import Medications from "@/pages/Medications";
import Profile from "@/pages/Profile";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<SiteLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/calculator" element={<Calculator />} />
            <Route path="/photo-planner" element={<PhotoPlanner />} />
            <Route path="/clinics" element={<Clinics />} />
            <Route path="/cost" element={<CostEstimator />} />
            <Route path="/recovery" element={<Recovery />} />
            <Route path="/medications" element={<Medications />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
