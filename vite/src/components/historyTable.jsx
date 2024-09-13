import React, { useState } from "react";
import "../cssPages/historyTable.css";

function DataTable() {
  const [data, setData] = useState([
    { id: 1, date: "2024-04-27", modified: "2024-04-27", csv: "file1.csv" },
    { id: 2, date: "2024-04-27", modified: "2024-04-27", csv: "file2.csv" },
    { id: 3, date: "2024-04-27", modified: "2024-04-27", csv: "file3.csv" },
    { id: 4, date: "2024-04-27", modified: "2024-04-27", csv: "file4.csv" },
    { id: 5, date: "2024-04-27", modified: "2024-04-27", csv: "file5.csv" },
    { id: 6, date: "2024-04-27", modified: "2024-04-27", csv: "file6.csv" },
    { id: 7, date: "2024-04-27", modified: "2024-04-27", csv: "file7.csv" },
    { id: 8, date: "2024-04-27", modified: "2024-04-27", csv: "file8.csv" },
    { id: 9, date: "2024-04-27", modified: "2024-04-27", csv: "file9.csv" },
    { id: 10, date: "2024-04-27", modified: "2024-04-27", csv: "file10.csv" },
    { id: 11, date: "2024-04-27", modified: "2024-04-27", csv: "file11.csv" },
    { id: 12, date: "2024-04-27", modified: "2024-04-27", csv: "file12.csv" },
    { id: 13, date: "2024-04-27", modified: "2024-04-27", csv: "file13.csv" },
    { id: 14, date: "2024-04-27", modified: "2024-04-27", csv: "file14.csv" },
    { id: 15, date: "2024-04-27", modified: "2024-04-27", csv: "file15.csv" },
    { id: 16, date: "2024-04-27", modified: "2024-04-27", csv: "file16.csv" },
    { id: 17, date: "2024-04-27", modified: "2024-04-27", csv: "file17.csv" },
    { id: 18, date: "2024-04-27", modified: "2024-04-27", csv: "file18.csv" },
    { id: 19, date: "2024-04-27", modified: "2024-04-27", csv: "file19.csv" },
    { id: 20, date: "2024-04-27", modified: "2024-04-27", csv: "file20.csv" },
    { id: 21, date: "2024-04-27", modified: "2024-04-27", csv: "file21.csv" },
    { id: 22, date: "2024-04-27", modified: "2024-04-27", csv: "file22.csv" },
    { id: 23, date: "2024-04-27", modified: "2024-04-27", csv: "file23.csv" },
    { id: 24, date: "2024-04-27", modified: "2024-04-27", csv: "file24.csv" },
    { id: 25, date: "2024-04-27", modified: "2024-04-27", csv: "file25.csv" },
    { id: 26, date: "2024-04-27", modified: "2024-04-27", csv: "file26.csv" },
    { id: 27, date: "2024-04-27", modified: "2024-04-27", csv: "file27.csv" },
    { id: 28, date: "2024-04-27", modified: "2024-04-27", csv: "file28.csv" },
    { id: 29, date: "2024-04-27", modified: "2024-04-27", csv: "file29.csv" },
    { id: 30, date: "2024-04-27", modified: "2024-04-27", csv: "file30.csv" },
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
          <th>CSV</th>
          <th>Download</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.id}>
            <td>{row.id}</td>
            <td>{row.date}</td>
            <td>{row.modified}</td>
            <td>
              <span className="csv-link">{row.csv}</span></td>
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
