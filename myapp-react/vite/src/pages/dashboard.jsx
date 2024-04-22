import React, {useState} from 'react';
import DashboardNav from "../components/dashboardNav";
import styles from "../cssPages/dashboardPage.module.css"
import samplePlot from "../assets/samplePlot.png"

function Dashboard() {

    const FileUpload = (event) => {
        const file = event.target.files[0];

        //handles file upload process
        //will add on to later
    }

    const graphData = [
        //placeholder for graph data
        {id: 1, title: "Graph 1"},
        {id: 2, title: "Graph 2"},
        {id: 3, title: "Graph 3"}
    ];

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
            <div className={`${styles.dashboardBody}`}>
                <div className={`${styles.dashboardNavBox}`}>
                    <DashboardNav/>
                    <div className={`${styles.dashboardNavLeft}`}>
                        {/* Just for testing purpose if anyone want to delete you can */}
                        <h1 className={`${styles.dashboardTitle}`}>DashBoard</h1>
                        <p className={`${styles.dashboardText}`}> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. </p>

                        <button type= "Upload" className={styles.dashboardUpload}>
                            Upload CSV File
                        </button>

                        <h1 className={styles.dashboardRecentText}>
                            Recent Graphs
                        </h1>

                        <div className={styles.dashboardText}>
                            {graphData.map((graph) => (
                                <button key={graph.id} className={styles.dashboardGraphPrev} onClick={() => handleGraphClick(graph.id)}>
                                    <img src={"https://user-images.githubusercontent.com/6562690/54934415-b4d25b80-4edb-11e9-8758-fb29ada50499.png"} alt={`Preview of ${graph.title}`} />
                                    <span>{graph.title}</span>
                                </button>
                            ))}
                        </div>

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
                                    <label htmlFor="email">Email:</label>
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={userInfo.email}
                                        onChange={infoChange}
                                    />
                                </div>
                                <button type="submit" className={styles.dashboardUpdate}>Update</button>
                            </form>
                        </div>



                         {/*<div>
                            <button type="upload" className={styles.uploadButton}>Upload</button>
                            <h1 className={`${styles.dashboardTitle}`}>Sample PLot</h1>
                        </div>*/}
                        <div className={`${styles.plotBox}`}>
                            <img src={samplePlot} className={`${styles.imageSample}`} alt="Sample plot image"/>
                        </div>

                    </div>
                </div>
            </div>
    
        </>
    );
}


export default Dashboard