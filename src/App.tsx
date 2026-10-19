import React, { useEffect } from 'react';
import { RouterProvider, useRouter } from './context/RouterContext';
import { AuthProvider } from './context/AuthContext';
import { ClinicSettingsProvider, useClinicSettings } from './context/ClinicSettingsContext';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/admin/ProtectedRoute';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { DoctorsPage } from './pages/DoctorsPage';
import { ServicesPage } from './pages/ServicesPage';
import { AppointmentPage } from './pages/AppointmentPage';
import { AppointmentLookupPage } from './pages/AppointmentLookupPage';
import { ContactPage } from './pages/ContactPage';
import { PostersPage } from './pages/PostersPage';
import { HospitalTourPage } from './pages/HospitalTourPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminDoctorsPage } from './pages/admin/AdminDoctorsPage';
import { AdminServicesPage } from './pages/admin/AdminServicesPage';
import { AdminAppointmentsPage } from './pages/admin/AdminAppointmentsPage';
import { AdminInquiriesPage } from './pages/admin/AdminInquiriesPage';
import { AdminPostersPage } from './pages/admin/AdminPostersPage';
import { AdminSalariesPage } from './pages/admin/AdminSalariesPage';
import { AdminReviewsPage } from './pages/admin/AdminReviewsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

const AppContent: React.FC = () => {
  const { currentPath } = useRouter();
  const { settings } = useClinicSettings();

  // Dynamic Title Management for SEO, Accessibility & Clinical Portal
  useEffect(() => {
    const brand = settings.name || 'Lady Doctor Clinic';
    const titles: Record<string, string> = {
      '/': `${brand} – Women-Focused Healthcare & Consultations`,
      '/about': `About Us – ${brand} | Mission & Clinical Philosophy`,
      '/doctors': `Our Lady Doctors – ${brand}`,
      '/services': `Medical Services & Diagnostics – ${brand}`,
      '/appointment': `Book an Appointment – ${brand}`,
      '/lookup': `Track Appointment Status – ${brand}`,
      '/status': `Track Appointment Status – ${brand}`,
      '/appointment-lookup': `Track Appointment Status – ${brand}`,
      '/appointment/lookup': `Track Appointment Status – ${brand}`,
      '/posters': `Official Healthcare Posters & Updates – ${brand}`,
      '/tour': `Virtual Hospital Video Tour – ${brand} Walkthrough`,
      '/contact': `Contact & Location – ${brand}`,
      '/admin/login': `Staff Login – ${brand} Portal`,
      '/admin': `Clinical Dashboard – ${brand} Management`,
      '/admin/doctors': `Manage Doctors – ${brand} Portal`,
      '/admin/services': `Manage Services – ${brand} Portal`,
      '/admin/appointments': `Manage Appointments – ${brand} Portal`,
      '/admin/inquiries': `Patient Inquiries – ${brand} Portal`,
      '/admin/posters': `Manage Posters – ${brand} Portal`,
      '/admin/salaries': `Doctor Compensation – ${brand} Portal`,
      '/admin/reviews': `Patient Reviews Moderation – ${brand} Portal`,
      '/admin/settings': `Website & Clinic Settings – ${brand} Portal`,
    };

    document.title = titles[currentPath] || brand;
  }, [currentPath, settings.name]);

  // Admin routes handle their own layout and protection
  if (currentPath === '/admin/login') {
    return <AdminLoginPage />;
  }

  if (currentPath === '/admin') {
    return (
      <ProtectedRoute>
        <AdminDashboardPage />
      </ProtectedRoute>
    );
  }

  if (currentPath === '/admin/doctors') {
    return (
      <ProtectedRoute allowedRoles={['admin']}>
        <AdminDoctorsPage />
      </ProtectedRoute>
    );
  }

  if (currentPath === '/admin/services') {
    return (
      <ProtectedRoute allowedRoles={['admin']}>
        <AdminServicesPage />
      </ProtectedRoute>
    );
  }

  if (currentPath === '/admin/appointments') {
    return (
      <ProtectedRoute>
        <AdminAppointmentsPage />
      </ProtectedRoute>
    );
  }

  if (currentPath === '/admin/inquiries') {
    return (
      <ProtectedRoute>
        <AdminInquiriesPage />
      </ProtectedRoute>
    );
  }

  if (currentPath === '/admin/posters') {
    return (
      <ProtectedRoute>
        <AdminPostersPage />
      </ProtectedRoute>
    );
  }

  if (currentPath === '/admin/salaries') {
    return (
      <ProtectedRoute allowedRoles={['admin']}>
        <AdminSalariesPage />
      </ProtectedRoute>
    );
  }

  if (currentPath === '/admin/reviews') {
    return (
      <ProtectedRoute>
        <AdminReviewsPage />
      </ProtectedRoute>
    );
  }

  if (currentPath === '/admin/settings') {
    return (
      <ProtectedRoute>
        <AdminSettingsPage />
      </ProtectedRoute>
    );
  }

  // Public clinic pages wrapped in standard public layout
  const renderPublicPage = () => {
    switch (currentPath) {
      case '/':
        return <HomePage />;
      case '/about':
        return <AboutPage />;
      case '/doctors':
        return <DoctorsPage />;
      case '/services':
        return <ServicesPage />;
      case '/appointment':
        return <AppointmentPage />;
      case '/lookup':
      case '/status':
      case '/appointment-lookup':
      case '/appointment/lookup':
        return <AppointmentLookupPage />;
      case '/posters':
        return <PostersPage />;
      case '/tour':
        return <HospitalTourPage />;
      case '/contact':
        return <ContactPage />;
      default:
        return <HomePage />;
    }
  };

  return <Layout>{renderPublicPage()}</Layout>;
};

export default function App() {
  return (
    <RouterProvider>
      <AuthProvider>
        <ClinicSettingsProvider>
          <AppContent />
        </ClinicSettingsProvider>
      </AuthProvider>
    </RouterProvider>
  );
}
