
import React, { useState } from "react";

import styles from "../cssPages/bottomNav.module.css";

import PalyoplotLogo from "../assets/PalyoplotLogo.png";


function BottomNav() {

  const [isActive, setIsActive] = useState(false);


  const toggleActiveClass = () => {
    setIsActive(!isActive);
  };


  const removeActive = () => {
    setIsActive(false);
  };


  return (
    <div className="App">
      <header className="App-header">
        <nav className={`${styles.navbar}`}>
          {/* Navigation links */}
          <ul className={`${styles.navMenu} ${isActive ? styles.active : ""}`}>
            <li onClick={removeActive}>
              <a href="/" className={`${styles.navLink}`}>
                Home
              </a>
            </li>
            <li onClick={removeActive}>
              <a
                href="https://github.com/FaneNo/Palyoplot"
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.navLink}`}
              >
                GitHub
              </a>
            </li>
          </ul>

          {/* Logo (wrapped in an anchor tag) */}
          <a href="/" className={`${styles.logo}`} onClick={removeActive}>
            <img src={PalyoplotLogo} alt="Palyoplot Logo" className={`${styles.logoImage}`} />
          </a>

          {/* Hamburger icon button */}
          <div
            className={`${styles.hamburger} ${isActive ? styles.active : ""}`}
            onClick={toggleActiveClass}
          >
            <span className={`${styles.bar}`}></span>
            <span className={`${styles.bar}`}></span>
            <span className={`${styles.bar}`}></span>
          </div>
        </nav>
      </header>
    </div>
  );
}

// Export the BottomNav component
export default BottomNav;
