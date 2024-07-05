import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import api from "../../api";

import React from "react";

const AuthForm = ({ route, method }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const name = method === "login" ? "Login" : "Register";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(route, { username, password });
      if (method === "login") {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        navigate("/");
      } else {
        navigate("/login");
      }
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>{name}</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">{name}</button>
      </form>
    </div>
  );
};

export default AuthForm;