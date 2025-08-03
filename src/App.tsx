import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import AuthPage from "./pages/AuthPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./components/AdminLayout";
import AdminInquiries from "./pages/AdminInquiries";
import CompanyDetail from "./pages/CompanyDetail";
import { ClientRoute } from "./components/ClientRoute";
import { ClientPortalLayout } from "./components/ClientPortalLayout";
import ClientPortalDashboard from "./pages/ClientPortalDashboard";
import GlossaryPage from "./pages/GlossaryPage";
import EBITDACoursePage from "./pages/EBITDACoursePage";
import AssetWorkshopPage from "./pages/AssetWorkshopPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route 
            path="/admin/dashboard" 
            element={
              <AdminRoute>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/inquiries" 
            element={
              <AdminRoute>
                <AdminLayout>
                  <AdminInquiries />
                </AdminLayout>
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/companies/:id" 
            element={
              <AdminRoute>
                <AdminLayout>
                  <CompanyDetail />
                </AdminLayout>
              </AdminRoute>
            } 
          />
          
          {/* Client Portal Routes */}
          <Route 
            path="/portal" 
            element={
              <ClientRoute>
                <ClientPortalLayout>
                  <ClientPortalDashboard />
                </ClientPortalLayout>
              </ClientRoute>
            } 
          />
          <Route 
            path="/portal/week-1/glossary" 
            element={
              <ClientRoute>
                <ClientPortalLayout>
                  <GlossaryPage />
                </ClientPortalLayout>
              </ClientRoute>
            } 
          />
          <Route 
            path="/portal/week-1/ebitda-course" 
            element={
              <ClientRoute>
                <ClientPortalLayout>
                  <EBITDACoursePage />
                </ClientPortalLayout>
              </ClientRoute>
            } 
          />
          <Route 
            path="/portal/week-1/asset-workshop" 
            element={
              <ClientRoute>
                <ClientPortalLayout>
                  <AssetWorkshopPage />
                </ClientPortalLayout>
              </ClientRoute>
            } 
          />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
