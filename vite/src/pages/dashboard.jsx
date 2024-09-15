import React, { useState } from "react";
import DashboardNav from "../components/dashboardNav";
import CSVUploadDialog from "../components/CSVUploadDialog";
import styles from "../cssPages/dashboardPage.module.css";
import samplePlot from "../assets/samplePlot.png";

function Dashboard() {
  const FileUpload = (event) => {
    const file = event.target.files[0];
    //handles file upload process
    //will add on to later
  };

  const graphData = [
    { id: 1, title: "Graph 1" },
    { id: 2, title: "Graph 2" },
    { id: 3, title: "Graph 3" },
  ];

  return (
    <>
  
      <div className={`${styles.dashboardBody}`}>
        <div className={`${styles.dashboardNavBox}`}>
          <DashboardNav /> {/* This remains directly under the top navbar */}
          <div className={styles.contentWrapper}> {/* New wrapper for the rest of the content */}
            <div className={`${styles.dashboardNavLeft}`}>
              <div className={`${styles.dashboardContent}`}>
                <div className={`${styles.plotBox}`}>
                  <img src={samplePlot} className={`${styles.imageSample}`} alt="Sample plot image" />
                  <div className={styles.uploadButtonWrapper}>
                  <div className={styles.horizontalButtons}>
                    {/* <button type="Upload" className={styles.uploadButton}>
                      Upload CSV File
                    </button> */}
                    <CSVUploadDialog />
                  </div>
                  <div className={styles.verticalControls}>
                    <div className={styles.dropdownWrapper}>
                      <label htmlFor="graphType">Choose Your Graph Type:</label>
                      <select id="graphType" className={styles.graphTypeDropdown}>
                        <option value="line">Line</option>
                        <option value="bar">Bar</option>
                        <option value="area">Filled Area</option>
                      </select>
                    </div>
                    <div className={styles.dropdownWrapper}>
                      <label htmlFor="xAxis">Choose Your X Axis:</label>
                      <select id="xAxis" className={styles.graphTypeDropdown}>
                        <option value="">(Choose X Axis Value)</option>
                      </select>
                    </div>
                    <div className={styles.dropdownWrapper}>
                      <label htmlFor="yAxis">Choose Your Y Axis:</label>
                      <select id="yAxis" className={styles.graphTypeDropdown}>
                        <option value="">(Choose Y Axis Value)</option>
                      </select>
                    </div>
                    <div className={styles.inputWrapper}>
                      <label htmlFor="graphName">Input Name of Graph:</label>
                      <input
                        type="text"
                        id="graphName"
                        className={styles.graphInput}
                        placeholder="Graph name goes here"
                      />
                    </div>
                    <button type="button" className={styles.uploadButton}>
                      Download Graph
                    </button>
                  </div>
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  );
}







export default Dashboard;