import React, { useState, useRef, useEffect, useMemo } from "react";
import Papa from "papaparse";
import DashboardNav from "../components/dashboardNav";
import styles from "../cssPages/dashboardPage.module.css";
import Plot from "react-plotly.js";
import Plotly from "plotly.js-dist-min";
import Select from "react-select";
import api from "../api"; // Import for backend API calls

// Component for assigning taxa to life forms
function TaxaLifeFormAssignment({
  taxaNames,
  lifeFormGroups,
  taxaLifeFormAssignments,
  setTaxaLifeFormAssignments,
}) {
  const handleLifeFormChange = (taxaName, lifeFormId) => {
    setTaxaLifeFormAssignments((prevAssignments) => ({
      ...prevAssignments,
      [taxaName]: lifeFormId,
    }));
  };

  return (
    <div className={styles.taxaLifeFormAssignment}>
      <h3>Assign Taxa to Life Forms</h3>
      <table className={styles.assignmentTable}>
        <thead>
          <tr>
            <th>Taxa Name</th>
            <th>Life Form</th>
          </tr>
        </thead>
        <tbody>
          {taxaNames.map((taxaName) => (
            <tr key={taxaName}>
              <td>{taxaName}</td>
              <td>
                <select
                  value={taxaLifeFormAssignments[taxaName] || ""}
                  onChange={(e) =>
                    handleLifeFormChange(taxaName, e.target.value)
                  }
                  className={styles.lifeFormDropdown}
                >
                  <option value="">Unassigned</option>
                  {lifeFormGroups.map((lifeForm) => (
                    <option key={lifeForm.life_id} value={lifeForm.life_id}>
                      {lifeForm.life_name}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Updated LifeFormColorAssignment component without add/remove functionality
function LifeFormColorAssignment({ lifeFormGroups, setLifeFormGroups }) {
  // Handle color change for a life form
  const handleColorChange = (lifeFormId, color) => {
    setLifeFormGroups((prevGroups) =>
      prevGroups.map((lifeForm) =>
        lifeForm.life_id === lifeFormId ? { ...lifeForm, color } : lifeForm
      )
    );
  };

  // Handle name change for a life form
  const handleNameChange = (lifeFormId, newName) => {
    setLifeFormGroups((prevGroups) =>
      prevGroups.map((lifeForm) =>
        lifeForm.life_id === lifeFormId
          ? { ...lifeForm, life_name: newName }
          : lifeForm
      )
    );
  };

  // Handle rearrangement of life forms
  const moveLifeForm = (index, direction) => {
    setLifeFormGroups((prevGroups) => {
      const newGroups = [...prevGroups];
      const targetIndex = index + direction;

      // Check boundaries
      if (targetIndex < 0 || targetIndex >= newGroups.length) return newGroups;

      // Swap positions
      [newGroups[index], newGroups[targetIndex]] = [
        newGroups[targetIndex],
        newGroups[index],
      ];
      return newGroups;
    });
  };

  return (
    <div className={styles.lifeFormColorAssignment}>
      <h3>Edit Life Forms</h3>
      {lifeFormGroups.map((lifeForm, index) => {
        const color = lifeForm.color || "#808080"; // Default color gray

        return (
          <div key={lifeForm.life_id} className={styles.lifeFormAssignmentRow}>
            <input
              type="text"
              value={lifeForm.life_name}
              onChange={(e) =>
                handleNameChange(lifeForm.life_id, e.target.value)
              }
              className={styles.lifeFormInput}
            />
            <input
              type="color"
              value={color}
              onChange={(e) =>
                handleColorChange(lifeForm.life_id, e.target.value)
              }
              className={styles.colorPicker}
            />
            <div className={styles.lifeFormButtons}>
              {/* Move Up Button */}
              <button
                onClick={() => moveLifeForm(index, -1)}
                disabled={index === 0}
                className={styles.moveButton}
              >
                ▲
              </button>
              {/* Move Down Button */}
              <button
                onClick={() => moveLifeForm(index, 1)}
                disabled={index === lifeFormGroups.length - 1}
                className={styles.moveButton}
              >
                ▼
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Dashboard() {
  // State variables
  const [csvDataSets, setCsvDataSets] = useState([]);
  const [rawData, setRawData] = useState([]);
  const [lifeFormGroups, setLifeFormGroups] = useState([
    { life_id: "lf1", life_name: "Trees", color: "#FF0000" },
    { life_id: "lf2", life_name: "Shrubs", color: "#00FF00" },
    { life_id: "lf3", life_name: "Herbs", color: "#0000FF" },
  ]);
  const [taxaLifeFormAssignments, setTaxaLifeFormAssignments] = useState({});
  const [graphTitle, setGraphTitle] = useState("Pollen Percentage Diagram");
  const [yAxisLabel, setYAxisLabel] = useState("Y-Axis");
  const [plotType, setPlotType] = useState("area");
  const [orientation, setOrientation] = useState("h");

  // Add state variable for reversing y-axis
  const [reverseYAxis, setReverseYAxis] = useState(false);

  // Download functionality state variables
  const [modalOpen, setModalOpen] = useState(false);
  const [resolution, setResolution] = useState("1080p");
  const [imageFormat, setImageFormat] = useState("png");
  const graphRef = useRef();
  const [isDownloading, setIsDownloading] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  // Taxa selection state variables
  const [availableTaxa, setAvailableTaxa] = useState([]);
  const [selectedTaxa, setSelectedTaxa] = useState([]);
  const [yAxisColumn, setYAxisColumn] = useState("");

  // State variables to control the visibility of the Assignment components
  const [showLifeFormAssignment, setShowLifeFormAssignment] = useState(false);
  const [showTaxaAssignment, setShowTaxaAssignment] = useState(false);

  // State for file upload
  const [file, setFile] = useState(null);

  // Function to handle the main data CSV selection
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;
    console.log("File selected:", selectedFile.name);
    setFile(selectedFile);

    // Parse the CSV file on the frontend
    parseCSVFile(selectedFile);
  };

  // Parse CSV file on the frontend
  const parseCSVFile = (file) => {
    console.log("Parsing CSV file:", file.name);
    Papa.parse(file, {
      delimiter: ",", // Explicitly specify comma delimiter
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: function (results) {
        const data = results.data;
        const headers = results.meta.fields;

        console.log("Parsed Data:", data);
        console.log("Headers:", headers);

        setRawData(data);
        setAvailableTaxa(headers);

        // Reset selected taxa and y-axis column
        setSelectedTaxa([]);
        setYAxisColumn("");
        setTaxaLifeFormAssignments({});
        setCsvDataSets([]);
      },
      error: function (error) {
        console.error("Error parsing CSV:", error);
      },
    });
  };

  // Function to handle the main data CSV upload to backend
  const handleFileUpload = () => {
    if (!file) return;

    // Send the file to the backend
    const formData = new FormData();
    formData.append("csv_file", file);

    api
      .post("/api/upload-csv/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("File uploaded successfully", response.data);
        // You can handle any backend response data here if needed
      })
      .catch((error) => {
        console.error("Error uploading file", error);
      });
  };

  // Update taxaLifeFormAssignments when selectedTaxa changes
  useEffect(() => {
    setTaxaLifeFormAssignments((prevAssignments) => {
      const newAssignments = { ...prevAssignments };
      selectedTaxa.forEach((taxa) => {
        if (!newAssignments[taxa]) {
          newAssignments[taxa] = ""; // Default life form ID (unassigned)
        }
      });
      return newAssignments;
    });
  }, [selectedTaxa]);

  // Prepare data for plotting
  useEffect(() => {
    if (
      rawData.length === 0 ||
      selectedTaxa.length === 0 ||
      !yAxisColumn ||
      Object.keys(taxaLifeFormAssignments).length === 0
    )
      return;

    const newSpeciesData = selectedTaxa.map((taxaName) => {
      const x = rawData.map((row) => parseFloat(row[taxaName]) || 0);
      const y = rawData.map((row) => parseFloat(row[yAxisColumn]) || 0);
      const lifeId = taxaLifeFormAssignments[taxaName];
      const fontstyle = "plain"; // Or allow user to set fontstyle

      return {
        speciesName: taxaName,
        lifeId: lifeId,
        x: x,
        y: y,
        fontstyle: fontstyle,
      };
    });

    setCsvDataSets(newSpeciesData);
  }, [
    rawData,
    taxaLifeFormAssignments,
    selectedTaxa,
    yAxisColumn,
    lifeFormGroups,
  ]);

  // Prepare data for plotting using useMemo
  const memoizedPlotData = useMemo(() => {
    return preparePlotData();
  }, [
    csvDataSets,
    graphTitle,
    yAxisLabel,
    plotType,
    orientation,
    reverseYAxis,
  ]);

  const { plotData, layout } = memoizedPlotData;

  // Prepare plot data and layout
  function preparePlotData() {
    if (csvDataSets.length === 0) return { plotData: [], layout: {} };

    const plotData = [];
    const annotations = [];

    // Use life form order defined by the user
    const lifeformOrder = lifeFormGroups.map((group) => group.life_id);

    const sortedDataSets = csvDataSets
      .filter((dataset) => dataset.lifeId !== undefined)
      .sort((a, b) => {
        const lifeOrderA = lifeformOrder.indexOf(a.lifeId);
        const lifeOrderB = lifeformOrder.indexOf(b.lifeId);

        if (lifeOrderA !== lifeOrderB) {
          return lifeOrderA - lifeOrderB;
        }
        // Then by speciesName
        return a.speciesName.localeCompare(b.speciesName);
      });

    // Collect all y values to determine min and max
    const allYValues = sortedDataSets.flatMap((dataset) => dataset.y);
    const minY = Math.min(...allYValues);
    const maxY = Math.max(...allYValues);

    const numTaxa = sortedDataSets.length;

    // Create mapping from life_id to color and name
    const lifeFormColorMap = {};
    const lifeFormNameMap = {};
    lifeFormGroups.forEach((group) => {
      lifeFormColorMap[group.life_id] = group.color;
      lifeFormNameMap[group.life_id] = group.life_name;
    });

    const threshold = 5; // Threshold below which exaggeration is applied
    const desiredMaxValue = 20; // Value to scale up to

    // Adjust layout margins for overall x-axis label
    const layout = {
      title: graphTitle,
      showlegend: false,
      annotations: [],
      margin: { t: 180, b: 180, l: 100, r: 100 }, // Increased bottom margin
    };

    const subplotSpacing = 0.02; // 2% spacing between subplots
    const xLeftMargin = 0.1; // 10% left margin
    const xRightMargin = 0.02; // 2% right margin
    const totalSpacing =
      subplotSpacing * (numTaxa - 1) + xLeftMargin + xRightMargin;
    const subplotWidth = (1 - totalSpacing) / numTaxa;

    // Group datasets by life form
    const lifeformGroupsData = {};

    sortedDataSets.forEach((dataset, index) => {
      if (dataset.x.length === 0 || dataset.y.length === 0) {
        return; // Skip datasets with no data
      }

      const subplotIndex = index + 1;

      const xStart = xLeftMargin + index * (subplotWidth + subplotSpacing);
      let xEnd = xStart + subplotWidth;
      if (xEnd > 1) xEnd = 1;

      // Apply exaggeration for small data sets
      const originalMaxValue = Math.max(...dataset.x);

      let exaggerationFactor = 1;
      if (originalMaxValue < threshold && originalMaxValue > 0) {
        exaggerationFactor = desiredMaxValue / originalMaxValue;
        // Multiply dataset.x by exaggerationFactor
        dataset.x = dataset.x.map((value) => value * exaggerationFactor);
      }

      // Use originalMaxValue to set xAxisRange
      const xAxisMax = Math.max(originalMaxValue * 1.1, 10);
      const xAxisRange = [0, xAxisMax];

      // Sort data points by y value to prevent looping in area graphs
      const dataPoints = dataset.x.map((value, idx) => ({
        x: value,
        y: dataset.y[idx],
      }));
      const sortedDataPoints = dataPoints.slice().sort((a, b) => a.y - b.y);

      const xData = sortedDataPoints.map((dp) => dp.x);
      const yData = sortedDataPoints.map((dp) => dp.y);

      // Determine the correct plot type and fill property
      let traceType = plotType;
      let fill = "none";
      if (plotType === "area") {
        traceType = "scatter";
        fill = orientation === "h" ? "tozerox" : "tozeroy";
      }

      const lifeId = dataset.lifeId;
      const color = lifeFormColorMap[lifeId] || "gray";

      plotData.push({
        x: xData,
        y: yData,
        xaxis: `x${subplotIndex}`,
        yaxis: `y`,
        name: dataset.speciesName,
        type: traceType,
        orientation: orientation,
        fill: fill,
        marker: {
          color: color,
        },
        line: {
          shape: "spline",
        },
        showlegend: false,
      });

      // Add taxa name annotations with adjusted positions
      annotations.push({
        text: dataset.speciesName,
        xref: `x${subplotIndex}`,
        yref: "paper",
        x: (xAxisRange[1] + xAxisRange[0]) / 2,
        y: 1.06,
        xanchor: "center",
        showarrow: false,
        font: {
          size: 12,
          style: dataset.fontstyle === "italic" ? "italic" : "normal",
        },
      });

      // Collect indices for life form groups
      if (!lifeformGroupsData[lifeId]) {
        lifeformGroupsData[lifeId] = [];
      }
      lifeformGroupsData[lifeId].push({ dataset, index });

      // Configure xaxis with adjustments
      layout[`xaxis${subplotIndex}`] = {
        domain: [xStart, xEnd],
        anchor: "y",
        title: "",
        range: xAxisRange,
        tickmode: "auto",
        ticks: "outside",
        ticklen: 5,
        showline: true,
        linewidth: 1,
        linecolor: "black",
        showgrid: false,
        showticklabels: true,
        tickangle: -45, // Rotate labels to prevent overlap
        automargin: true,
        tickfont: {
          size: 10,
        },
      };
    });

    // Adjust life form group annotations (category names)
    Object.keys(lifeformGroupsData).forEach((lifeId) => {
      const groupData = lifeformGroupsData[lifeId];
      const firstIndex = groupData[0].index;
      const lastIndex = groupData[groupData.length - 1].index;

      // Calculate xStart and xEnd for the group
      const xStart = xLeftMargin + firstIndex * (subplotWidth + subplotSpacing);
      let xEnd =
        xLeftMargin +
        (lastIndex + 1) * (subplotWidth + subplotSpacing) -
        subplotSpacing;
      if (xEnd > 1) xEnd = 1;

      // Calculate center position in paper coordinates
      const xCenterPaper = (xStart + xEnd) / 2;

      // Add life form group name annotation
      annotations.push({
        text: lifeFormNameMap[lifeId] || lifeId,
        xref: "paper",
        yref: "paper",
        x: xCenterPaper,
        y: 1.12, // Adjust as needed
        showarrow: false,
        font: {
          size: 14,
          color: lifeFormColorMap[lifeId] || "gray",
        },
      });
    });

    // Configure shared yaxis
    layout["yaxis"] = {
      title: yAxisLabel,
      autorange: reverseYAxis ? "reversed" : true,
      tickmode: "auto",
      ticks: "outside",
      ticklen: 5,
      showline: true,
      linewidth: 1,
      linecolor: "black",
      automargin: true,
      tickangle: 0,
      tickfont: {
        size: 10,
      },
    };

    // Add overall x-axis label
    annotations.push({
      text: "Values",
      xref: "paper",
      yref: "paper",
      x: 0.5,
      y: -0.2, // Lowered the y position
      showarrow: false,
      font: {
        size: 14,
      },
    });

    layout.annotations = annotations;

    // Adjust layout width dynamically
    const subplotWidthPixels = 100; // Width per subplot in pixels
    const spacingPixels = 10; // Spacing between subplots in pixels

    layout.width =
      numTaxa * subplotWidthPixels + (numTaxa - 1) * spacingPixels + 200; // Additional pixels for margins

    layout.height = 600; // Fixed height
    layout.autosize = false;
    layout.responsive = true;

    return { plotData, layout };
  }

  // Download graph function
  const downloadGraph = () => {
    if (isDownloading) {
      console.warn("Download already in progress. Please wait.");
      return;
    }

    // Map resolution to width and height
    const resolutionMap = {
      "1080p": { width: 1920, height: 1080 },
      "2k": { width: 2560, height: 1440 },
      "4k": { width: 3840, height: 2160 },
    };

    const { width, height } = resolutionMap[resolution];

    if (
      !graphRef.current ||
      !graphRef.current.el ||
      !plotData ||
      plotData.length === 0
    ) {
      console.error("No data to download.");
      setShowWarning(true);
      return;
    }

    setIsDownloading(true);

    Plotly.downloadImage(graphRef.current.el, {
      format: imageFormat,
      width: width,
      height: height,
      filename: graphTitle.replace(/ /g, "_"),
    })
      .then(() => {
        console.log("Download successful");
        setIsDownloading(false);
      })
      .catch((error) => {
        console.error("Download failed:", error);
        setIsDownloading(false);
      });

    setModalOpen(false);
  };

  // Handle download button click
  const handleDownloadButtonClick = () => {
    if (!plotData || plotData.length === 0) {
      console.error("No data available to download.");
      setShowWarning(true);
    } else {
      setModalOpen(true);
    }
  };

  const handleCloseWarning = () => {
    setShowWarning(false);
  };

  return (
    <>
      <div className={styles.dashboardBody}>
        <div className={styles.dashboardNavBox}>
          <DashboardNav />
          <div className={styles.mainContent}>
            <div className={styles.contentWrapper}>
              <div className={styles.dashboardNavLeft}>
                <div className={styles.dashboardContent}>
                  <div className={styles.plotBox}>
                    {/* Plotly Graph */}
                    <Plot
                      ref={graphRef}
                      data={plotData}
                      layout={layout}
                      useResizeHandler={true}
                      style={{ width: "100%" }}
                    />

                    <div className={styles.uploadButtonWrapper}>
                      <div className={styles.horizontalButtons}>
                        {/* CSV File Upload */}
                        <input
                          type="file"
                          id="csvFileUpload"
                          accept=".csv"
                          onChange={handleFileChange}
                          className={styles.fileInput}
                        />
                        <button
                          onClick={() =>
                            document.getElementById("csvFileUpload").click()
                          }
                          className={styles.customFileButton}
                        >
                          Select CSV File
                        </button>
                        <button
                          onClick={handleFileUpload}
                          className={`${styles.customFileButton} ${
                            !file ? styles.disabledButton : ""
                          }`}
                          disabled={!file}
                        >
                          Upload CSV File
                        </button>
                      </div>

                      {/* Buttons to Show/Hide Assignments */}
                      <div className={styles.assignmentButtons}>
                        {availableTaxa.length > 0 && (
                          <>
                            <button
                              onClick={() =>
                                setShowTaxaAssignment(!showTaxaAssignment)
                              }
                              className={styles.customFileButton}
                            >
                              {showTaxaAssignment
                                ? "Hide Taxa Assignments"
                                : "Assign Taxa to Life Forms"}
                            </button>
                            <button
                              onClick={() =>
                                setShowLifeFormAssignment(!showLifeFormAssignment)
                              }
                              className={styles.customFileButton}
                            >
                              {showLifeFormAssignment
                                ? "Hide Life Forms"
                                : "Edit Life Forms"}
                            </button>
                          </>
                        )}
                      </div>

                      {/* Taxa Life Form Assignment Component */}
                      {showTaxaAssignment && availableTaxa.length > 0 && (
                        <TaxaLifeFormAssignment
                          taxaNames={selectedTaxa}
                          lifeFormGroups={lifeFormGroups}
                          taxaLifeFormAssignments={taxaLifeFormAssignments}
                          setTaxaLifeFormAssignments={setTaxaLifeFormAssignments}
                        />
                      )}

                      {/* Life Form Color and Name Assignment Component */}
                      {showLifeFormAssignment && (
                        <LifeFormColorAssignment
                          lifeFormGroups={lifeFormGroups}
                          setLifeFormGroups={setLifeFormGroups}
                        />
                      )}

                      {/* Controls */}
                      <div className={styles.verticalControls}>
                        {/* Y-Axis Column Selection */}
                        {availableTaxa.length > 0 && (
                          <>
                            <div className={styles.labelText}>
                              Select Y-Axis Column:
                            </div>
                            <div className={styles.inputWrapper}>
                              <select
                                value={yAxisColumn}
                                onChange={(e) => {
                                  setYAxisColumn(e.target.value);
                                  // Update selectedTaxa to exclude the selected y-axis column
                                  setSelectedTaxa(
                                    availableTaxa.filter(
                                      (col) => col !== e.target.value
                                    )
                                  );
                                }}
                                className={styles.graphInput}
                              >
                                <option value="">Select Column</option>
                                {availableTaxa.map((col) => (
                                  <option key={col} value={col}>
                                    {col}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </>
                        )}

                        {/* Taxa Selection Dropdown */}
                        {availableTaxa.length > 0 && yAxisColumn && (
                          <>
                            <div className={styles.labelText}>Select Taxa:</div>
                            <div className={styles.inputWrapper}>
                              <Select
                                isMulti
                                options={availableTaxa
                                  .filter((col) => col !== yAxisColumn)
                                  .map((taxa) => ({
                                    label: taxa,
                                    value: taxa,
                                  }))}
                                value={selectedTaxa.map((taxa) => ({
                                  label: taxa,
                                  value: taxa,
                                }))}
                                onChange={(selectedOptions) => {
                                  setSelectedTaxa(
                                    selectedOptions
                                      ? selectedOptions.map(
                                          (option) => option.value
                                        )
                                      : []
                                  );
                                }}
                                closeMenuOnSelect={false}
                              />
                            </div>
                          </>
                        )}

                        {/* Graph Title Input */}
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

                        {/* Y-Axis Label Input */}
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

                        {/* Plot Type Selection */}
                        <div className={styles.labelText}>Plot Type:</div>
                        <div className={styles.inputWrapper}>
                          <select
                            value={plotType}
                            onChange={(e) => setPlotType(e.target.value)}
                            className={styles.graphInput}
                          >
                            <option value="bar">Bar</option>
                            <option value="line">Line</option>
                            <option value="area">Area</option>
                          </select>
                        </div>

                        {/* Orientation Selection */}
                        <div className={styles.labelText}>Orientation:</div>
                        <div className={styles.inputWrapper}>
                          <select
                            value={orientation}
                            onChange={(e) => setOrientation(e.target.value)}
                            className={styles.graphInput}
                          >
                            <option value="h">Horizontal</option>
                            <option value="v">Vertical</option>
                          </select>
                        </div>

                        {/* Reverse Y-Axis Checkbox */}
                        <div className={styles.labelText}>Reverse Y-Axis:</div>
                        <div className={styles.inputWrapper}>
                          <input
                            type="checkbox"
                            checked={reverseYAxis}
                            onChange={(e) => setReverseYAxis(e.target.checked)}
                          />
                        </div>

                        {/* Download Button */}
                        <div className={styles.downloadButtonWrapper}>
                          <button
                            onClick={handleDownloadButtonClick}
                            className={styles.downloadButton}
                          >
                            Download Graph
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Alert Message */}
                    {availableTaxa.length === 0 && (
                      <div className={styles.alertMessage}>
                        Please upload the Data CSV file to proceed.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Download Modal */}
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
                    <option value="png">PNG</option>
                    <option value="jpeg">JPEG</option>
                  </select>
                </div>
                <div className={styles.labelText}>Select Resolution:</div>
                <select
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  className={styles.graphTypeDropdown}
                >
                  <option value="1080p">1920x1080</option>
                  <option value="2k">2560x1440</option>
                  <option value="4k">3840x2160</option>
                </select>
              </div>
              <button
                onClick={downloadGraph}
                className={styles.modalDownloadButton}
              >
                Confirm Download
              </button>
              <button
                onClick={() => setModalOpen(false)}
                className={styles.modalCloseButton}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Warning Modal */}
        {showWarning && (
          <div className={styles.warningModal}>
            <div className={styles.warningModalContent}>
              <h2>No Data Available</h2>
              <p>
                Please upload the required CSV file and generate a graph before
                downloading.
              </p>
              <button
                onClick={handleCloseWarning}
                className={styles.warningCloseButton}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Commented-Out Code for Future Reference */}
      {/*

      // --- Commented-Out Imports ---
      // import api from "../api";

      // --- Commented-Out State Variables ---
      /*
      const [ageModelData, setAgeModelData] = useState([]);
      const [taxaData, setTaxaData] = useState([]);
      const [taxaLifeFormAssignments, setTaxaLifeFormAssignments] = useState({});
      const [showTaxaAssignment, setShowTaxaAssignment] = useState(false);
      */

      // --- Commented-Out Functions ---

      // Function to handle the age model CSV upload
      /*
      const handleAgeModelUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: function (results) {
            let data = results.data.map((row) => ({
              depth: parseFloat(row["depth"]), // Use depth as is
              age: parseFloat(row["median"]), // Using 'median' age
            }));

            // Remove NaN values
            data = data.filter((row) => !isNaN(row.depth) && !isNaN(row.age));

            // Sort the data by depth
            data.sort((a, b) => a.depth - b.depth);

            setAgeModelData(data);
          },
        });
      };
      */

      // Function to handle the taxa typing CSV upload
      /*
      const handleTaxaTypingUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: function (results) {
            const data = results.data.map((row) => ({
              taxa_id: row["taxa_id"],
              taxa_name: row["taxa_name"],
              merge_under: row["merge_under"],
              life_id: row["life_id"],
              fontstyle: row["fontstyle"],
              order: row["order"],
            }));
            setTaxaData(data);

            // Initialize taxaLifeFormAssignments
            const assignments = {};
            data.forEach((taxa) => {
              assignments[taxa.taxa_id] = taxa.life_id;
            });
            setTaxaLifeFormAssignments(assignments);
          },
        });
      };
      */

      // Interpolation function using the age model data
      /*
      const interpolateAge = (coreDepth) => {
        if (ageModelData.length === 0) {
          console.warn("Age model data is empty.");
          return null;
        }

        const minDepth = ageModelData[0].depth;
        const maxDepth = ageModelData[ageModelData.length - 1].depth;

        if (coreDepth < minDepth || coreDepth > maxDepth) {
          console.warn(
            `Core depth ${coreDepth} is outside the age model depth range.`
          );
          return null;
        }

        for (let i = 0; i < ageModelData.length - 1; i++) {
          const depth1 = ageModelData[i].depth;
          const depth2 = ageModelData[i + 1].depth;
          const age1 = ageModelData[i].age;
          const age2 = ageModelData[i + 1].age;

          if (coreDepth >= depth1 && coreDepth <= depth2) {
            let age =
              age1 + ((coreDepth - depth1) * (age2 - age1)) / (depth2 - depth1);

            // Keep age in Cal yr BP
            return age;
          }
        }

        console.warn(`No matching depth range found for core depth ${coreDepth}.`);
        return null;
      };
      */

      // --- Commented-Out useEffect Hook ---
      /*
      useEffect(() => {
        if (rawData.length === 0 || taxaData.length === 0) return;

        // Build a mapping from merge_under to taxa IDs and other attributes
        const taxaMapping = {};
        taxaData.forEach((taxa) => {
          const mergeUnder = (taxa.merge_under || taxa.taxa_name || taxa.taxa_id)
            .toLowerCase()
            .trim();
          const taxaName = mergeUnderNameMapping[mergeUnder] || taxa.taxa_name;

          const assignedLifeId =
            taxaLifeFormAssignments[taxa.taxa_id] || taxa.life_id;

          if (!taxaMapping[mergeUnder]) {
            taxaMapping[mergeUnder] = {
              taxa_name: taxaName,
              merge_under: mergeUnder,
              taxa_ids: [],
              taxa_names: [],
              life_id: assignedLifeId.toLowerCase().trim(),
              order: taxa.order ? parseInt(taxa.order) : 9999,
              fontstyle: taxa.fontstyle || "plain",
            };
          }
          taxaMapping[mergeUnder].taxa_ids.push(taxa.taxa_id);
          taxaMapping[mergeUnder].taxa_names.push(taxa.taxa_name);
        });

        // Convert taxaMapping to array and sort based on 'order'
        const taxaGroups = Object.keys(taxaMapping).map((key) => taxaMapping[key]);
        taxaGroups.sort((a, b) => a.order - b.order);

        // Filter taxaGroups based on selected taxa
        const filteredTaxaGroups = taxaGroups.filter((group) =>
          selectedTaxa.includes(group.taxa_name)
        );

        // For each data row
        const dataRows = rawData.map((row) => {
          const depth = parseFloat(row["core_depth"]); // Use core_depth as is

          const age = interpolateAge(depth);

          if (age === null) {
            return null; // Skip rows where age cannot be determined
          }

          // Get counts for each group
          const groupedCounts = {};
          filteredTaxaGroups.forEach((group) => {
            const taxaNames = group.taxa_names;
            const totalCount = taxaNames.reduce((sum, taxaName) => {
              const count = parseFloat(row[taxaName]);
              if (isNaN(count)) {
                return sum;
              }
              return sum + count;
            }, 0);
            groupedCounts[group.merge_under] = totalCount;
          });

          // Calculate total counts
          const totalCounts = Object.values(groupedCounts).reduce(
            (sum, count) => sum + count,
            0
          );

          if (totalCounts === 0) {
            return null; // Skip rows with zero total counts
          }

          // Calculate percentages for each group
          const groupPercentages = {};
          Object.keys(groupedCounts).forEach((groupName) => {
            groupPercentages[groupName] =
              (groupedCounts[groupName] / totalCounts) * 100;
          });

          return {
            age: age, // Use raw age here
            depth: depth, // Include depth here
            percentages: groupPercentages,
          };
        });

        // Filter out null rows
        const validDataRows = dataRows.filter((row) => row !== null);

        // Prepare data for plotting
        const newSpeciesData = filteredTaxaGroups.map((group) => {
          const groupName = group.taxa_name;
          const mergeUnder = group.merge_under;
          const x = validDataRows.map((row) => row.percentages[mergeUnder] || 0);
          const y = validDataRows.map((row) => row.age); // Use actual age
          const depths = validDataRows.map((row) => row.depth); // Collect depths
          const lifeId = group.life_id.toLowerCase().trim();
          const fontstyle = group.fontstyle;

          return {
            speciesName: groupName,
            mergeUnder: mergeUnder,
            lifeId: lifeId,
            order: group.order,
            fontstyle: fontstyle,
            x: x,
            y: y,
            depths: depths, // Include depths here
          };
        });

        setCsvDataSets(newSpeciesData);
      }, [rawData, taxaLifeFormAssignments, taxaData, selectedTaxa]);
      */

      // --- Commented-Out JSX Elements ---

      /* Age Model CSV Upload */
      /*
      <input
        type="file"
        accept=".csv"
        onChange={handleAgeModelUpload}
        id="ageModelInput"
        className={styles.fileInput}
      />
      <label
        htmlFor="ageModelInput"
        className={styles.customFileButton}
      >
        Upload Age Model CSV File
      </label>
      */

      /* Taxa Typing CSV Upload */
      /*
      <input
        type="file"
        accept=".csv"
        onChange={handleTaxaTypingUpload}
        id="taxaTypingInput"
        className={styles.fileInput}
      />
      <label
        htmlFor="taxaTypingInput"
        className={styles.customFileButton}
      >
        Upload Taxa Typing CSV File
      </label>
      */

      /* Alert Message */
      /*
      {(ageModelData.length === 0 || taxaData.length === 0) && (
        <div className={styles.alertMessage}>
          Please upload the Age Model CSV and Taxa Typing CSV files before uploading the Data CSV file.
        </div>
      )}
      */

      // --- Commented-Out Variables in preparePlotData ---

      /*
      const allAges = sortedDataSets.flatMap((dataset) => dataset.y);
      const minAge = Math.min(...allAges);
      const maxAge = Math.max(...allAges);
      layout["yaxis"] = {
        title: yAxisLabel,
        autorange: 'reversed',
        range: [maxAge, minAge],
        tickmode: "linear",
        dtick: 500, // Adjust intervals as needed
        ticks: "outside",
        ticklen: 5,
        showline: true,
        linewidth: 1,
        linecolor: "black",
        tickfont: {
          size: 10,
        },
      };
      */

      // --- Commented-Out Taxa Data and Mappings ---

      /* List of taxa to include using merge_under codes (all in lowercase) */
      /*
      const taxaToInclude = [
        "pp", // Pinus
        "cu", // Cupressaceae
        "fx", // Fraxinus
        "ab", // Abies
        "q",  // Quercus
        "ro", // Rosaceae
        "sx", // Salix
        "hs", // Asteraceae
        "po", // Poaceae
        "py", // Polygonaceae
        "in", // Indeterminate
        "uk", // Unknown
      ];
      */

      /* Mapping from merge_under codes to full taxa names */
      /*
      const mergeUnderNameMapping = {
        pp: "Pinus",
        cu: "Cupressaceae",
        fx: "Fraxinus",
        ab: "Abies",
        q: "Quercus",
        ro: "Rosaceae",
        sx: "Salix",
        hs: "Asteraceae",
        po: "Poaceae",
        py: "Polygonaceae",
        in: "Indeterminate",
        uk: "Unknown",
      };
      */

      }
    </>
  );
}

export default Dashboard;
