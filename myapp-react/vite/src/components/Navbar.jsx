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
                    <a href='/' className={`${styles.logo}`}>Palyoplot. </a>

                    <ul className={`${styles.navMenu} ${isActive ? styles.active : ''}`}>
                        <li onClick={removeActive}>
                            <a href='/' className={`${styles.navLink}`}>Home</a>
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
                        <li onClick={removeActive}>
                            <a href='registration' className={`${styles.navLink}`}>Register</a>
                        </li>
                        <li onClick={removeActive}>
                            <a href='Login' className={`${styles.navLink}`}>Login</a>
                        </li>
                    </ul>

                    {/* <RegisterButton/> */}

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