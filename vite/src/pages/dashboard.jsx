import React, { useState, useRef, useEffect } from 'react';
import Papa from 'papaparse';
import DashboardNav from '../components/dashboardNav';
import styles from '../cssPages/dashboardPage.module.css';
import Plot from 'react-plotly.js';
import Plotly from 'plotly.js-dist';

// Component for assigning taxa to life forms
function TaxaLifeFormAssignment({
  taxaData,
  lifeFormGroups,
  taxaLifeFormAssignments,
  setTaxaLifeFormAssignments,
}) {
  const handleLifeFormChange = (taxaId, lifeFormId) => {
    setTaxaLifeFormAssignments((prevAssignments) => ({
      ...prevAssignments,
      [taxaId]: lifeFormId,
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
          {taxaData.map((taxa) => (
            <tr key={taxa.taxa_id}>
              <td>{taxa.taxa_name}</td>
              <td>
                <select
                  value={taxaLifeFormAssignments[taxa.taxa_id] || taxa.life_id}
                  onChange={(e) => handleLifeFormChange(taxa.taxa_id, e.target.value)}
                  className={styles.lifeFormDropdown}
                >
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

// Component for assigning colors and names to life forms, and rearranging them
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
        lifeForm.life_id === lifeFormId ? { ...lifeForm, life_name: newName } : lifeForm
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
      [newGroups[index], newGroups[targetIndex]] = [newGroups[targetIndex], newGroups[index]];
      return newGroups;
    });
  };

  return (
    <div className={styles.lifeFormColorAssignment}>
      <h3>Edit Life Forms</h3>
      {lifeFormGroups.map((lifeForm, index) => {
        const color = lifeForm.color || '#808080'; // Default color gray

        return (
          <div key={lifeForm.life_id} className={styles.lifeFormAssignmentRow}>
            <input
              type="text"
              value={lifeForm.life_name}
              onChange={(e) => handleNameChange(lifeForm.life_id, e.target.value)}
              className={styles.lifeFormInput}
            />
            <input
              type="color"
              value={color}
              onChange={(e) => handleColorChange(lifeForm.life_id, e.target.value)}
              className={styles.colorPicker}
            />
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
  const [ageModelData, setAgeModelData] = useState([]);
  const [taxaData, setTaxaData] = useState([]);
  const [lifeFormGroups, setLifeFormGroups] = useState([]);
  const [taxaLifeFormAssignments, setTaxaLifeFormAssignments] = useState({});
  const [graphTitle, setGraphTitle] = useState('Pollen Percentage Diagram');
  const [yAxisLabel, setYAxisLabel] = useState('Cal yr BP');
  const [plotType, setPlotType] = useState('area');
  const [orientation, setOrientation] = useState('h');

  // Download functionality state variables
  const [modalOpen, setModalOpen] = useState(false);
  const [resolution, setResolution] = useState('1080p');
  const [imageFormat, setImageFormat] = useState('png');
  const graphRef = useRef();
  const [isDownloading, setIsDownloading] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  // List of taxa to include using merge_under codes (all in lowercase)
  const taxaToInclude = [
    'pp', // Pinus
    'cu', // Cupressaceae
    'fx', // Fraxinus
    'ab', // Abies
    'q',  // Quercus
    'ro', // Rosaceae
    'sx', // Salix
    'hs', // Asteraceae
    'po', // Poaceae
    'py', // Polygonaceae
    'in', // Indeterminate
    'uk', // Unknown
  ];

  // Mapping from merge_under codes to full taxa names
  const mergeUnderNameMapping = {
    'pp': 'Pinus',
    'cu': 'Cupressaceae',
    'fx': 'Fraxinus',
    'ab': 'Abies',
    'q': 'Quercus',
    'ro': 'Rosaceae',
    'sx': 'Salix',
    'hs': 'Asteraceae',
    'po': 'Poaceae',
    'py': 'Polygonaceae',
    'in': 'Indeterminate',
    'uk': 'Unknown',
  };

  // State variable to control the visibility of the LifeFormColorAssignment component
  const [showLifeFormAssignment, setShowLifeFormAssignment] = useState(false);
  const [showTaxaAssignment, setShowTaxaAssignment] = useState(false);

  // Interpolation function using the age model data
  const interpolateAge = (coreDepth) => {
    if (ageModelData.length === 0) {
      console.warn('Age model data is empty.');
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

    console.warn(
      `No matching depth range found for core depth ${coreDepth}.`
    );
    return null;
  };

  // Function to handle the age model CSV upload
  const handleAgeModelUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        let data = results.data.map((row) => ({
          depth: parseFloat(row['depth']), // Use depth as is
          age: parseFloat(row['median']), // Using 'median' age
        }));

        // Remove NaN values
        data = data.filter((row) => !isNaN(row.depth) && !isNaN(row.age));

        // Sort the data by depth
        data.sort((a, b) => a.depth - b.depth);

        setAgeModelData(data);
      },
    });
  };

  // Function to handle the life form groups CSV upload
  const handleLifeFormGroupsUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        const data = results.data.map((row) => ({
          life_id: row['life_id'].toLowerCase().trim(),
          life_name: row['life_name'],
          color: row['color'] ? row['color'].trim() : '#808080',
        }));
        setLifeFormGroups(data);
      },
    });
  };

  // Function to handle the taxa typing CSV upload
  const handleTaxaTypingUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        const data = results.data.map((row) => ({
          taxa_id: row['taxa_id'],
          taxa_name: row['taxa_name'],
          merge_under: row['merge_under'],
          life_id: row['life_id'],
          fontstyle: row['fontstyle'],
          order: row['order'],
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

  // Function to handle the main data CSV upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file || taxaData.length === 0) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        const data = results.data;
        setRawData(data);
      },
    });
  };

  // useEffect to regenerate csvDataSets whenever rawData, taxaLifeFormAssignments, or taxaData change
  useEffect(() => {
    if (rawData.length === 0 || taxaData.length === 0) return;

    // Build a mapping from merge_under to taxa IDs and other attributes
    const taxaMapping = {};
    taxaData.forEach((taxa) => {
      const mergeUnder = (taxa.merge_under || taxa.taxa_name || taxa.taxa_id)
        .toLowerCase()
        .trim();
      const taxaName = mergeUnderNameMapping[mergeUnder] || taxa.taxa_name;

      const assignedLifeId = taxaLifeFormAssignments[taxa.taxa_id] || taxa.life_id;

      if (!taxaMapping[mergeUnder]) {
        taxaMapping[mergeUnder] = {
          taxa_name: taxaName,
          merge_under: mergeUnder,
          taxa_ids: [],
          taxa_names: [],
          life_id: assignedLifeId.toLowerCase().trim(),
          order: taxa.order ? parseInt(taxa.order) : 9999,
          fontstyle: taxa.fontstyle || 'plain',
        };
      }
      taxaMapping[mergeUnder].taxa_ids.push(taxa.taxa_id);
      taxaMapping[mergeUnder].taxa_names.push(taxa.taxa_name);
    });

    // Convert taxaMapping to array and sort based on 'order'
    const taxaGroups = Object.keys(taxaMapping).map((key) => taxaMapping[key]);
    taxaGroups.sort((a, b) => a.order - b.order);

    // Filter taxaGroups to include only specified taxa using merge_under
    const filteredTaxaGroups = taxaGroups.filter((group) =>
      taxaToInclude.includes(group.merge_under.toLowerCase())
    );

    // For each data row
    const dataRows = rawData.map((row) => {
      const depth = parseFloat(row['core_depth']); // Use core_depth as is

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
  }, [rawData, taxaLifeFormAssignments, taxaData]);

  // Prepare plot data and layout
  const preparePlotData = () => {
    if (csvDataSets.length === 0) return { plotData: [], layout: {} };

    const plotData = [];
    const annotations = [];

    // Use filtered taxa groups
    const lifeformOrder = lifeFormGroups.map((group) => group.life_id); // Use user-defined order

    // Minimum percentage threshold
    const minPercentage = 1; // Set to 1%

    const sortedDataSets = csvDataSets
      .filter((dataset) => taxaToInclude.includes(dataset.mergeUnder.toLowerCase()))
      .sort((a, b) => {
        const lifeOrderA = lifeformOrder.indexOf(a.lifeId);
        const lifeOrderB = lifeformOrder.indexOf(b.lifeId);

        if (lifeOrderA !== lifeOrderB) {
          return lifeOrderA - lifeOrderB;
        }
        // Then by order
        if (a.order !== b.order) {
          return a.order - b.order;
        }
        // Then by speciesName
        return a.speciesName.localeCompare(b.speciesName);
      });

    // Filter out datasets where the maximum percentage is below minPercentage
    const filteredDataSets = sortedDataSets.filter((dataset) => {
      const maxPercentage = Math.max(...dataset.x);
      return maxPercentage >= minPercentage;
    });

    // Collect all ages and depths to determine min and max
    const allAges = filteredDataSets.flatMap((dataset) => dataset.y);
    const minAge = Math.min(...allAges);
    const maxAge = Math.max(...allAges);

    const numTaxa = filteredDataSets.length;

    // Create mapping from life_id to color and name
    const lifeFormColorMap = {};
    const lifeFormNameMap = {};
    lifeFormGroups.forEach((group) => {
      lifeFormColorMap[group.life_id.toLowerCase().trim()] = group.color.trim();
      lifeFormNameMap[group.life_id.toLowerCase().trim()] = group.life_name;
    });

    const threshold = 5; // Threshold below which exaggeration is applied
    const desiredMaxValue = 20; // Value to scale up to

    // Adjust layout margins for overall x-axis label
    const layout = {
      title: graphTitle,
      showlegend: false,
      annotations: [],
      margin: { t: 180, b: 100, l: 80, r: 70 }, // Increased top margin to 180
    };

    const subplotSpacing = 0.02; // 2% spacing between subplots
    const xLeftMargin = 0.1; // 10% left margin
    const xRightMargin = 0.02; // 2% right margin
    const totalSpacing = subplotSpacing * (numTaxa - 1) + xLeftMargin + xRightMargin;
    const subplotWidth = (1 - totalSpacing) / numTaxa;

    // Group datasets by life form
    const lifeformGroupsData = {};

    filteredDataSets.forEach((dataset, index) => {
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

      // Sort data points by age to prevent looping in area graphs
      const dataPoints = dataset.x.map((value, idx) => ({
        x: value,
        y: dataset.y[idx],
      }));
      dataPoints.sort((a, b) => a.y - b.y); // Sort by age

      dataset.x = dataPoints.map((dp) => dp.x);
      dataset.y = dataPoints.map((dp) => dp.y);

      // Determine the correct plot type and fill property
      let traceType = plotType;
      let fill = 'none';
      if (plotType === 'area') {
        traceType = 'scatter';
        fill = orientation === 'h' ? 'tozerox' : 'tozeroy';
      }

      const lifeId = dataset.lifeId.toLowerCase().trim();
      const color = lifeFormColorMap[lifeId] || 'gray';

      plotData.push({
        x: dataset.x,
        y: dataset.y,
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
          shape: 'spline',
        },
        showlegend: false,
      });

      // Add taxa name annotations with adjusted positions
      annotations.push({
        text: dataset.speciesName,
        xref: `x${subplotIndex}`,
        yref: 'paper',
        x: (xAxisRange[1] + xAxisRange[0]) / 2,
        y: 1.06,
        xanchor: 'center',
        showarrow: false,
        font: {
          size: 12,
          style: dataset.fontstyle === 'italic' ? 'italic' : 'normal',
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
        anchor: 'y',
        title: '',
        range: xAxisRange,
        tickmode: 'linear',
        dtick: 10,
        ticks: 'outside',
        ticklen: 5,
        showline: true,
        linewidth: 1,
        linecolor: 'black',
        showgrid: false,
        showticklabels: true,
        tickangle: 0, // Ensure labels are horizontal
        automargin: true,
      };
    });

    // Adjust life form group annotations (category names)
    Object.keys(lifeformGroupsData).forEach((lifeId) => {
      const groupData = lifeformGroupsData[lifeId];
      const firstIndex = groupData[0].index;
      const lastIndex = groupData[groupData.length - 1].index;

      // Calculate xStart and xEnd for the group
      const xStart = xLeftMargin + firstIndex * (subplotWidth + subplotSpacing);
      let xEnd = xLeftMargin + (lastIndex + 1) * (subplotWidth + subplotSpacing) - subplotSpacing;
      if (xEnd > 1) xEnd = 1;

      // Calculate center position in paper coordinates
      const xCenterPaper = (xStart + xEnd) / 2;

      // Add life form group name annotation
      annotations.push({
        text: lifeFormNameMap[lifeId] || lifeId,
        xref: 'paper',
        yref: 'paper',
        x: xCenterPaper,
        y: 1.12, // Adjust as needed
        showarrow: false,
        font: {
          size: 14,
          color: lifeFormColorMap[lifeId] || 'gray',
        },
      });
    });

    // Configure shared yaxis
    layout['yaxis'] = {
      title: yAxisLabel,
      autorange: 'reversed',
      range: [maxAge, minAge],
      tickmode: 'linear',
      dtick: 500, // Adjust intervals as needed
      ticks: 'outside',
      ticklen: 5,
      showline: true,
      linewidth: 1,
      linecolor: 'black',
      tickfont: {
        size: 10,
      },
    };

    // Add overall x-axis label
    annotations.push({
      text: 'Percentages',
      xref: 'paper',
      yref: 'paper',
      x: 0.5,
      y: -0.1,
      showarrow: false,
      font: {
        size: 14,
      },
    });

    layout.annotations = annotations;
    layout.width = 150 * numTaxa + (50 * (numTaxa - 1)); // Adjust width as needed
    layout.height = 600; // Fixed height

    return { plotData, layout };
  };

  // Generate plot data and layout
  const { plotData, layout } = preparePlotData();

  // Download graph function
  const downloadGraph = () => {
    if (isDownloading) {
      console.warn('Download already in progress. Please wait.');
      return;
    }

    // Map resolution to width and height
    const resolutionMap = {
      '1080p': { width: 1920, height: 1080 },
      '2k': { width: 2560, height: 1440 },
      '4k': { width: 3840, height: 2160 },
    };

    const { width, height } = resolutionMap[resolution];

    if (!graphRef.current || !graphRef.current.el || !plotData || plotData.length === 0) {
      console.error('No data to download.');
      setShowWarning(true);
      return;
    }

    setIsDownloading(true);

    Plotly.downloadImage(graphRef.current.el, {
      format: imageFormat,
      width: width,
      height: height,
      filename: graphTitle.replace(/ /g, '_'),
    })
      .then(() => {
        console.log('Download successful');
        setIsDownloading(false);
      })
      .catch((error) => {
        console.error('Download failed:', error);
        setIsDownloading(false);
      });

    setModalOpen(false);
  };

  // Handle download button click
  const handleDownloadButtonClick = () => {
    if (!plotData || plotData.length === 0) {
      console.error('No data available to download.');
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
          <div className={styles.contentWrapper}>
            <div className={styles.dashboardNavLeft}>
              <div className={styles.dashboardContent}>
                <div className={styles.plotBox}>
                  {/* Plotly Graph */}
                  <Plot
                    ref={graphRef}
                    data={plotData}
                    layout={layout}
                  />

                  <div className={styles.uploadButtonWrapper}>
                    <div className={styles.horizontalButtons}>
                      {/* Age Model CSV Upload */}
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

                      {/* Life Form Groups CSV Upload */}
                      <input
                        type="file"
                        accept=".csv"
                        onChange={handleLifeFormGroupsUpload}
                        id="lifeFormGroupsInput"
                        className={styles.fileInput}
                      />
                      <label
                        htmlFor="lifeFormGroupsInput"
                        className={styles.customFileButton}
                      >
                        Upload Life Form Groups CSV File
                      </label>

                      {/* Taxa Typing CSV Upload */}
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

                      {/* Main Data CSV Upload */}
                      <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileUpload}
                        id="fileInput"
                        className={styles.fileInput}
                        disabled={
                          ageModelData.length === 0 ||
                          taxaData.length === 0 ||
                          lifeFormGroups.length === 0
                        }
                      />
                      <label
                        htmlFor="fileInput"
                        className={`${styles.customFileButton} ${
                          ageModelData.length === 0 ||
                          taxaData.length === 0 ||
                          lifeFormGroups.length === 0
                            ? styles.disabledButton
                            : ''
                        }`}
                      >
                        Upload Data CSV File
                      </label>
                    </div>

                    {/* Buttons to Show/Hide Assignments */}
                    <div className={styles.assignmentButtons}>
                      {taxaData.length > 0 && lifeFormGroups.length > 0 && (
                        <button
                          onClick={() => setShowTaxaAssignment(!showTaxaAssignment)}
                          className={styles.customFileButton}
                        >
                          {showTaxaAssignment ? 'Hide Taxa Assignments' : 'Assign Taxa to Life Forms'}
                        </button>
                      )}
                      {lifeFormGroups.length > 0 && (
                        <button
                          onClick={() => setShowLifeFormAssignment(!showLifeFormAssignment)}
                          className={styles.customFileButton}
                        >
                          {showLifeFormAssignment ? 'Hide Life Forms' : 'Edit Life Forms'}
                        </button>
                      )}
                    </div>

                    {/* Taxa Life Form Assignment Component */}
                    {showTaxaAssignment && taxaData.length > 0 && lifeFormGroups.length > 0 && (
                      <TaxaLifeFormAssignment
                        taxaData={taxaData}
                        lifeFormGroups={lifeFormGroups}
                        taxaLifeFormAssignments={taxaLifeFormAssignments} // Added this line
                        setTaxaLifeFormAssignments={setTaxaLifeFormAssignments}
                      />
                    )}

                    {/* Life Form Color and Name Assignment Component */}
                    {showLifeFormAssignment && lifeFormGroups.length > 0 && (
                      <LifeFormColorAssignment
                        lifeFormGroups={lifeFormGroups}
                        setLifeFormGroups={setLifeFormGroups}
                      />
                    )}

                    {/* Controls */}
                    <div className={styles.verticalControls}>
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

                      {/* Download Button */}
                      <div className={styles.downloadButtonWrapper}>
                        <button onClick={handleDownloadButtonClick} className={styles.downloadButton}>
                          Download Graph
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Alert Message */}
                  {(ageModelData.length === 0 ||
                    taxaData.length === 0 ||
                    lifeFormGroups.length === 0) && (
                    <div className={styles.alertMessage}>
                      Please upload the Age Model CSV, Life Form Groups CSV, and
                      Taxa Typing CSV files before uploading the Data CSV file.
                    </div>
                  )}
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
              <button onClick={downloadGraph} className={styles.modalDownloadButton}>
                Confirm Download
              </button>
              <button onClick={() => setModalOpen(false)} className={styles.modalCloseButton}>
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
              <p>Please upload the required CSV files and generate a graph before downloading.</p>
              <button onClick={handleCloseWarning} className={styles.warningCloseButton}>Close</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Dashboard;