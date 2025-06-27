import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import AuthForm from "./components/AuthForm";
import Landing from "./components/Landing";
import Dashboard from "./pages/Dashboard";

// Protected route component using our auth context
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    // Show loading spinner or message while checking auth status
    return <div className="loading">Loading...</div>;
  }
  return user ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  const { user } = useAuth();
  return (
    <Routes>
      <Route
        path="/login"
        element={<AuthForm route="/token/" method="login" />}
      />
      <Route
        path="/register"
        element={<AuthForm route="/register/" method="register" />}
      />
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      {/* Root route: show Landing if not logged in, Dashboard if logged in */}
      <Route
        path="/"
        element={user ? <Navigate to="/dashboard" /> : <Landing />}
      />
      {/* Catch-all: send to dashboard if logged in, else to landing */}
      <Route
        path="*"
        element={user ? <Navigate to="/dashboard" /> : <Landing />}
      />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
