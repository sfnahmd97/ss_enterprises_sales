import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import ToastProvider from "./components/ToastProvider";

import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import ReportsPage from "./pages/ReportPage";
import SettingsPage from "./pages/Settings";

// Masters



import ListFinishing from "./Masters/Finishing/List";
import AddFinishing from "./Masters/Finishing/Add";
import EditFinishing from "./Masters/Finishing/Edit";


import EditProfile from "./Profile/EditProfile";
import ChangePassword from "./Profile/changePassword";

import CreateOrder from "./pages/Order/Create";

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
          path="/master/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  

                  {/* Finishing */}
                  <Route path="finishing" element={<ListFinishing />} />
                  <Route path="finishing/add" element={<AddFinishing />} />
                  <Route path="finishing/edit/:id" element={<EditFinishing />}/>

                  


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
