import styles from "../cssPages/profilePage.module.css";
import React, { useState } from "react";
import DashboardNav from "../components/dashboardNav";
import api from "../api";

function Profile() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage({ text: "", type: "" });

    // Validate passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ text: "New passwords do not match", type: "error" });
      return;
    }

    try {
      const response = await api.post("/api/update-password/", {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      setMessage({ text: "Password updated successfully!", type: "success" });
      // Clear form
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
      <div className={styles.profileNavBox}>
        <DashboardNav />
        <div className={styles.profileNavLeft}>
          <div className={styles.dashboardAccContainer}>
            <h2 className={styles.dashboardAccInfoTitle}>Update Password</h2>
            {message.text && (
              <div
                className={`${styles.message} ${
                  message.type === "error" ? styles.error : styles.success
                }`}
              >
                {message.text}
              </div>
            )}
            <form onSubmit={handleSubmit} className={styles.dashboardAccForm}>
              <div className={styles.dashboardInput}>
                <label htmlFor="currentPassword">Current Password</label>
                <input
                  id="currentPassword"
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.dashboardInput}>
                <label htmlFor="newPassword">New Password</label>
                <input
                  id="newPassword"
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.dashboardInput}>
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className={styles.dashboardUpdate}>
                Update Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;