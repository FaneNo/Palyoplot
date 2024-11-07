import React, { useState, useRef, useEffect, useMemo } from "react";
import Papa from "papaparse";
import DashboardNav from "../components/dashboardNav";
import styles from "../cssPages/dashboardPage.module.css";
import Plot from "react-plotly.js";
import Plotly from "plotly.js-dist-min";
import api from "../api";

import { useLocation } from "react-router-dom";
import { ACCESS_TOKEN } from "../token";

// Updated TaxaSelection component without Y-axis assignment per taxa
function TaxaSelection({
  selectedTaxa,
  setSelectedTaxa,
  taxaFontStyles,
  setTaxaFontStyles,
  yAxisColumn,
  secondYAxisColumn,
  taxaLifeFormAssignments,
  lifeFormGroups,
  taxaOrder,
  setTaxaOrder,
  excludedColumns,
}) {
  // Function to move taxa within their life form
  const moveTaxa = (taxaName, direction) => {
    const lifeFormId = taxaLifeFormAssignments[taxaName];
    if (!lifeFormId) return;

    setTaxaOrder((prevOrder) => {
      const newOrder = { ...prevOrder };
      const taxaList = [...(newOrder[lifeFormId] || [])];
      const index = taxaList.indexOf(taxaName);

      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= taxaList.length) {
        return prevOrder; // Can't move outside of list bounds
      }

      // Swap taxa positions
      [taxaList[index], taxaList[targetIndex]] = [
        taxaList[targetIndex], 
        taxaList[index]
      ];
      newOrder[lifeFormId] = taxaList;
      return newOrder;
    });
  };

  const handleTaxaChange = (taxaName) => {
    if (selectedTaxa.includes(taxaName)) {
      // Remove taxa from selectedTaxa
      setSelectedTaxa(selectedTaxa.filter((t) => t !== taxaName));
    } else {
      // Add taxa back to selectedTaxa
      setSelectedTaxa([...selectedTaxa, taxaName]);
    }
  };

  const handleFontStyleChange = (taxaName, fontstyle) => {
    setTaxaFontStyles((prevStyles) => ({
      ...prevStyles,
      [taxaName]: fontstyle,
    }));
  };

  // Group all taxa by life form, including those not currently selected
  const allTaxa = Object.keys(taxaLifeFormAssignments).filter(
    (taxa) => !excludedColumns.includes(taxa)
  );
  const taxaByLifeForm = {};

  // Group selected taxa by life form
  allTaxa.forEach((taxaName) => {
    const lifeFormId = taxaLifeFormAssignments[taxaName] || "unassigned";
    if (!taxaByLifeForm[lifeFormId]) {
      taxaByLifeForm[lifeFormId] = [];
    }
    taxaByLifeForm[lifeFormId].push(taxaName);
  });

  // Sort taxa within each life form based on taxaOrder
  Object.keys(taxaByLifeForm).forEach((lifeFormId) => {
    const order = taxaOrder[lifeFormId] || taxaByLifeForm[lifeFormId];
    taxaByLifeForm[lifeFormId] = order.filter((taxa) =>
      taxaByLifeForm[lifeFormId].includes(taxa)
    );
  });

  return (
    <div className={styles.taxaSelection}>
      <h3>Include/Exclude Taxa, Reorder within Life Forms, and Set Font Style</h3>
      {Object.keys(taxaByLifeForm).map((lifeFormId) => {
        const lifeFormName =
          lifeFormGroups.find((group) => group.life_id === lifeFormId)
            ?.life_name || "Unassigned";
        return (
          <div key={lifeFormId} className={styles.lifeFormSection}>
            <h4>{lifeFormName}</h4>
            <table className={styles.taxaTable}>
              <thead>
                <tr>
                  <th>Include</th>
                  <th>Taxa Name</th>
                  <th>Italicize</th>
                  <th>Reorder</th>
                </tr>
              </thead>
              <tbody>
                {taxaByLifeForm[lifeFormId].map((taxaName, index) => (
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
                    <td>
                      <div className={styles.reorderButtons}>
                        <button
                          onClick={() => moveTaxa(taxaName, -1)}
                          disabled={index === 0}
                        >
                          ◄
                        </button>
                        <button
                          onClick={() => moveTaxa(taxaName, 1)}
                          disabled={
                            index === taxaByLifeForm[lifeFormId].length - 1
                          }
                        >
                          ►
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
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
    className={styles.lifeFormInput}
  />
  <input
    type="color"
    value={newLifeFormColor}
    onChange={(e) => setNewLifeFormColor(e.target.value)}
    className={styles.colorPicker}
  />
  <button onClick={handleAddLifeForm} className={styles.addLifeFormButton}>
    Add Life Form
  </button>
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
    <div className={styles.taxaLifeFormAssignmentWrapper}>
      <div className={styles.taxaLifeFormAssignment}>
        <h3 className={styles.taxaTitle}>Assign Taxa to Life Forms</h3>
        <table className={styles.taxaLifeFormTable}>
          <thead>
            <tr>
              <th className={styles.headerTaxa}>Taxa Name</th>
              <th className={styles.headerLifeForm}>Life Form</th>
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
                    className={styles.lifeFormSelect}
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
    </div>
  );
}


const excludedColumns = [];

function Dashboard() {
  const location = useLocation();
  const autoGraphData = location.state?.autoGraphData;

  // const excludedColumns = ["age", "adj_depth", "core_depth"];

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
  const [secondYAxisLabel, setSecondYAxisLabel] = useState("Second Y-Axis");

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
  const [secondYAxisColumn, setSecondYAxisColumn] = useState("");

  // State variables to control the visibility of the Assignment components
  const [showLifeFormAssignment, setShowLifeFormAssignment] = useState(false);
  const [showTaxaAssignment, setShowTaxaAssignment] = useState(false);

  // State for file upload
  const [file, setFile] = useState(null);

  // State variables for taxa selection visibility and font styles
  const [showTaxaSelection, setShowTaxaSelection] = useState(false);
  const [taxaFontStyles, setTaxaFontStyles] = useState({});

  // New State for Authentication Token
  const [authToken, setAuthToken] = useState(localStorage.getItem("accessToken"));

  // New State variable to keep track of taxa roder within life form
  const [taxaOrder, setTaxaOrder] = useState({});

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

        // Exclude specified columns from availableTaxa
        const filteredHeaders = headers.filter(
          (col) => !excludedColumns.includes(col)
        );
        setAvailableTaxa(filteredHeaders);

        // Initialize selectedTaxa to include all taxa (excluding known columns)
        const initialSelectedTaxa = filteredHeaders;
        setSelectedTaxa(initialSelectedTaxa);

        // Reset selected taxa and y-axis column
        setYAxisColumn("");
        setSecondYAxisColumn("");
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
    const graphElement = graphRef.current?.el;

    try {
      // Capture image in base64
      const image = await Plotly.toImage(graphElement, { format: "png", width: 800, height: 600});
      const response = await fetch(image);
      const imageBlob = await response.blob();

      //console.log("Captured base64 image data: ", imageBase64);

      // Call function to upload image to database
      await uploadImageToDatabase(imageBlob);
      alert("Graph image saved successfully");
    } catch (error) {
      console.error("Error capturing graph image: ", error);
      alert("Failed to save graph image");
    }
  };

  // Function to send image to backend
  const uploadImageToDatabase = async (imageBlob) => {

    const formData = new FormData();
    formData.append("image", imageBlob, "graph.png");
    // const token = localStorage.getItem("accessToken");

    const token = localStorage.getItem(ACCESS_TOKEN);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/upload-graph-image/", {
        method: "POST",
        headers: {
          "Authorization" : `Bearer ${token}`,
        },
        //credentials: "include",
        body: formData,
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
        const excludedColumns = [
          numericColumn,
          secondYAxisColumn,
          "adj_depth",
          "core_depth",
        ];

        const remainingNumericColumns = autoGraphData.headers.filter(
          (header) => {
            return (
              !excludedColumns.includes(header) &&
              !excludedColumns.includes(header) &&
              autoGraphData.data.some((row) => !isNaN(parseFloat(row[header])))
            );
          }
        );

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
  }, [autoGraphData, secondYAxisColumn]);

  // Update taxaOrder when selectedTaxa or taxaLifeFormAssignments change
  useEffect(() => {
    setTaxaOrder((prevOrder) => {
      const newOrder = { ...prevOrder };

      // Include all taxa in taxaOrder, even if not selected
      const allTaxa = Object.keys(taxaLifeFormAssignments);
      allTaxa.forEach((taxa) => {
        const lifeFormId = taxaLifeFormAssignments[taxa] || "unassigned";
        if (!newOrder[lifeFormId]) {
          newOrder[lifeFormId] = [];
        }
        if (!newOrder[lifeFormId].includes(taxa)) {
          newOrder[lifeFormId].push(taxa);
        }
      });

      // Remove taxa that are no longer selected
      Object.keys(newOrder).forEach((lifeFormId) => {
        newOrder[lifeFormId] = newOrder[lifeFormId].filter((taxa) =>
          allTaxa.includes(taxa)
        );
      });

      return newOrder;
    });
  }, [taxaLifeFormAssignments]);

  useEffect(() => {
    setTaxaLifeFormAssignments((prevAssignments) => {
      const newAssignments = { ...prevAssignments };
      availableTaxa.forEach((taxa) => {
        if (!excludedColumns.includes(taxa) && !newAssignments[taxa]) {
          newAssignments[taxa] = ""; // Default life form ID (unassigned)
        }
      });
      return newAssignments;
    });
  }, [availableTaxa, excludedColumns]);
  

  // Prepare data for plotting
  useEffect(() => {
    if (rawData.length === 0 || selectedTaxa.length === 0 || !yAxisColumn || !taxaLifeFormAssignments) return;

    const newSpeciesData = selectedTaxa.map((taxaName) => {
      const x = rawData.map((row) => parseFloat(row[taxaName]) || 0);

      // Get yData for y-axis
      const yData = rawData.map((row) => parseFloat(row[yAxisColumn]) || 0);

      const lifeId = taxaLifeFormAssignments[taxaName] || "unassigned";
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
    selectedTaxa,
    yAxisColumn,
    secondYAxisColumn,
    taxaFontStyles,
    taxaLifeFormAssignments,
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
    secondYAxisColumn,
    secondYAxisLabel,
    rawData,
    yAxisColumn,
    taxaOrder,
    selectedTaxa,
  ]);

  const { plotData, layout } = memoizedPlotData;

  function preparePlotData() {
    if (csvDataSets.length === 0) return { plotData: [], layout: {} };

    // Filter csvDataSets to only include selected taxa
    const filteredCsvDataSets = csvDataSets.filter((dataset) =>
    selectedTaxa.includes(dataset.speciesName)
    );

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

    lifeFormNameMap["unassigned"] = "Unassigned";

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

    // Define positions for Y-axes
    const gapBetweenYAxisAndSubplot = 0.02; // Gap between Y-axis and first subplot
    const gapBetweenYAxes = 0.05; // Gap between the two Y-axes

    // Positions for the Y-axes
    const secondYAxisPosition = 0.05; // Leftmost position
    const firstYAxisPosition = secondYAxisColumn
      ? secondYAxisPosition + gapBetweenYAxes
      : secondYAxisPosition;

    const xLeftMargin =
      firstYAxisPosition + gapBetweenYAxisAndSubplot; // Start after Y-axis
    const xRightMargin = 0.02; // 2% right margin

    // Thresholds for exaggeration
    const threshold = 5; // Threshold below which exaggeration is applied
    const desiredMaxValue = 20; // Value to scale up to

    // Set fixed tick interval for x-axes
    const tickInterval = 10;

    // Arrays to store data ranges and adjusted max values
    const dataRanges = [];
    const adjustedMaxValues = [];

    // Get yData for y-axis from the first dataset (since yData is common across datasets)
    const yData = csvDataSets[0].yData;

    // Get yData2 for second y-axis if specified
    const yData2 = secondYAxisColumn
      ? rawData.map((row) => parseFloat(row[secondYAxisColumn]) || 0)
      : null;

    // Compute y-axis range and ticks for primary y-axis
    const yDataMin1 = Math.min(...yData);
    const yDataMax1 = Math.max(...yData);

    // Use getNiceTickInterval to compute dtick1
    const yRange1 = yDataMax1 - yDataMin1 || 1; // Prevent division by zero
    const dtick1 = getNiceTickInterval(yRange1);

    // Adjust yAxisMin and yAxisMax to be multiples of dtick1
    const yAxisMin1 = yDataMin1; // Start from actual data minimum
    const yAxisMax1 = yDataMax1; // End at actual data maximum

    const yAxisRange1 = reverseYAxis
      ? [yAxisMax1, yAxisMin1]
      : [yAxisMin1, yAxisMax1];

    // Generate y-axis tick values for primary y-axis
    let yaxisTickvals1 = [];
    let currentTick = Math.ceil(yDataMin1 / dtick1) * dtick1;
    if (currentTick > yDataMin1) {
      currentTick -= dtick1;
    }
    while (currentTick <= yDataMax1) {
      yaxisTickvals1.push(currentTick);
      currentTick += dtick1;
    }

    // Generate tick labels for primary y-axis
    let yaxisTicktext1 = yaxisTickvals1.map((val) => val.toString());

    // Reverse tickvals and ticktext if reverseYAxis is true
    if (reverseYAxis) {
      yaxisTickvals1 = yaxisTickvals1.reverse();
      yaxisTicktext1 = yaxisTicktext1.reverse();
    }

    // Compute y-axis range and ticks for secondary y-axis if present
    let yAxisRange2, yaxisTickvals2, yaxisTicktext2, dtick2;
    if (secondYAxisColumn && yData2) {
      const yDataMin2 = Math.min(...yData2);
      const yDataMax2 = Math.max(...yData2);

      // Use getNiceTickInterval to compute dtick2
      const yRange2 = yDataMax2 - yDataMin2 || 1; // Prevent division by zero
      dtick2 = getNiceTickInterval(yRange2);

      const yAxisMin2 = yDataMin2; // Start from actual data minimum
      const yAxisMax2 = yDataMax2; // End at actual data maximum

      yAxisRange2 = reverseYAxis
        ? [yAxisMax2, yAxisMin2]
        : [yAxisMin2, yAxisMax2];

      // Generate y-axis tick values for secondary y-axis
      yaxisTickvals2 = [];
      let currentTick2 = Math.ceil(yDataMin2 / dtick2) * dtick2;
      if (currentTick2 > yDataMin2) {
        currentTick2 -= dtick2;
      }
      while (currentTick2 <= yDataMax2) {
        yaxisTickvals2.push(currentTick2);
        currentTick2 += dtick2;
      }

      // Generate tick labels for secondary y-axis
      yaxisTicktext2 = yaxisTickvals2.map((val) => val.toString());

      // Reverse tickvals and ticktext if reverseYAxis is true
      if (reverseYAxis) {
        yaxisTickvals2 = yaxisTickvals2.reverse();
        yaxisTicktext2 = yaxisTicktext2.reverse();
      }
    }

    // Sort csvDataSets by lifeformOrder and speciesName
    const sortedDataSets = [];

    // Loop over life forms in the order defined by the user
    lifeformOrder.forEach((lifeFormId) => {
      // Get taxa for this life form, according to taxaOrder
      const taxaInLifeForm = taxaOrder[lifeFormId] || [];

      taxaInLifeForm.forEach((taxaName) => {
        const dataset = csvDataSets.find(
          (d) => d.speciesName === taxaName && d.lifeId === lifeFormId
        );
        if (dataset) {
          sortedDataSets.push(dataset);
        }
      });
    });

    // Add any taxa not assigned to a life form or not in taxaOrder
    const unassignedTaxa = filteredCsvDataSets.filter(
      (d) => !d.lifeId || !lifeformOrder.includes(d.lifeId)
    );
    sortedDataSets.push(...unassignedTaxa);

    // Initialize lifeformGroupsData
    const lifeformGroupsData = {};

    // Define subplotSpacing
    const subplotSpacing = 0.02; // 2% spacing between subplots

    sortedDataSets.forEach((dataset, index) => {
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

      const lifeId = dataset.lifeId || "unassigned";
      const color = lifeFormColorMap[lifeId] || "#808080"; // Default to gray if color not specified

      // Determine the correct plot type and fill property
      let traceType = plotType;
      let fill = "none";
      if (plotType === "area") {
        traceType = "scatter";
        fill = orientation === "h" ? "tozerox" : "tozeroy";
      }

      // Prepare hover template
      let hoverTemplate = `%{x}, %{y}<extra>${dataset.speciesName}</extra>`;
      if (secondYAxisColumn && yData2) {
        hoverTemplate = `%{x}, %{y}<br>${secondYAxisLabel}: %{customdata}<extra>${dataset.speciesName}</extra>`;
      }

      plotData.push({
        x: xData,
        y: yDataToUse,
        customdata: yData2, // Add second y-axis data
        xaxis: `x${subplotIndex}`,
        yaxis: "y", // Use primary Y-axis
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
        hovertemplate: hoverTemplate,
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
        text: lifeFormNameMap[lifeId] || "Unassigned",
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

    // Configure primary y-axis
    layout["yaxis"] = {
      title: "", // We'll use annotations for labels
      autorange: false,
      range: yAxisRange1,
      tickmode: "linear",
      dtick: dtick1,
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
      position: firstYAxisPosition,
      anchor: "free", // Important for positioning
      side: "left",
      showticklabels: true, // Ensure ticks and labels are shown
      tickvals: yaxisTickvals1,
      ticktext: yaxisTicktext1,
      zeroline: false, // Remove the black line at y=0
    };

    // Configure secondary y-axis if present
    if (secondYAxisColumn && yData2) {
      layout["yaxis2"] = {
        title: "",
        overlaying: "y",
        side: "left",
        position: secondYAxisPosition,
        showticklabels: true,
        tickmode: "linear",
        dtick: dtick2,
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
        range: yAxisRange2,
        autorange: false,
        zeroline: false, // Remove the black line at y=0
      };

      // Adjust left margin to accommodate the second y-axis
      layout.margin.l += 50;

      // Add an invisible trace to include hover data for the second y-axis
      plotData.push({
        x: yData, // Use the yData as x-values to align correctly
        y: yData2,
        xaxis: "x0",
        yaxis: "y2",
        mode: "markers",
        marker: { color: "rgba(0,0,0,0)" }, // Invisible markers
        showlegend: false,
        hoverinfo: "skip", // We handle hoverinfo in the main traces
      });

      // Define a hidden x-axis that spans the full domain
      layout["xaxis0"] = {
        domain: [xLeftMargin, 1 - xRightMargin],
        showgrid: false,
        showline: false,
        showticklabels: false,
        zeroline: false,
        anchor: "free",
        overlaying: `x${1}`, // Overlay on the first subplot's x-axis
        position: 0,
      };
    }

    // Add annotations for Y-axis labels above the axes
    annotations.push({
      text: yAxisLabel,
      xref: "paper",
      yref: "paper",
      x: firstYAxisPosition,
      y: 1.02,
      showarrow: false,
      xanchor: "center",
      yanchor: "bottom",
      textangle: -90,
      font: {
        size: baseFontSize,
      },
    });

    if (secondYAxisColumn) {
      annotations.push({
        text: secondYAxisLabel,
        xref: "paper",
        yref: "paper",
        x: secondYAxisPosition,
        y: 1.02,
        showarrow: false,
        xanchor: "center",
        yanchor: "bottom",
        textangle: -90,
        font: {
          size: baseFontSize,
        },
      });
    }

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

  // Function to compute a "nice" tick interval
  function getNiceTickInterval(range) {
    if (range === 0) {
      return 1; // default tick interval
    }
    const roughTick = range / 5; // aim for around 5 ticks
    const log10RoughTick = Math.log10(Math.abs(roughTick));
    const magnitude = Math.pow(10, Math.floor(log10RoughTick));
    const residual = roughTick / magnitude;
    let niceTick;
    if (residual >= 5) {
      niceTick = 5 * magnitude;
    } else if (residual >= 2) {
      niceTick = 2 * magnitude;
    } else if (residual >= 1) {
      niceTick = magnitude;
    } else if (residual >= 0.5) {
      niceTick = 0.5 * magnitude;
    } else if (residual >= 0.2) {
      niceTick = 0.2 * magnitude;
    } else {
      niceTick = 0.1 * magnitude;
    }
    return niceTick;
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
                      {/* File Upload Buttons */}
                      <div className={styles.horizontalButtons}>
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
                        <button
                          onClick={handleSaveImage}
                          className={styles.customFileButton}
                          disabled={!file}
                        >
                          Upload Graph Image
                        </button>
                      </div>
  
                      {/* Graphing Tools Title */}
                      <h2 className={styles.graphingToolsTitle}>
                        Graphing Tools
                      </h2>
  
                      {/* Toolbar Buttons */}
                      <div className={styles.assignmentButtons}>
                        {availableTaxa.length > 0 && (
                          <>
                            <button
                              onClick={() =>
                                setShowTaxaSelection(!showTaxaSelection)
                              }
                              className={`${styles.customFileButton} ${
                                showTaxaSelection ? styles.hideButton : ""
                              }`}
                            >
                              {showTaxaSelection
                                ? "Hide Taxa Selection"
                                : "Edit Taxa Selection"}
                            </button>
                            <button
                              onClick={() =>
                                setShowLifeFormAssignment(
                                  !showLifeFormAssignment
                                )
                              }
                              className={`${styles.customFileButton} ${
                                showLifeFormAssignment ? styles.hideButton : ""
                              }`}
                            >
                              {showLifeFormAssignment
                                ? "Hide Life Forms"
                                : "Edit Life Forms"}
                            </button>
                            <button
                              onClick={() =>
                                setShowTaxaAssignment(!showTaxaAssignment)
                              }
                              className={`${styles.customFileButton} ${
                                showTaxaAssignment ? styles.hideButton : ""
                              }`}
                            >
                              {showTaxaAssignment
                                ? "Hide Taxa Assignments"
                                : "Assign Taxa to Life Forms"}
                            </button>
                          </>
                        )}
                      </div>
                    </div>
  
                    {/* Taxa Selection Component */}
                    {showTaxaSelection && (
                      <div className={styles.taxaSelectionSection}>
                        <TaxaSelection
                          availableTaxa={availableTaxa}
                          selectedTaxa={selectedTaxa}
                          setSelectedTaxa={setSelectedTaxa}
                          taxaFontStyles={taxaFontStyles}
                          setTaxaFontStyles={setTaxaFontStyles}
                          yAxisColumn={yAxisColumn}
                          secondYAxisColumn={secondYAxisColumn}
                          taxaLifeFormAssignments={taxaLifeFormAssignments}
                          lifeFormGroups={lifeFormGroups}
                          taxaOrder={taxaOrder}
                          setTaxaOrder={setTaxaOrder}
                          excludedColumns={excludedColumns}
                        />
                      </div>
                    )}
  
                    {/* Life Form Color and Name Assignment Component */}
                    {showLifeFormAssignment && (
                      <LifeFormColorAssignment
                        lifeFormGroups={lifeFormGroups}
                        setLifeFormGroups={setLifeFormGroups}
                        setTaxaLifeFormAssignments={setTaxaLifeFormAssignments}
                      />
                    )}
  
                    {/* Taxa Life Form Assignment Component */}
                    {showTaxaAssignment && availableTaxa.length > 0 && (
                      <TaxaLifeFormAssignment
                        taxaNames={availableTaxa.filter(
                          (col) => !excludedColumns.includes(col)
                        )}
                        lifeFormGroups={lifeFormGroups}
                        taxaLifeFormAssignments={taxaLifeFormAssignments}
                        setTaxaLifeFormAssignments={setTaxaLifeFormAssignments}
                        excludedColumns={excludedColumns}
                      />
                    )}
  
                    {/* Controls Section */}
                    <div className={styles.controlsContainer}>
                      {/* Left Column: Y-Axis Settings */}
                      <div className={styles.controlsColumnLeft}>
                        <div className={styles.controlGroup}>
                          <label className={styles.labelText}>
                            Select Y-Axis Column
                          </label>
                          <select
                            value={yAxisColumn}
                            onChange={(e) => setYAxisColumn(e.target.value)}
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

                        <div className={styles.controlGroup}>
                          <label className={styles.labelText}>
                            Y-Axis Label
                          </label>
                          <input
                            type="text"
                            value={yAxisLabel}
                            onChange={(e) => setYAxisLabel(e.target.value)}
                            className={styles.graphInput}
                            placeholder="Enter Y-axis label"
                          />
                        </div>
  
                        <div className={styles.controlGroup}>
                          <label className={styles.labelText}>
                            Second Y-Axis Column
                          </label>
                          <select
                            value={secondYAxisColumn}
                            onChange={(e) => setSecondYAxisColumn(e.target.value)}
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
  
                        {secondYAxisColumn && (
                          <div className={styles.controlGroup}>
                            <label className={styles.labelText}>
                              Second Y-Axis Label
                            </label>
                            <input
                              type="text"
                              value={secondYAxisLabel}
                              onChange={(e) =>
                                setSecondYAxisLabel(e.target.value)
                              }
                              className={styles.graphInput}
                              placeholder="Enter Second Y-axis label"
                            />
                          </div>
                        )}
  
  <div className={styles.reverseYAxisContainer}>
  <label className={styles.labelText}>Reverse Y-Axis</label>
  <input
    type="checkbox"
    checked={reverseYAxis}
    onChange={(e) => setReverseYAxis(e.target.checked)}
    className={styles.reverseYAxisCheckbox}
  />
</div>



                      </div>
  
                      {/* Right Column: X-Axis and Plot Settings */}
                      <div className={styles.controlsColumnRight}>
                        <div className={styles.controlGroup}>
                          <label className={styles.labelText}>
                            Graph Title
                          </label>
                          <input
                            type="text"
                            value={graphTitle}
                            onChange={(e) => setGraphTitle(e.target.value)}
                            className={styles.graphInput}
                            placeholder="Enter Graph Title"
                          />
                        </div>
  
                        <div className={styles.controlGroup}>
                          <label className={styles.labelText}>
                            X-Axis Label
                          </label>
                          <input
                            type="text"
                            value={xAxisLabel}
                            onChange={(e) => setXAxisLabel(e.target.value)}
                            className={styles.graphInput}
                            placeholder="Enter X-axis label"
                          />
                        </div>
  
                        <div className={styles.controlGroup}>
                          <label className={styles.labelText}>Plot Type</label>
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
  
                        <div className={styles.controlGroup}>
                          <label className={styles.labelText}>Orientation </label>
                          <select
                            value={orientation}
                            onChange={(e) => setOrientation(e.target.value)}
                            className={styles.graphInput}
                          >
                            <option value="h">Horizontal</option>
                            <option value="v">Vertical</option>
                          </select>
                        </div>
                      </div>
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
  
        {/* Modals */}
        {modalOpen && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>{/* Modal Content */}</div>
          </div>
        )}
  
        {showWarning && (
          <div className={styles.warningModal}>
            <div className={styles.warningModalContent}>{/* Warning Modal */}</div>
          </div>
        )}
      </div>
    </>
  );
  
  
} 

export default Dashboard;