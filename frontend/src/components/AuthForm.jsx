// src/components/AuthForm.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "../contexts/AuthContext";

const AuthForm = ({ route, method }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login, register } = useAuth();
  
  const name = method === "login" ? "Login" : "Register";
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    try {
      let success;
      
      if (method === "login") {
        success = await login(username, password);
        if (success) {
          navigate("/dashboard");
        } else {
          setError("Invalid credentials");
        }
      } else {
        success = await register(username, password);
        if (success) {
          navigate("/login");
          alert("Registration successful! Please login.");
        } else {
          setError("Registration failed. Username may already be taken.");
        }
      }
    } catch (err) {
      setError(err.message || "An error occurred");
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h1>{name}</h1>
      
      {error && (
        <div className="error-message" style={{ color: "red", marginBottom: "10px" }}>
          {error}
        </div>
      )}
      
      <input
        className="form-input"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="User Name"
        required
      />
      
      <input
        className="form-input"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      
      <button className="form-button" type="submit">
        {name}
      </button>
    </form>
  );
};

AuthForm.propTypes = {
  route: PropTypes.string.isRequired,
  method: PropTypes.oneOf(["login", "register"]).isRequired,
};

export default AuthForm;
