import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const PasswordResetConfirm = () => {
  const { uid, token } = useParams();
  const [newPassword1, setNewPassword1] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    const response = await fetch("/api/auth/password/reset/confirm/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        uid,
        token,
        new_password1: newPassword1,
        new_password2: newPassword2,
      }),
    });
    if (response.ok) {
      setMessage("Password reset successful! You can now log in.");
      setTimeout(() => navigate("/login"), 2000);
    } else {
      const data = await response.json();
      setError(data.detail || "Password reset failed.");
    }
  };

  return (
    <div>
      <h2>Reset Your Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="New password"
          value={newPassword1}
          onChange={(e) => setNewPassword1(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm new password"
          value={newPassword2}
          onChange={(e) => setNewPassword2(e.target.value)}
          required
        />
        <button type="submit">Set New Password</button>
      </form>
      {message && <div style={{ color: "green" }}>{message}</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
};

export default PasswordResetConfirm;
