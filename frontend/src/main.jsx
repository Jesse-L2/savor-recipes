import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from "./contexts/AuthContext.jsx"; // Import the AuthContext provider

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* BrowserRouter enables client-side routing */}
    <BrowserRouter>
      {/* AuthContextProvider makes authentication state available throughout the app */}
      <AuthContextProvider>
        {/* The main application component */}
        <App />
      </AuthContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
