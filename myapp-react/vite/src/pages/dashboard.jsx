
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
                            <button type="upload" className={styles.uploadButton}>Upload</button>
                            <h1 className={`${styles.dashboardTitle}`}>Sample PLot</h1>
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