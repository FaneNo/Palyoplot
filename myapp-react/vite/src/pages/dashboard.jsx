
import DashboardNav from "../components/dashboardNav";
import styles from "../cssPages/dashboardPage.module.css"
import samplePlot from "../assets/samplePlot.png"

function Dashboard() {
    return(
        <>
            <div className={`${styles.dashboardBody}`}>
                <div className={`${styles.dashboardNavBox}`}>
                    <DashboardNav/>
                    <div className={`${styles.dashboardNavLeft}`}>
                        
                        <div>
                            <h1 className={`${styles.dashboardTitle}`}>Sample PLot</h1>
                            <p className={`${styles.dashboardText}`}> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. </p>
                        </div>
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