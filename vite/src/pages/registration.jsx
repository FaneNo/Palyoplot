// Registration.jsx
import React, { useState } from "react";
import styles from "../cssPages/registrationPage.module.css";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../token";
import api from "../api";
import { useNavigate } from "react-router-dom"; // Import useNavigate

function Registration() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" }); // Added message state
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage({ text: "", type: "" }); // Reset message
    setLoading(true); // Start loading

    // Frontend Validations
    if (password.length < 8) {
      setMessage({ text: "Password must be at least 8 characters long.", type: "error" });
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setMessage({ text: "Passwords do not match.", type: "error" });
      setLoading(false);
      return;
    }

    console.log({
      username,
      email,
      password,
      confirmPassword,
    });

    try {
      const res = await api.post("/api/user/register", {
        username,
        email,
        password,
      });
      setMessage({ text: "Registration successful! Redirecting to login...", type: "success" });
      // Optionally, you can navigate after a short delay to allow users to read the message
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Registration Error:", error);
      // Extract error message from backend response if available
      const errorMsg = error.response?.data?.error || "Registration failed. Please try again.";
      setMessage({ text: errorMsg, type: "error" });
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <>
      <div className={styles.registrationContainer}>
        <form onSubmit={handleSubmit} className={styles.registrationForm}>
          <h1 className={styles.registrationTitle}>Registration</h1>

          {/* Display Success or Error Messages */}
          {message.text && (
            <div
              className={`${styles.message} ${
                message.type === "error" ? styles.errorMessage : styles.successMessage
              }`}
            >
              {message.text}
            </div>
          )}

          <div className={styles.formGroup}>
            <label className={styles.registrationLabel}>Username</label>
            <input
              type="text"
              className={styles.registrationInput}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.registrationLabel}>Email</label>
            <input
              type="email"
              className={styles.registrationInput}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.registrationLabel}>Password</label>
            <input
              type="password"
              className={styles.registrationInput}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.registrationLabel}>Confirm Password</label>
            <input
              type="password"
              className={styles.registrationInput}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <button
              type="submit"
              className={styles.registrationButton}
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default Registration;
