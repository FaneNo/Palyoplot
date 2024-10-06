import React, { useState } from "react";
import Plot from 'react-plotly.js';
import Papa from "papaparse";
import DashboardNav from "../components/dashboardNav";
import styles from "../cssPages/dashboardPage.module.css";

function Dashboard() {
  // State to store multiple CSV datasets
  const [csvDataSets, setCsvDataSets] = useState([]); 
  const [graphTitle, setGraphTitle] = useState("Sample Graph Title");
  const [xAxisLabel, setXAxisLabel] = useState("Categories");
  const [yAxisLabel, setYAxisLabel] = useState("Values");
  const [graphType, setGraphType] = useState('bar');

  // Function to handle CSV upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Parse the CSV file using PapaParse
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        const data = results.data;
        
        // Extract categories (x-axis) and values (y-axis) from CSV
        const x = data.map(row => row.Category);
        const y = data.map(row => parseFloat(row.Value));

        // Append new dataset to the existing state
        setCsvDataSets(prevDataSets => [...prevDataSets, { x, y }]);
      },
    });
  };

  const handleGraphTypeChange = (event) => {
    setGraphType(event.target.value);
  };

  

  return (
    <>
      <div className={`${styles.dashboardBody}`}>
        <div className={`${styles.dashboardNavBox}`}>
          <DashboardNav />
          <div className={styles.contentWrapper}>
            <div className={`${styles.dashboardNavLeft}`}>
              <div className={`${styles.dashboardContent}`}>
                <div className={`${styles.plotBox}`}>
                  {/* Plotly Graph dynamically changes based on graphType and CSV data */}
                  <Plot
                    data={csvDataSets.length > 0
                      ? csvDataSets.map((dataset, index) => ({
                          x: dataset.x,
                          y: dataset.y,
                          type: graphType,
                          mode: graphType === 'line' ? 'lines' : undefined,
                          fill: graphType === 'area' ? 'tozeroy' : undefined,
                          marker: { color: `hsl(${index * 60}, 100%, 50%)` },  // Different colors for each dataset
                        }))
                      : [
                          {
                            x: ['Category A', 'Category B', 'Category C'],
                            y: [20, 14, 23],
                            type: graphType,
                            mode: graphType === 'line' ? 'lines' : undefined,
                            fill: graphType === 'area' ? 'tozeroy' : undefined,
                            marker: { color: 'blue' },
                          },
                        ]
                    }
                    layout={{
                      width: 900,
                      height: 600,
                      title: graphTitle,
                      xaxis: { title: xAxisLabel },
                      yaxis: { title: yAxisLabel },
                    }}
                  />
                  <div className={styles.uploadButtonWrapper}>
                    <div className={styles.horizontalButtons}>
                      {/* Hide the default file input and use a custom button to trigger file upload */}
                      <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileUpload}
                        id="fileInput"
                        className={styles.fileInput}
                      />
                      <label htmlFor="fileInput" className={styles.customFileButton}>
                        Upload CSV File
                      </label>
                    </div>
                    <div className={styles.verticalControls}>
                      <div className={styles.dropdownWrapper}>
                        <div className={styles.uploadText}>
                          Choose Your Graph Type:
                        </div>
                        <select
                          id="graphType"
                          className={styles.graphTypeDropdown}
                          value={graphType}
                          onChange={handleGraphTypeChange}
                        >
                          <option value="bar">Bar</option>
                          <option value="line">Line</option>
                          <option value="area">Filled Area</option>
                        </select>
                      </div>
                      {/* Input for Graph Title */}
                      <div className={styles.labelText}>Graph Title:</div>
                      <div className={styles.inputWrapper}>
                        <input
                          type="text"
                          value={graphTitle}
                          onChange={(e) => setGraphTitle(e.target.value)}
                          className={styles.graphInput}
                          placeholder="Enter graph title"
                        />
                      </div>

                      {/* Input for X-axis Label */}
                      <div className={styles.labelText}>X-Axis Label:</div>
                      <div className={styles.inputWrapper}>
                        <input
                          type="text"
                          value={xAxisLabel}
                          onChange={(e) => setXAxisLabel(e.target.value)}
                          className={styles.graphInput}
                          placeholder="Enter X-axis label"
                        />
                      </div>

                      {/* Input for Y-axis Label */}
                      <div className={styles.labelText}>Y-Axis Label:</div>
                      <div className={styles.inputWrapper}>
                        <input
                          type="text"
                          value={yAxisLabel}
                          onChange={(e) => setYAxisLabel(e.target.value)}
                          className={styles.graphInput}
                          placeholder="Enter Y-axis label"
                        />
                      </div>
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
