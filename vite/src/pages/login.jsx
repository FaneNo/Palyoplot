import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import styles from "../cssPages/loginPage.module.css";
import { ACCESS_TOKEN,REFRESH_TOKEN } from "../token";
import api from "../api";


function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Create a navigate function

  const handleSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();
    console.log({
      username,
      password,
    });
    // Authentication logic here
    try {
      const res = await api.post("/api/token/", {username, password})
      localStorage.setItem(ACCESS_TOKEN, res.data.access);
      localStorage.setItem(REFRESH_TOKEN, res.data.access);
      navigate("/");
    } catch (error) {
      alert(error)
    } finally{
      setLoading(false)
    }
  };

  return (
    <>
   
    <div className={styles.loginBackground}>
      <div className={styles.loginContainer}>
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <h1 className={styles.loginTitle}>Login</h1>
          <div className={styles.formGroup}>
            <label className={styles.loginLabel}>Username</label>
            <input
              type="text"
              className={styles.loginInput}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.loginLabel}>Password</label>
            <input
              type="password"
              className={styles.loginInput}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <button type="submit" className={styles.loginButton}>
              Login
            </button>
            <button
              type="button"
              className={styles.registerButton}
              onClick={() => navigate("/registration")}
            >
              Register Account
            </button>
          </div>
        </form>
      </div>
    </div>
    
    </>
  );
}

export default Login;

