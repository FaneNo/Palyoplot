import { useState } from "react";
import styles from "../cssPages/bottomNav.module.css";

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
                Github
              </a>
            </li>
          </ul>

          {/* <RegisterButton/> */}

          {/* when click it will deactivate or active the hamburger icon button */}
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

export default BottomNav;
