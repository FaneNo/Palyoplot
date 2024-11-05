import React, { useState, useContext } from "react";
import { useNavigate, } from "react-router-dom"; // Import useNavigate
import styles from "../cssPages/loginPage.module.css";
import api from "../api";
import { AuthContext } from "../contexts/authContext";



function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Create a navigate function
  const { login } = useContext(AuthContext);

  const handleSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();

    try {
      const res = await api.post("/api/token/", { username, password });
      const accessToken = res.data.access;
      const refreshToken = res.data.refresh;
  
      login(accessToken, refreshToken); // Use login function from AuthContext
  
      navigate("/");
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  return (
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
            <button type="submit" className={styles.loginButton} disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
            <button
              type="button"
              className={styles.registerButton}
              onClick={() => navigate("/registration")}
            >
              Register Account
            </button>
          </div>
          <div className={styles.formGroup}>
  <a
    href="http://127.0.0.1:8000/password-reset/"
    className={styles.forgotPasswordLink}
  >
    Forgot Password?
  </a>
</div>

        </form>
      </div>
    </div>
  );
}

export default Login;

