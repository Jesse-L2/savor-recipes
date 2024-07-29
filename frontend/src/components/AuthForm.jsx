import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import api from "../api";
import PropTypes from "prop-types";

const AuthForm = ({ route, method }) => {
  // method - register or login
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const name = method === "login" ? "Login" : "Register";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(route, { username, password });
      if (method === "login") {
        // console.log(`Method is ${method}`);
        // console.log(`Access: ${res.data.access}`);
        // console.log(`Refresh: ${res.data.refresh}`);
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        navigate("/");
      } else {
        navigate("/login");
      }
    } catch (err) {
      // console.log(ACCESS_TOKEN);
      // console.log(REFRESH_TOKEN);
      alert(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h1>{name}</h1>
      <input
        className="form-input"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="User Name"
      />
      <input
        className="form-input"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
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
