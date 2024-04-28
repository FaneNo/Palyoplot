import React, { useState } from "react";
import styles from "../cssPages/navbarHome.module.css";
import PalyoplotLogo from "../assets/PalyoplotLogo.png"; // Import the logo image

function Navbar() {
  const [isActive, setIsActive] = useState(false);

  const toggleActive = () => {
    setIsActive(!isActive);
  };

  const removeActive = () => {
    setIsActive(false);
  };

  return (
    <header className={styles.header}>
      <nav className={`${styles.navbar}`}>
        <div className={`${styles.logo}`}>
          <a href="/" className={styles.logoLink}>
            <img src={PalyoplotLogo} alt="Palyoplot Logo" className={`${styles.logoImage}`} />
          </a>
        </div>
        <div className={`${styles.centerContainer}`}>
          <ul className={`${styles.navMenu} ${isActive ? styles.active : ""}`}>
            <li onClick={removeActive}>
              <a href="/" className={`${styles.navLink}`}>
                Home
              </a>
            </li>
            <li onClick={removeActive}>
              <a href="dashboard" className={`${styles.navLink}`}>
                Dashboard
              </a>
            </li>
            <li onClick={removeActive}>
              <a href="documentation" className={`${styles.navLink}`}>
                Documentation
              </a>
            </li>
            <li onClick={removeActive}>
              <a href="tutorial" className={`${styles.navLink}`}>
                Tutorial
              </a>
            </li>
            <li onClick={removeActive}>
              <a href="about" className={`${styles.navLink}`}>
                About
              </a>
            </li>
          </ul>
        </div>
        <div className={`${styles.loginNregisBox}`}>
          <a href="login">
            <button className={`${styles.login}`}>Login</button>
          </a>
          <a href="registration">
            <button className={`${styles.register}`}>Register</button>
          </a>
        </div>
        {/* Hamburger icon button */}
        <div
          className={`${styles.hamburger} ${isActive ? styles.active : ""}`}
          onClick={toggleActive}
          role="button"
          tabIndex="0"
          aria-label="Menu"
        >
          <span className={`${styles.bar}`}></span>
          <span className={`${styles.bar}`}></span>
          <span className={`${styles.bar}`}></span>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;

