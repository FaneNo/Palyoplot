import { useState } from "react";
import styles from "../cssPages/navbarHome.module.css";

function Navbar() {
    const [isActive, setIsActive] = useState(false);

    const toggleActiveClass = () => {
        setIsActive(!isActive);
    }

    const removeActive = () => {
        setIsActive(false);
    }

    return(
        <div className="App">
            <header className="App-header">
                <nav className={`${styles.navbar}`}>
                    <a href='home' className={`${styles.logo}`}>Palyoplot. </a>

                    <ul className={`${styles.navMenu} ${isActive ? styles.active : ''}`}>
                        <li onClick={removeActive}>
                            <a href='home' className={`${styles.navLink}`}>Home</a>
                        </li>
                        <li onClick={removeActive}>
                            <a href='dashboard' className={`${styles.navLink}`}>Dashboard</a>
                        </li>
                        <li onClick={removeActive}>
                            <a href='documentation' className={`${styles.navLink}`}>Documentation</a>
                        </li>
                        <li onClick={removeActive}>
                            <a href='tutorial' className={`${styles.navLink}`}>Tutorial</a>
                        </li>
                    </ul>

                    {/* when click it will deactivate or active the hamburger icon button */}
                    <div className={`${styles.hamburger} ${isActive ? styles.active : ''}`}  onClick={toggleActiveClass}>
                        <span className={`${styles.bar}`}></span>
                        <span className={`${styles.bar}`}></span>
                        <span className={`${styles.bar}`}></span>
                    </div>
                </nav>

            </header>

        </div>
    );
}

export default Navbar;