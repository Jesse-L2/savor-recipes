import react from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import Login from "./components/Login";
import Recipes from "./components/Recipes";

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Route path="/login" component={Login} />
          <Route path="/recipes" component={Recipes} />
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
