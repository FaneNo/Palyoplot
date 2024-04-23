import styles from '../cssPages/profilePage.module.css'
import React, {useState} from 'react';
import DashboardNav from "../components/dashboardNav";

function Profile() {
    const [userInfo, setUserInfo] = useState ({
        //place holder for user info, will grab from server in future
        username: "HerkyHornet",
        password: "Herky1234",
        email: "herkyhornet@csus.edu"

    });

    const infoUpdate = (event) => {
        //handles form submission for updates
        event.preventDefault();
    }

    const infoChange = (event) => {
        const {name, value} = event.target;
        setUserInfo((prevInfo) => ({
            ...prevInfo,
            [name]: value
        }));
    };
    return(
        <>
        
        <div className={`${styles.profileBody}`}>
            <div className={`${styles.profileNavBox}`}>
                <DashboardNav/>
                <div className={`${styles.profileNavLeft}`}>
                    <div className={styles.dashboardAccContainer}>
        
                        <h2 className={styles.dashboardAccInfoTitle}>Account Info</h2>
                        <form onSubmit={infoUpdate} className={styles.dashboardAccForm}>
                            <div className={styles.dashboardInput}>
                                <label htmlFor="username">Username:</label>
                                <input
                                    id="username"
                                    type="text"
                                    name="username"
                                    value={userInfo.username}
                                    onChange={infoChange}
                                />
                            </div>
                            <div className={styles.dashboardInput}>
                                <label htmlFor="email">Email:</label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={userInfo.email}
                                    onChange={infoChange}
                                />
                            </div>
                            <div className={styles.dashboardInput}>
                                <label htmlFor="password">Password:</label>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={userInfo.password}
                                    onChange={infoChange}
                                />
                            </div>
                            <div className={styles.dashboardInput}>
                                <label htmlFor="password">Comfirm Password:</label>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={userInfo.password}
                                    onChange={infoChange}
                                />
                            </div>
                            
                            <button type="submit" className={styles.dashboardUpdate}>Update</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        
        </>
    );
}

export default Profile;
    