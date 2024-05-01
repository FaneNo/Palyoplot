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
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
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
      navigate("/login");
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
     
      <div className={styles.registrationContainer}>
        <form onSubmit={handleSubmit} className={styles.registrationForm}>
          <h1 className={styles.registrationTitle}>Registration</h1>
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
            <button type="submit" className={styles.registrationButton}>
              Register
            </button>
          </div>
        </form>
      </div>
     
    </>

  );
}

export default Registration;
