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
                    <div className={`${styles.logo}`}> 
                        <a href='/' className={`${styles.logoText}`}>Palyoplot. </a>
                    </div>
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
                        </ul>
        
                        <div className={`${styles.loginNregisBox}`}>
                            <a href="login">
                                <button className={`${styles.login}`}>Login</button>
                            </a>
                            <a href="registration">
                                <button className={`${styles.register}`}>Register</button>
                            </a>
                            
                        </div>
                   
                    
    
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
    

    // return(
    //     <div className="App">
    //         <header className="App-header">
    //             <nav className={`${styles.navbar}`}>
    //                 <a href='/' className={`${styles.logo}`}>Palyoplot. </a>

    //                 <ul className={`${styles.navMenu} ${isActive ? styles.active : ''}`}>
    //                     <li onClick={removeActive}>
    //                         <a href='/' className={`${styles.navLink}`}>Home</a>
    //                     </li>
    //                     <li onClick={removeActive}>
    //                         <a href='dashboard' className={`${styles.navLink}`}>Dashboard</a>
    //                     </li>
    //                     <li onClick={removeActive}>
    //                         <a href='documentation' className={`${styles.navLink}`}>Documentation</a>
    //                     </li>
    //                     <li onClick={removeActive}>
    //                         <a href='tutorial' className={`${styles.navLink}`}>Tutorial</a>
    //                     </li>
                        
    //                     <li onClick={removeActive}>
    //                         <a href='Login' className={`${styles.login}`}>Login</a>
    //                     </li>
    //                     <li onClick={removeActive}>
    //                         <a href='registration' className={`${styles.register}`}>Register</a>
    //                     </li>
                        
                        
    //                 </ul>

    //                 {/* <RegisterButton/> */}

    //                 {/* when click it will deactivate or active the hamburger icon button */}
    //                 <div className={`${styles.hamburger} ${isActive ? styles.active : ''}`}  onClick={toggleActiveClass}>
    //                     <span className={`${styles.bar}`}></span>
    //                     <span className={`${styles.bar}`}></span>
    //                     <span className={`${styles.bar}`}></span>
    //                 </div>
    //             </nav>

    //         </header>

    //     </div>
    // );
}

export default Navbar;