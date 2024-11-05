// Profile.jsx
import React, { useState } from "react";
import DashboardNav from "../components/dashboardNav";
import api from "../api";
import styles from "../cssPages/profilePage.module.css";

const Profile = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage({ text: "", type: "" });
    setLoading(true);

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ text: "New passwords do not match", type: "error" });
      setLoading(false);
      return;
    }

    if (formData.newPassword.length < 8) {
      setMessage({ text: "Password must be at least 8 characters long", type: "error" });
      setLoading(false);
      return;
    }

    try {
      const response = await api.post("/api/update-password/", {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      setMessage({ text: "Password updated successfully!", type: "success" });
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      setMessage({
        text: error.response?.data?.error || "Error updating password",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className={styles.profileBody}>
      <div className={styles.profileLayout}>
        <DashboardNav />
        <div className={styles.contentContainer}>
          <div className={styles.formCard}>
            <h2 className={styles.formTitle}>Update Password</h2>
            
            {message.text && (
              <div className={`${styles.message} ${
                message.type === "error" ? styles.errorMessage : styles.successMessage
              }`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label 
                  htmlFor="currentPassword" 
                  className={styles.formLabel}
                >
                  Current Password
                </label>
                <input
                  id="currentPassword"
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  required
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label 
                  htmlFor="newPassword" 
                  className={styles.formLabel}
                >
                  New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label 
                  htmlFor="confirmPassword" 
                  className={styles.formLabel}
                >
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className={styles.formInput}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`${styles.submitButton} ${loading ? styles.buttonLoading : ''}`}
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;