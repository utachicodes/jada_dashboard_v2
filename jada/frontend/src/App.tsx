
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./store/AuthContext";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import DroneRoutePlanner from "./pages/DroneRoutePlanner";
import MissionSummary from "./pages/MissionSummary";
import MissionCreator from "./pages/MissionCreator";
import "./App.scss";
import DroneManagement from "./pages/DroneManagement";
import SideBarSpaceWrapper from "./utils/components/SideBarSpaceWrapper";

// Protected route component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={
        <ProtectedRoute>
          <SideBarSpaceWrapper><Dashboard /></SideBarSpaceWrapper>
        </ProtectedRoute>
      } />
      <Route path="/drones" element={
        <ProtectedRoute>
          <SideBarSpaceWrapper><DroneManagement /></SideBarSpaceWrapper>
        </ProtectedRoute>
      } />
      <Route path="/create-mission" element={
        <ProtectedRoute>
          <MissionCreator />
        </ProtectedRoute>
      } />
      <Route path="/in-progress-mission/:id" element={
        <ProtectedRoute>
          <DroneRoutePlanner />
        </ProtectedRoute>
      } />
      <Route path="/planned-mission/:id" element={
        <ProtectedRoute>
          <DroneRoutePlanner />
        </ProtectedRoute>
      } />
      <Route path="/completed-mission/:id" element={
        <ProtectedRoute>
          <MissionSummary />
        </ProtectedRoute>
      } />
      <Route path="/aborted-mission/:id" element={
        <ProtectedRoute>
          <MissionSummary />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
