import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./scenes/login";
import Register from "./scenes/register";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import Invoices from "./scenes/invoices";
import Chat from "./scenes/chat";
import Ticket from "./scenes/ticket";
import AIAgents from "./scenes/ai-agents";
import Layout from "./scenes/global/Layout";
import NewInbox from "./scenes/inbox/new-inbox";
import AgentSettings from "./scenes/ai-agents/[id]";
import ConnectedPlatform from "./scenes/connected-platforms";
// import { useSelector } from "react-redux";
import NotFound from "./scenes/NotFound";
import { ProtectedRoute, PublicRoute } from "./routes/ProtectedRoute";

const AppRoutes = () => {
  return (
    <div className="">
      <Routes>
        {/* Public routes - redirect to dashboard if logged in */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* Protected routes - redirect to login if not logged in */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Layout>
                <Chat />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/ticket"
          element={
            <ProtectedRoute>
              <Layout>
                <Ticket />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/team"
          element={
            <ProtectedRoute>
              <Layout>
                <Team />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/invoices"
          element={
            <ProtectedRoute>
              <Layout>
                <Invoices />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/ai-agents"
          element={
            <ProtectedRoute>
              <Layout>
                <AIAgents />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/ai-agents/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <AgentSettings />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/connected-platforms"
          element={
            <ProtectedRoute>
              <Layout>
                <ConnectedPlatform />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/inbox/new-inbox"
          element={
            <ProtectedRoute>
              <Layout>
                <NewInbox />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Catch all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default AppRoutes;
