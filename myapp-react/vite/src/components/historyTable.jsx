import React, { useState } from "react";
import "../cssPages/historyTable.css";

function DataTable() {
  // Assuming this is your data
  const [data, setData] = useState([
    { id: 1, date: "2024-04-27", modified: "2024-04-27" },
    { id: 2, date: "2024-04-27", modified: "2024-04-27" },
    { id: 3, date: "2024-04-27", modified: "2024-04-27" },
    { id: 4, date: "2024-04-27", modified: "2024-04-27" },
    { id: 5, date: "2024-04-27", modified: "2024-04-27" },
    { id: 6, date: "2024-04-27", modified: "2024-04-27" },
    { id: 7, date: "2024-04-27", modified: "2024-04-27" },
    { id: 8, date: "2024-04-27", modified: "2024-04-27" },
    { id: 9, date: "2024-04-27", modified: "2024-04-27" },
    { id: 10, date: "2024-04-27", modified: "2024-04-27" },
    { id: 11, date: "2024-04-27", modified: "2024-04-27" },
    { id: 12, date: "2024-04-27", modified: "2024-04-27" },
    { id: 13, date: "2024-04-27", modified: "2024-04-27" },
    { id: 14, date: "2024-04-27", modified: "2024-04-27" },
    { id: 15, date: "2024-04-27", modified: "2024-04-27" },
    { id: 16, date: "2024-04-27", modified: "2024-04-27" },
    { id: 17, date: "2024-04-27", modified: "2024-04-27" },
    { id: 18, date: "2024-04-27", modified: "2024-04-27" },
    { id: 19, date: "2024-04-27", modified: "2024-04-27" },
    { id: 20, date: "2024-04-27", modified: "2024-04-27" },
    { id: 21, date: "2024-04-27", modified: "2024-04-27" },
    { id: 22, date: "2024-04-27", modified: "2024-04-27" },
    { id: 23, date: "2024-04-27", modified: "2024-04-27" },
    { id: 24, date: "2024-04-27", modified: "2024-04-27" },
    { id: 25, date: "2024-04-27", modified: "2024-04-27" },
    { id: 26, date: "2024-04-27", modified: "2024-04-27" },
    { id: 27, date: "2024-04-27", modified: "2024-04-27" },
    { id: 28, date: "2024-04-27", modified: "2024-04-27" },
    { id: 29, date: "2024-04-27", modified: "2024-04-27" },
    { id: 30, date: "2024-04-27", modified: "2024-04-27" },
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
                onClick={() => handleGraph(row.id)}
              >
                Graph
              </button>
              <button
                className="download-btn"
                onClick={() => handleDownload(row.id)}
              >
                Download
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default DataTable;
