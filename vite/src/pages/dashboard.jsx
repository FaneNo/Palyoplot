import React, { useState, useRef } from "react";
import Plot from "react-plotly.js";
import Papa from "papaparse";
import DashboardNav from "../components/dashboardNav";
import styles from "../cssPages/dashboardPage.module.css";
import Plotly from "plotly.js-dist-min"; // Ensure you have Plotly imported

function Dashboard() {
  const [csvDataSets, setCsvDataSets] = useState([]);
  const [graphTitle, setGraphTitle] = useState("Sample Graph Title");
  const [xAxisLabel, setXAxisLabel] = useState("Categories");
  const [yAxisLabel, setYAxisLabel] = useState("Values");
  const [graphType, setGraphType] = useState("bar");
  const [graphOrientation, setGraphOrientation] = useState("vertical");
  const [modalOpen, setModalOpen] = useState(false);
  const [resolution, setResolution] = useState("1080p");
  const [imageFormat, setImageFormat] = useState("jpeg");
  const graphRef = useRef(); // Create a reference for the Plotly graph
  const [isDownloading, setIsDownloading] = useState(false); // Flag to track download state
  const [showWarning, setShowWarning] = useState(false);


  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        const data = results.data;

        // Validate data
        if (data.length === 0) {
          console.error("Parsed CSV is empty.");
          return;
        }

        const x = data.map((row) => row.Category);
        const y = data.map((row) => parseFloat(row.Value));

        // Log the parsed values
        console.log("Parsed CSV data:", data);
        console.log("x values:", x);
        console.log("y values:", y);

        // Check for valid y-values
        if (y.some(isNaN)) {
          console.error("Y values contain non-numeric data:", y);
          return;
        }

        setCsvDataSets((prevDataSets) => {
          const newDataSet = { x, y };
          console.log("New dataset to be added:", newDataSet);
          const updatedDataSets = [...prevDataSets, newDataSet];
          console.log("Current CSV Data Sets after update:", updatedDataSets);
          return updatedDataSets;
        });
      },
    });
  };

  const handleGraphTypeChange = (event) => {
    setGraphType(event.target.value);
  };

  const handleOrientationChange = (event) => {
    setGraphOrientation(event.target.value);
  };

  const downloadGraph = () => {
    if (isDownloading) {
      console.warn("Download already in progress. Please wait.");
      return; // Prevent multiple downloads
    }
  
    const width = resolution === "4k" ? 3840 : resolution === "2k" ? 2560 : 1920;
    const height = resolution === "1080p" ? 1080 : (width * 3) / 4;
  
    // Log the current datasets to be downloaded
    console.log("CSV Data Sets:", csvDataSets);
  
    // Check if the CSV data sets are empty
    if (csvDataSets.length === 0) {
      console.error("No data to download.");
      setShowWarning(true); // Show warning modal
      return;
    }
  
    // Prepare the plot data for download
    const plotData = csvDataSets.map((dataset, index) => ({
      x: graphOrientation === "vertical" ? dataset.x : dataset.y,
      y: graphOrientation === "vertical" ? dataset.y : dataset.x,
      type: graphType,
      mode: graphType === "line" ? "lines" : undefined,
      fill: graphType === "area" ? "tozeroy" : undefined,
      marker: { color: `hsl(${index * 60}, 100%, 50%)` },
    }));
  
    // Prepare layout for download
    const layout = {
      title: graphTitle,
      xaxis: { title: graphOrientation === "vertical" ? xAxisLabel : yAxisLabel },
      yaxis: { title: graphOrientation === "vertical" ? yAxisLabel : xAxisLabel },
    };
  
    // Ensure the graph is rendered before downloading
    if (graphRef.current) {
      setIsDownloading(true); // Set downloading flag
      Plotly.downloadImage(graphRef.current, {
        format: imageFormat,
        width: width,
        height: height,
        filename: graphTitle.replace(/ /g, "_"),
      })
        .then(() => {
          console.log("Download successful");
          setIsDownloading(false); // Reset downloading flag on success
        })
        .catch((error) => {
          console.error("Download failed:", error);
          setIsDownloading(false); // Reset downloading flag on failure
        });
    } else {
      console.error("Graph reference is not valid.");
    }
  
    setModalOpen(false); // Close modal after download
  };

  const handleCloseWarning = () => {
    setShowWarning(false);
  };

  const handleDownloadButtonClick = () => {
    if (csvDataSets.length === 0) {
      console.error("No data available to download.");
      setShowWarning(true); // Show warning modal
    } else {
      setModalOpen(true); // Open download modal if data exists
    }
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
                <Plot
  ref={graphRef}
  data={
    csvDataSets.length > 0
      ? csvDataSets.map((dataset, index) => ({
          x: graphOrientation === "vertical" ? dataset.x : dataset.y,
          y: graphOrientation === "vertical" ? dataset.y : dataset.x,
          type: graphType,
          mode: graphType === "line" ? "lines" : undefined,
          fill: graphType === "area" ? "tozeroy" : undefined,
          marker: { color: `hsl(${index * 60}, 100%, 50%)` },
        }))
      : [
          {
            x: ["Category A", "Category B", "Category C"],
            y: [20, 14, 23],
            type: graphType,
            mode: graphType === "line" ? "lines" : undefined,
            fill: graphType === "area" ? "tozeroy" : undefined,
            marker: { color: "blue" },
          },
        ]
  }
  layout={{
    width: 900,
    height: 600,
    title: graphTitle,
    xaxis: { title: graphOrientation === "vertical" ? xAxisLabel : yAxisLabel },
    yaxis: { title: graphOrientation === "vertical" ? yAxisLabel : xAxisLabel },
  }}
  onInitialized={(figure) => {
    // Set the graphRef to the initialized figure
    graphRef.current = figure;
  }}
  onUpdate={() => {
    // Update graphRef whenever the graph is updated
    if (graphRef.current) {
      graphRef.current = {
        data: csvDataSets.map((dataset, index) => ({
          x: graphOrientation === "vertical" ? dataset.x : dataset.y,
          y: graphOrientation === "vertical" ? dataset.y : dataset.x,
          type: graphType,
          mode: graphType === "line" ? "lines" : undefined,
          fill: graphType === "area" ? "tozeroy" : undefined,
          marker: { color: `hsl(${index * 60}, 100%, 50%)` },
        })),
        layout: {
          title: graphTitle,
          xaxis: { title: graphOrientation === "vertical" ? xAxisLabel : yAxisLabel },
          yaxis: { title: graphOrientation === "vertical" ? yAxisLabel : xAxisLabel },
        },
      };
    }
  }}
/>


                  <div className={styles.uploadButtonWrapper}>
                    <div className={styles.horizontalButtons}>
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
                        <div className={styles.uploadText}>Choose Your Graph Type:</div>
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

                      <div className={styles.dropdownWrapper}>
                        <div className={styles.uploadText}>Choose Your Graph Orientation:</div>
                        <select
                          id="graphOrientation"
                          className={styles.graphTypeDropdown}
                          value={graphOrientation}
                          onChange={handleOrientationChange}
                        >
                          <option value="vertical">Vertical</option>
                          <option value="horizontal">Horizontal</option>
                        </select>
                      </div>

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

                      <div className={styles.downloadButtonWrapper}>
                      <button onClick={handleDownloadButtonClick} className={styles.downloadButton}>
  Download Graph
</button>

                      </div>

                      {modalOpen && (
                        <div className={styles.modal}>
                          <div className={styles.modalContent}>
                            <h2>Download Graph</h2>
                            <div className={styles.resolutionWrapper}>
                                                          <div className={styles.imageFormatWrapper}>
                              <div className={styles.labelText}>Select Image Format:</div>
                              <select
                                value={imageFormat}
                                onChange={(e) => setImageFormat(e.target.value)}
                                className={styles.graphTypeDropdown}
                              >
                                <option value="jpeg">JPEG</option>
                                <option value="png">PNG</option>
                              </select>
                            </div>
                              <div className={styles.labelText}>Select Resolution:</div>
                              <select
                                value={resolution}
                                onChange={(e) => setResolution(e.target.value)}
                                className={styles.graphTypeDropdown}
                              >
                                <option value="1080p">1080x1920</option>
                                <option value="2k">2048x1080</option>
                                <option value="4k">3840x2160</option>
                              </select>
                            </div>

                            <button onClick={downloadGraph} className={styles.modalDownloadButton}>
                              Confirm Download
                            </button>
                            <button onClick={() => setModalOpen(false)} className={styles.closeModalButton}>
                              Close
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {showWarning && (
  <div className={styles.warningModal}>
    <div className={styles.warningModalContent}>
      <h2>No Data Available</h2>
      <p>Please upload a CSV file to generate a graph.</p>
      <button onClick={handleCloseWarning} className={styles.warningCloseButton}>Close</button>
    </div>
  </div>
)}

      </div>
      
    </>
  );
}

export default Dashboard;

