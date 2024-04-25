import React, { useState } from "react";
import "../cssPages/test.css";

function DataTable() {
  // Assuming this is your data
  const [data, setData] = useState([
    { id: 1, date: "John", modified: 28 },
    { id: 2, date: "Jane", modified: 26 },
    { id: 3, date: "Doe", modified: 27 },
    { id: 1, date: "John", modified: 28 },
    { id: 2, date: "Jane", modified: 26 },
    { id: 3, date: "Doe", modified: 27 },
    { id: 1, date: "John", modified: 28 },
    { id: 2, date: "Jane", modified: 26 },
    { id: 3, date: "Doe", modified: 27 },
    { id: 1, date: "John", modified: 28 },
    { id: 2, date: "Jane", modified: 26 },
    { id: 3, date: "Doe", modified: 27 },
    { id: 1, date: "John", modified: 28 },
    { id: 2, date: "Jane", modified: 26 },
    { id: 3, date: "Doe", modified: 27 },
    { id: 1, date: "John", modified: 28 },
    { id: 2, date: "Jane", modified: 26 },
    { id: 3, date: "Doe", modified: 27 },
    { id: 1, date: "John", modified: 28 },
    { id: 2, date: "Jane", modified: 26 },
    { id: 3, date: "Doe", modified: 27 },
    { id: 1, date: "John", modified: 28 },
    { id: 2, date: "Jane", modified: 26 },
    { id: 3, date: "Doe", modified: 27 },
    { id: 1, date: "John", modified: 28 },
    { id: 2, date: "Jane", modified: 26 },
    { id: 3, date: "Doe", modified: 27 },
    { id: 1, date: "John", modified: 28 },
    { id: 2, date: "Jane", modified: 26 },
    { id: 3, date: "Doe", modified: 27 },
    { id: 1, date: "John", modified: 28 },
    { id: 2, date: "Jane", modified: 26 },
    { id: 3, date: "Doe", modified: 27 },
  ]);

  // Function to handle download
  const handleDownload = (id) => {
    console.log(`Download data for id: ${id}`);
  };
  // Function to handle download
  const handleGraph = (id) => {
    console.log(`Download data for id: ${id}`);
  };

  return (
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Date Created</th>
            <th>Last Modified</th>
            <th>Download</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>{row.date}</td>
              <td>{row.modified}</td>
              <td className="download-column">
                <button
                  className="download-btn"
                  onClick={() => handleDownload(row.id)}
                >
                  Download
                </button>
                <button
                  className="download-btn"
                  onClick={() => handleGraph(row.id)}
                >
                  Graph
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    
  );
}

export default DataTable;
