import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import ToastProvider from "./components/ToastProvider";

import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import ReportsPage from "./pages/ReportPage";
import SettingsPage from "./pages/Settings";


import EditProfile from "./Profile/EditProfile";
import ChangePassword from "./Profile/changePassword";

{/* Order */}
import CreateOrder from "./pages/Order/Create";
import ListOrder from "./pages/Order/List";
import Details from "./pages/Order/Details";

import CustomersList from "./pages/Customer/List";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="reports" element={<ReportsPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Master Group */}
        <Route
          path="/customers/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  
                  {/* Finishing */}
                  <Route path="list" element={<CustomersList />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="create" element={<CreateOrder />} />
                  <Route path="list" element={<ListOrder />} />
                  <Route path="details/:id" element={<Details />}/>
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>

                  <Route path="edit" element={<EditProfile />}/>
                  <Route path="change-password" element={<ChangePassword />}/>

                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Catch-all → redirect to login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>

      <ToastProvider />
    </BrowserRouter>
  );
}
