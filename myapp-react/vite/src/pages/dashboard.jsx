import React, { useState } from "react";
import DashboardNav from "../components/dashboardNav";
import styles from "../cssPages/dashboardPage.module.css";
import samplePlot from "../assets/samplePlot.png";

function Dashboard() {
  const FileUpload = (event) => {
    const file = event.target.files[0];

    //handles file upload process
    //will add on to later
  };

  const graphData = [
    //placeholder for graph data
    { id: 1, title: "Graph 1" },
    { id: 2, title: "Graph 2" },
    { id: 3, title: "Graph 3" },
  ];

  return (
    <>
      <div className={`${styles.dashboardBody}`}>
        <div className={`${styles.dashboardNavBox}`}>
          <DashboardNav />
          <div className={`${styles.dashboardNavLeft}`}>
            {/* Just for testing purpose if anyone want to delete you can */}

            <div>
              <button type="Upload" className={styles.dashboardUpload}>
                Upload CSV File
              </button>
              <h1 className={styles.dashboardRecentText}>Recent Graphs</h1>
              <div className={styles.dashboardText}>
                {graphData.map((graph) => (
                  <button
                    key={graph.id}
                    className={styles.dashboardGraphPrev}
                    onClick={() => handleGraphClick(graph.id)}
                  >
                    <img
                      src={
                        "https://user-images.githubusercontent.com/6562690/54934415-b4d25b80-4edb-11e9-8758-fb29ada50499.png"
                      }
                      alt={`Preview of ${graph.title}`}
                    />
                    <span>{graph.title}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className={`${styles.plotBox}`}>
              <img
                src={samplePlot}
                className={`${styles.imageSample}`}
                alt="Sample plot image"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
