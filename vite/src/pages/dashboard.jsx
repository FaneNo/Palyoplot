// dashboard.jsx

import React, { useState, useRef, useEffect, useMemo } from "react";
import Papa from "papaparse";
import DashboardNav from "../components/dashboardNav";
import styles from "../cssPages/dashboardPage.module.css";
import Plot from "react-plotly.js";
import Plotly from "plotly.js-dist-min";
import api from "../api";

import { useLocation } from "react-router-dom";

// Updated TaxaSelection component without Y-axis assignment per taxa
function TaxaSelection({
  availableTaxa,
  selectedTaxa,
  setSelectedTaxa,
  taxaFontStyles,
  setTaxaFontStyles,
  yAxisColumn,
}) {
  const handleTaxaChange = (taxaName) => {
    if (selectedTaxa.includes(taxaName)) {
      setSelectedTaxa(selectedTaxa.filter((t) => t !== taxaName));
    } else {
      setSelectedTaxa([...selectedTaxa, taxaName]);
    }
  };

  const handleFontStyleChange = (taxaName, fontstyle) => {
    setTaxaFontStyles((prevStyles) => ({
      ...prevStyles,
      [taxaName]: fontstyle,
    }));
  };

  const excludedColumns = [yAxisColumn, "adj_depth", "core_depth"];

  return (
    <div className={styles.taxaSelection}>
      <h3>Select Taxa to Plot and Set Font Style</h3>
      <table className={styles.taxaTable}>
        <thead>
          <tr>
            <th>Plot</th>
            <th>Taxa Name</th>
            <th>Italicize</th>
          </tr>
        </thead>
        <tbody>
          {availableTaxa
            .filter((taxaName) => !excludedColumns.includes(taxaName))
            .map((taxaName) => (
              <tr key={taxaName}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedTaxa.includes(taxaName)}
                    onChange={() => handleTaxaChange(taxaName)}
                  />
                </td>
                <td>{taxaName}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={taxaFontStyles[taxaName] === "italic"}
                    onChange={(e) =>
                      handleFontStyleChange(
                        taxaName,
                        e.target.checked ? "italic" : "normal"
                      )
                    }
                  />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

// Define LifeFormColorAssignment component within the same file
function LifeFormColorAssignment({
  lifeFormGroups,
  setLifeFormGroups,
  setTaxaLifeFormAssignments,
}) {
  const [newLifeFormName, setNewLifeFormName] = useState("");
  const [newLifeFormColor, setNewLifeFormColor] = useState("#000000");

  const handleAddLifeForm = () => {
    const newLifeForm = {
      life_id: `lf${lifeFormGroups.length + 1}`,
      life_name: newLifeFormName,
      color: newLifeFormColor,
    };
    setLifeFormGroups([...lifeFormGroups, newLifeForm]);
    setNewLifeFormName("");
    setNewLifeFormColor("#000000");
  };

  const handleRemoveLifeForm = (index) => {
    const updatedGroups = lifeFormGroups.filter((_, i) => i !== index);
    setLifeFormGroups(updatedGroups);
  };

  const handleNameChange = (index, newName) => {
    const updatedGroups = [...lifeFormGroups];
    updatedGroups[index].life_name = newName;
    setLifeFormGroups(updatedGroups);
  };

  const handleColorChange = (index, newColor) => {
    const updatedGroups = [...lifeFormGroups];
    updatedGroups[index].color = newColor;
    setLifeFormGroups(updatedGroups);
  };

  // Function to move life forms up and down
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
    <div className={styles.lifeFormAssignment}>
      <h3>Edit Life Forms</h3>
      <table className={styles.lifeFormTable}>
        <thead>
          <tr>
            <th>Life Form Name</th>
            <th>Color</th>
            <th>Reorder</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {lifeFormGroups.map((group, index) => (
            <tr key={group.life_id}>
              <td>
                <input
                  type="text"
                  value={group.life_name}
                  onChange={(e) => handleNameChange(index, e.target.value)}
                />
              </td>
              <td>
                <input
                  type="color"
                  value={group.color}
                  onChange={(e) => handleColorChange(index, e.target.value)}
                />
              </td>
              <td>
                <div className={styles.lifeFormButtons}>
                  <button
                    onClick={() => moveLifeForm(index, -1)}
                    disabled={index === 0}
                    className={styles.moveButton}
                  >
                    ▲
                  </button>
                  <button
                    onClick={() => moveLifeForm(index, 1)}
                    disabled={index === lifeFormGroups.length - 1}
                    className={styles.moveButton}
                  >
                    ▼
                  </button>
                </div>
              </td>
              <td>
                <button onClick={() => handleRemoveLifeForm(index)}>
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h4>Add New Life Form</h4>
      <div className={styles.addLifeForm}>
        <input
          type="text"
          value={newLifeFormName}
          onChange={(e) => setNewLifeFormName(e.target.value)}
          placeholder="Life Form Name"
        />
        <input
          type="color"
          value={newLifeFormColor}
          onChange={(e) => setNewLifeFormColor(e.target.value)}
        />
        <button onClick={handleAddLifeForm}>Add Life Form</button>
      </div>
    </div>
  );
}

// Define TaxaLifeFormAssignment component within the same file
function TaxaLifeFormAssignment({
  taxaNames,
  lifeFormGroups,
  taxaLifeFormAssignments,
  setTaxaLifeFormAssignments,
}) {
  const handleAssignmentChange = (taxaName, lifeFormId) => {
    setTaxaLifeFormAssignments((prevAssignments) => ({
      ...prevAssignments,
      [taxaName]: lifeFormId,
    }));
  };

  return (
    <div className={styles.taxaLifeFormAssignment}>
      <h3>Assign Taxa to Life Forms</h3>
      <table className={styles.taxaLifeFormTable}>
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
                    handleAssignmentChange(taxaName, e.target.value)
                  }
                >
                  <option value="">Unassigned</option>
                  {lifeFormGroups.map((group) => (
                    <option key={group.life_id} value={group.life_id}>
                      {group.life_name}
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

function Dashboard() {
  const location = useLocation();
  const autoGraphData = location.state?.autoGraphData;

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

  // Add xAxisLabel state variable
  const [xAxisLabel, setXAxisLabel] = useState("Values");

  const [plotType, setPlotType] = useState("area");
  const [orientation, setOrientation] = useState("h");

  // Add state variable for reversing y-axis
  const [reverseYAxis, setReverseYAxis] = useState(false);

  // Download functionality state variables
  const [modalOpen, setModalOpen] = useState(false);
  const [resolution, setResolution] = useState("Medium");
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

  // State variables for taxa selection visibility and font styles
  const [showTaxaSelection, setShowTaxaSelection] = useState(false);
  const [taxaFontStyles, setTaxaFontStyles] = useState({});

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

  // Function to handle uploading graph image to backend
  const handleSaveImage = async () => {
    const graphElement = document.querySelector(".js-plotly-plot"); // Targets the plotly graph

    try {
      // Capture image in base64
      const imageBase64 = await Plotly.toImage(graphElement, { format: "png", width: 800, height: 600});

      // Call function to upload image to database
      await uploadImageToDatabase(imageBase64);
      alert("Graph image saved successfully");

    } catch (error) {
        console.error("Error capturing graph image: ", error);
        alert("Failed to save graph image");
    }
  };

  // Function to send image to backend
  const uploadImageToDatabase = async (imageBase64) => {

    try {
      const response = await fetch("/api/upload-graph-image", {
        method: "POST",
        headers: {
          "Content-Type" : "application/json",
        },
        body: JSON.stringify({ image_data: imageBase64}),
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }
    } catch (error) {
        console.error("Error uploading image:", error);
    }
  };


  // Handle auto-graphing
  useEffect(() => {
    if (autoGraphData) {
      // Set the y-axis column to the first numeric column
      const numericColumn = autoGraphData.headers.find((header) => {
        return autoGraphData.data.some((row) => !isNaN(parseFloat(row[header])));
      });

      if (numericColumn) {
        setYAxisColumn(numericColumn);

        // Set selected taxa to all remaining numeric columns
        const remainingNumericColumns = autoGraphData.headers.filter((header) => {
          return (
            header !== numericColumn &&
            autoGraphData.data.some((row) => !isNaN(parseFloat(row[header])))
          );
        });

        setSelectedTaxa(remainingNumericColumns);

        // Set raw data
        setRawData(autoGraphData.data);

        // Set availableTaxa
        setAvailableTaxa(autoGraphData.headers);

        // Set default graph title using file name
        setGraphTitle(
          `${autoGraphData.fileName} - Graph ${autoGraphData.displayId}`
        );
      }
    }
  }, [autoGraphData]);

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

      // Get yData for y-axis
      const yData = rawData.map((row) => parseFloat(row[yAxisColumn]) || 0);

      const lifeId = taxaLifeFormAssignments[taxaName];
      const fontStyle = taxaFontStyles[taxaName] || "normal";

      return {
        speciesName: taxaName,
        lifeId: lifeId,
        x: x,
        yData: yData,
        fontstyle: fontStyle,
      };
    });

    setCsvDataSets(newSpeciesData);
  }, [
    rawData,
    taxaLifeFormAssignments,
    selectedTaxa,
    yAxisColumn,
    taxaFontStyles,
  ]);

  // Prepare data for plotting using useMemo
  const memoizedPlotData = useMemo(() => {
    return preparePlotData();
  }, [
    csvDataSets,
    graphTitle,
    yAxisLabel,
    xAxisLabel,
    plotType,
    orientation,
    reverseYAxis,
    taxaFontStyles,
    lifeFormGroups,
  ]);

  const { plotData, layout } = memoizedPlotData;

  function preparePlotData() {
    if (csvDataSets.length === 0) return { plotData: [], layout: {} };

    const plotData = [];
    const annotations = [];

    // Use life form order defined by the user
    const lifeformOrder = lifeFormGroups.map((group) => group.life_id);

    const numTaxa = csvDataSets.length;

    // Mapping from life_id to color and name
    const lifeFormColorMap = {};
    const lifeFormNameMap = {};
    lifeFormGroups.forEach((group) => {
      lifeFormColorMap[group.life_id] = group.color;
      lifeFormNameMap[group.life_id] = group.life_name;
    });

    // Adjust layout margins for overall x-axis label
    const layout = {
      title: graphTitle,
      showlegend: false,
      annotations: [],
      margin: { t: 180, b: 180, l: 100, r: 100 }, // Adjust margins as needed
    };

    // Dynamic font scaling based on layout height
    layout.height = 600; // Fixed height
    const baseFontSize = (layout.height / 600) * 12;

    // Define positions for Y-axis
    const yAxisPosition = 0.08; // Adjusted to create a gap from the edge
    const gapBetweenYAxisAndSubplot = 0.02; // Gap between Y-axis and first subplot

    const subplotSpacing = 0.02; // 2% spacing between subplots
    const xLeftMargin =
      yAxisPosition + gapBetweenYAxisAndSubplot; // Start after Y-axis
    const xRightMargin = 0.02; // 2% right margin

    // Thresholds for exaggeration
    const threshold = 5; // Threshold below which exaggeration is applied
    const desiredMaxValue = 20; // Value to scale up to

    // Set fixed tick interval
    const tickInterval = 10;

    // Group datasets by life form
    const lifeformGroupsData = {};

    // Arrays to store data ranges and adjusted max values
    const dataRanges = [];
    const adjustedMaxValues = [];

    // Get yData for y-axis from the first dataset (since yData is common across datasets)
    const yData = csvDataSets[0].yData;

    // Sort csvDataSets by lifeformOrder and speciesName
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

    sortedDataSets.forEach((dataset) => {
      if (dataset.x.length === 0 || dataset.yData.length === 0) {
        dataRanges.push(0);
        adjustedMaxValues.push(0);
        return; // Skip datasets with no data
      }

      // Apply exaggeration for small data sets
      const originalMaxValue = Math.max(...dataset.x);

      let exaggerationFactor = 1;
      if (originalMaxValue < threshold && originalMaxValue > 0) {
        exaggerationFactor = desiredMaxValue / originalMaxValue;
        // Multiply dataset.x by exaggerationFactor
        dataset.x = dataset.x.map((value) => value * exaggerationFactor);
      }

      // Use exaggerated max value to set xAxisRange
      const adjustedMaxValue = originalMaxValue * exaggerationFactor;
      adjustedMaxValues.push(adjustedMaxValue);

      // Ensure xAxisMax is a multiple of the tickInterval
      const xAxisMax =
        Math.ceil(Math.max(adjustedMaxValue * 1.1, 10) / tickInterval) *
        tickInterval;
      const dataRange = xAxisMax; // Since xAxisMin is 0
      dataRanges.push(dataRange);
    });

    // Calculate total data range
    const totalDataRange = dataRanges.reduce((a, b) => a + b, 0);

    // Calculate subplot domains proportionally
    const totalSpacing = subplotSpacing * (numTaxa - 1);
    const availableDomain = 1 - xLeftMargin - xRightMargin - totalSpacing;
    const domainPerDataUnit = availableDomain / totalDataRange;

    let xStart = xLeftMargin;

    sortedDataSets.forEach((dataset, index) => {
      if (dataset.x.length === 0 || dataset.yData.length === 0) {
        return; // Skip datasets with no data
      }

      const subplotIndex = index + 1;

      const dataRange = dataRanges[index];

      const subplotWidth = dataRange * domainPerDataUnit;

      let xEnd = xStart + subplotWidth;
      if (xEnd > 1) xEnd = 1;

      const adjustedMaxValue = adjustedMaxValues[index];

      const xAxisMin = 0;
      const xAxisMax =
        Math.ceil(Math.max(adjustedMaxValue * 1.1, 10) / tickInterval) *
        tickInterval;
      const xAxisRange = [xAxisMin, xAxisMax];

      const xData = dataset.x;
      const yDataToUse = dataset.yData;

      const lifeId = dataset.lifeId;
      const color = lifeFormColorMap[lifeId] || "#808080"; // Default to gray if color not specified

      // Determine the correct plot type and fill property
      let traceType = plotType;
      let fill = "none";
      if (plotType === "area") {
        traceType = "scatter";
        fill = orientation === "h" ? "tozerox" : "tozeroy";
      }

      plotData.push({
        x: xData,
        y: yDataToUse,
        xaxis: `x${subplotIndex}`,
        yaxis: "y", // Always use primary Y-axis
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
          size: baseFontSize * 0.8,
          style: dataset.fontstyle,
        },
      });

      // Collect indices for life form groups
      if (!lifeformGroupsData[lifeId]) {
        lifeformGroupsData[lifeId] = [];
      }
      lifeformGroupsData[lifeId].push({ dataset, index, xStart, xEnd });

      // Configure xaxis with fixed intervals
      layout[`xaxis${subplotIndex}`] = {
        domain: [xStart, xEnd],
        anchor: "free",
        position: 0, // Attach to the bottom
        title: "",
        range: xAxisRange,
        tickmode: "linear",
        dtick: tickInterval,
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
          size: baseFontSize * 0.7,
        },
      };

      // Update xStart for next subplot
      xStart = xEnd + subplotSpacing;
    });

    // Adjust life form group annotations (category names)
    Object.keys(lifeformGroupsData).forEach((lifeId) => {
      const groupData = lifeformGroupsData[lifeId];
      const firstXStart = groupData[0].xStart;
      const lastXEnd = groupData[groupData.length - 1].xEnd;

      // Calculate center position in paper coordinates
      const xCenterPaper = (firstXStart + lastXEnd) / 2;

      // Add life form group name annotation
      annotations.push({
        text: lifeFormNameMap[lifeId] || lifeId,
        xref: "paper",
        yref: "paper",
        x: xCenterPaper,
        y: 1.12, // Adjust as needed
        showarrow: false,
        font: {
          size: baseFontSize * 1.1,
          color: lifeFormColorMap[lifeId] || "#808080",
        },
      });
    });

    // Configure shared y-axis
    layout["yaxis"] = {
      title: "", // We'll use annotations for labels
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
        size: baseFontSize * 0.8,
      },
      position: yAxisPosition,
      anchor: "free", // Important for positioning
      side: "left",
      showticklabels: true, // Ensure ticks and labels are shown
    };

    // Add annotations for Y-axis labels above the axes
    annotations.push({
      text: yAxisLabel,
      xref: "paper",
      yref: "paper",
      x: yAxisPosition - 0.02,
      y: 1.02,
      showarrow: false,
      xanchor: "center",
      yanchor: "bottom",
      textangle: -90,
      font: {
        size: baseFontSize,
      },
    });

    // Add overall x-axis label using xAxisLabel state variable
    annotations.push({
      text: xAxisLabel,
      xref: "paper",
      yref: "paper",
      x: 0.5,
      y: -0.2, // Adjust as needed
      showarrow: false,
      font: {
        size: baseFontSize,
      },
    });

    layout.annotations = annotations;

    // Adjust layout width dynamically
    layout.width = 1500; // Or set to desired fixed width
    layout.height = 600; // Fixed height
    layout.autosize = false;
    layout.responsive = true;

    return { plotData, layout };
  }

  // Function to download the graph
  const downloadGraph = () => {
    if (isDownloading) {
      console.warn("Download already in progress. Please wait.");
      return;
    }

    // Map resolution to width and height
    const resolutionMap = {
      Medium: { width: 1600, height: 1200 },
      Large: { width: 1920, height: 1080 },
    };

    const { width, height } = resolutionMap[resolution];

    if (
      !graphRef.current ||
      !graphRef.current.el ||
      !csvDataSets ||
      csvDataSets.length === 0
    ) {
      console.error("No data to download.");
      setShowWarning(true);
      return;
    }

    setIsDownloading(true);

    // Generate plotData and layout with specified width and height
    const { plotData: exportPlotData, layout: exportLayout } = preparePlotData();

    // Prepare options for Plotly.toImage
    const downloadOptions = {
      format: imageFormat,
      width: width,
      height: height,
    };

    // Generate the image data
    Plotly.toImage(
      {
        data: exportPlotData,
        layout: exportLayout,
        config: { responsive: false },
      },
      downloadOptions
    )
      .then((imageData) => {
        // Create a temporary link to download the image
        const link = document.createElement("a");
        link.href = imageData;
        link.download = `${graphTitle.replace(/ /g, "_")}.${imageFormat}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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

                        {/* Upload Image */}
                        <button
                          /*onClick={captureAndSaveGraphImage}*/
                          className={styles.customFileButton}
                          disabled={!file}
                        >
                          Upload Graph Image
                          </button>

                      </div>

                      {/* TaxaSelection Component */}
                      {showTaxaSelection && (
                        <TaxaSelection
                          availableTaxa={availableTaxa}
                          selectedTaxa={selectedTaxa}
                          setSelectedTaxa={setSelectedTaxa}
                          taxaFontStyles={taxaFontStyles}
                          setTaxaFontStyles={setTaxaFontStyles}
                          yAxisColumn={yAxisColumn}
                        />
                      )}

                      {/* Buttons to Show/Hide Assignments */}
                      <div className={styles.assignmentButtons}>
                        {availableTaxa.length > 0 && (
                          <>
                            <button
                              onClick={() =>
                                setShowTaxaSelection(!showTaxaSelection)
                              }
                              className={styles.customFileButton}
                            >
                              {showTaxaSelection
                                ? "Hide Taxa Selection"
                                : "Edit Taxa Selection"}
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
                            {/* New Button to Show/Hide TaxaLifeFormAssignment */}
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
                          setTaxaLifeFormAssignments={setTaxaLifeFormAssignments}
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
                                  const excludedColumns = [
                                    e.target.value,
                                    "adj_depth",
                                    "core_depth",
                                  ];
                                  setYAxisColumn(e.target.value);
                                  setSelectedTaxa(
                                    availableTaxa.filter(
                                      (col) => !excludedColumns.includes(col)
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

                            {/* X-Axis Label Input */}
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
                          </>
                        )}
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
                  <option value="Medium">Medium (1600x1200)</option>
                  <option value="Large">Large (1920x1080)</option>
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
    </>
  );
}

export default Dashboard;
