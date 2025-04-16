import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import NotFound from "./components/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import RecipeDetail from "./components/RecipeDetail";
import RecipeList from "./components/RecipeList";
import Landing from "./components/Landing";

function Logout() {
  localStorage.clear(); // clear refresh and access token
  return <Navigate to="/login" />;
}

function RegisterLogout() {
  localStorage.clear();
  return <Register />;
}

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterLogout />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/recipes" element={<RecipeList />} />
          <Route path="/recipes/:id" element={<RecipeDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
