import React, { useState, useRef} from "react";
import Plot from 'react-plotly.js';
import Plotly from 'plotly.js-dist-min';
import Papa from "papaparse";
import DashboardNav from "../components/dashboardNav";
import CSVUploadDialog from "../components/CSVUploadDialog";
import styles from "../cssPages/dashboardPage.module.css";
import samplePlot from "../assets/samplePlot.png";

function Dashboard() {

  const [csvData, setCsvData] = useState({ x: [], y: [] }); // State to store CSV data
  const [graphTitle, setGraphTitle] = useState("Sample Graph Title"); // State for graph title
  const [xAxisLabel, setXAxisLabel] = useState("Categories"); // State for X-axis label
  const [yAxisLabel, setYAxisLabel] = useState("Values"); // State for Y-axis label
  const [graphType, setGraphType] = useState('bar');  // State to store the selected graph type

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
          const y = data.map(row => parseFloat(row.Value)); // Convert string to number for y-axis
  
          // Update the state with parsed data
          setCsvData({ x, y });
        },
      });
    };

    const handleGraphTypeChange = (event) => {
      setGraphType(event.target.value);  // Update the graph type when the dropdown value changes
    };

  return (
    <>
  
      <div className={`${styles.dashboardBody}`}>
        <div className={`${styles.dashboardNavBox}`}>
          <DashboardNav /> {/* This remains directly under the top navbar */}
          <div className={styles.contentWrapper}> {/* New wrapper for the rest of the content */}
            <div className={`${styles.dashboardNavLeft}`}>
              <div className={`${styles.dashboardContent}`}>
              <div className={`${styles.plotBox}`}>
                  {/* Plotly Graph that dynamically changes based on graphType and CSV data */}
                  <Plot
                  
                    data={[
                      {
                        x: csvData.x.length > 0 ? csvData.x : ['Category A', 'Category B', 'Category C'], // Default if no CSV data
                        y: csvData.y.length > 0 ? csvData.y : [20, 14, 23], // Default if no CSV data
                        type: graphType,  // Dynamically set the graph type here
                        mode: graphType === 'line' ? 'lines' : undefined,  // Mode for line graph
                        fill: graphType === 'area' ? 'tozeroy' : undefined,  // Fill for area graph
                        marker: { color: 'blue' },
                      },
                    ]}
                    layout={{
                      width: 900,
                      height: 600,
                      title: graphTitle,  // Dynamically set the graph title
                      xaxis: { title: xAxisLabel },  // Dynamically set the X-axis label
                      yaxis: { title: yAxisLabel },  // Dynamically set the Y-axis label
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
                          value={graphType}  // Bind the selected value to state
                          onChange={handleGraphTypeChange}  // Update state when the dropdown changes
                        >
                          <option value="bar">Bar</option>
                          <option value="line">Line</option>
                          <option value="area">Filled Area</option>
                        </select>
                      </div>
                      {/* Input for Graph Title */}
                      <div className={styles.labelext}>Graph Title:</div>
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
                    <div className={styles.dropdownWrapper}>
                    <div className={styles.labelText}>
                      Choose Your X Axis:
                      </div>
                      <select id="xAxis" className={styles.graphTypeDropdown}>
                        <option value="">(Choose X Axis Value)</option>
                      </select>
                    </div>
                    <div className={styles.dropdownWrapper}>
                    <div className={styles.labelText}>
                      Choose Your Y Axis:
                      </div>
                      <select id="yAxis" className={styles.graphTypeDropdown}>
                        <option value="">(Choose Y Axis Value)</option>
                      </select>
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