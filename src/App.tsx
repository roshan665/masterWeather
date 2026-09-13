import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { MockDataProvider } from './context/MockDataContext';
import { LiveWeatherProvider } from './context/LiveWeatherContext';
import { AppShell } from './layouts/AppShell';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Auth Page
import { LoginPage } from './pages/auth/LoginPage';

// Farmer Pages
import { FarmerHomePage } from './pages/farmer/FarmerHomePage';
import { WeatherPage } from './pages/farmer/WeatherPage';
import { ForecastPage } from './pages/farmer/ForecastPage';
import { RisksPage } from './pages/farmer/RisksPage';
import { AdvisoriesPage } from './pages/farmer/AdvisoriesPage';
import { AlertsPage } from './pages/farmer/AlertsPage';
import { ObservationsPage } from './pages/farmer/ObservationsPage';
import { FeedbackPage } from './pages/farmer/FeedbackPage';
import { SettingsPage } from './pages/farmer/SettingsPage';

// Officer Pages
import { OfficerDashboard } from './pages/officer/OfficerDashboard';
import { OfficerMapPage } from './pages/officer/OfficerMapPage';
import { OfficerForecastsPage } from './pages/officer/OfficerForecastsPage';
import { OfficerRisksPage } from './pages/officer/OfficerRisksPage';
import { OfficerAdvisoriesPage } from './pages/officer/OfficerAdvisoriesPage';
import { OfficerObservationsPage } from './pages/officer/OfficerObservationsPage';
import { OfficerAlertsPage } from './pages/officer/OfficerAlertsPage';
import { OfficerAnalyticsPage } from './pages/officer/OfficerAnalyticsPage';

// Admin & Research Pages
import { AdminDashboard } from './pages/admin/AdminPages';
import { AdvisoryRulesPage } from './pages/admin/AdvisoryRulesPage';
import { ResearchDashboard } from './pages/research/ResearchPages';

export const App: React.FC = () => {
  return (
    <AppProvider>
      <LiveWeatherProvider>
        <AuthProvider>
          <MockDataProvider>
            <BrowserRouter>
              <Routes>
              {/* Standalone Login Route */}
              <Route path="/login" element={<LoginPage />} />

              {/* Main Application Shell Routes */}
              <Route element={<AppShell />}>
                {/* Farmer / Public Routes */}
                <Route path="/" element={<FarmerHomePage />} />
                <Route path="/weather" element={<WeatherPage />} />
                <Route path="/forecast" element={<ForecastPage />} />
                <Route path="/risks" element={<RisksPage />} />
                <Route path="/advisories" element={<AdvisoriesPage />} />
                <Route path="/alerts" element={<AlertsPage />} />
                <Route path="/observations" element={<ObservationsPage />} />
                <Route path="/feedback" element={<FeedbackPage />} />
                <Route path="/settings" element={<SettingsPage />} />

                {/* Protected Officer Command Center Routes (Officer / Admin) */}
                <Route
                  path="/officer"
                  element={
                    <ProtectedRoute allowedRoles={['officer', 'admin']}>
                      <OfficerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/officer/map"
                  element={
                    <ProtectedRoute allowedRoles={['officer', 'admin']}>
                      <OfficerMapPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/officer/forecasts"
                  element={
                    <ProtectedRoute allowedRoles={['officer', 'admin']}>
                      <OfficerForecastsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/officer/risks"
                  element={
                    <ProtectedRoute allowedRoles={['officer', 'admin']}>
                      <OfficerRisksPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/officer/advisories"
                  element={
                    <ProtectedRoute allowedRoles={['officer', 'admin']}>
                      <OfficerAdvisoriesPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/officer/observations"
                  element={
                    <ProtectedRoute allowedRoles={['officer', 'admin']}>
                      <OfficerObservationsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/officer/alerts"
                  element={
                    <ProtectedRoute allowedRoles={['officer', 'admin']}>
                      <OfficerAlertsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/officer/analytics"
                  element={
                    <ProtectedRoute allowedRoles={['officer', 'admin']}>
                      <OfficerAnalyticsPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/officer/rules"
                  element={
                    <ProtectedRoute allowedRoles={['officer', 'admin']}>
                      <AdvisoryRulesPage />
                    </ProtectedRoute>
                  }
                />

                {/* Protected Admin Portal Routes (Admin only) */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/panchayats"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/rules"
                  element={
                    <ProtectedRoute allowedRoles={['admin', 'officer']}>
                      <AdvisoryRulesPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/data-sources"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/audit"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/telemetry"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Protected Research Lab Routes (Researcher / Admin) */}
                <Route
                  path="/research"
                  element={
                    <ProtectedRoute allowedRoles={['researcher', 'admin']}>
                      <ResearchDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/research/calculators"
                  element={
                    <ProtectedRoute allowedRoles={['researcher', 'admin']}>
                      <ResearchDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/research/benchmarks"
                  element={
                    <ProtectedRoute allowedRoles={['researcher', 'admin']}>
                      <ResearchDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/research/models"
                  element={
                    <ProtectedRoute allowedRoles={['researcher', 'admin']}>
                      <ResearchDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/research/experiments"
                  element={
                    <ProtectedRoute allowedRoles={['researcher', 'admin']}>
                      <ResearchDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Catch-all fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </BrowserRouter>
          </MockDataProvider>
        </AuthProvider>
      </LiveWeatherProvider>
    </AppProvider>
  );
};

export default App;

