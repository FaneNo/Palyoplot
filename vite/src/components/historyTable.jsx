import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "../cssPages/historyTable.css";

function DataTable() {
  const [data, setData] = useState([
    { id: 1, date: "2024-04-27", csv: "file1.csv" },
    { id: 2, date: "2024-04-27", csv: "file2.csv" },
    { id: 3, date: "2024-04-27", csv: "file3.csv" },
    { id: 4, date: "2024-04-27", csv: "file4.csv" },
    { id: 5, date: "2024-04-27", csv: "file5.csv" },
    { id: 6, date: "2024-04-27", csv: "file6.csv" },
    { id: 7, date: "2024-04-27", csv: "file7.csv" },
    { id: 8, date: "2024-04-27", csv: "file8.csv" },
    { id: 9, date: "2024-04-27", csv: "file9.csv" },
    { id: 10, date: "2024-04-27", csv: "file10.csv" },
    { id: 11, date: "2024-04-27", csv: "file11.csv" },
    { id: 12, date: "2024-04-27", csv: "file12.csv" },
    { id: 13, date: "2024-04-27", csv: "file13.csv" },
    { id: 14, date: "2024-04-27", csv: "file14.csv" },
    { id: 15, date: "2024-04-27", csv: "file15.csv" },
    { id: 16, date: "2024-04-27", csv: "file16.csv" },
    { id: 17, date: "2024-04-27", csv: "file17.csv" },
    { id: 18, date: "2024-04-27", csv: "file18.csv" },
    { id: 19, date: "2024-04-27", csv: "file19.csv" },
    { id: 20, date: "2024-04-27", csv: "file20.csv" },
    { id: 21, date: "2024-04-27", csv: "file21.csv" },
    { id: 22, date: "2024-04-27", csv: "file22.csv" },
    { id: 23, date: "2024-04-27", csv: "file23.csv" },
    { id: 24, date: "2024-04-27", csv: "file24.csv" },
    { id: 25, date: "2024-04-27", csv: "file25.csv" },
    { id: 26, date: "2024-04-27", csv: "file26.csv" },
    { id: 27, date: "2024-04-27", csv: "file27.csv" },
    { id: 28, date: "2024-04-27", csv: "file28.csv" },
    { id: 29, date: "2024-04-27", csv: "file29.csv" },
    { id: 30, date: "2024-04-27", csv: "file30.csv" },
  ]);

  const navigate = useNavigate(); // Initialize navigate

  // Function to handle navigation
  const handleDownload = (id) => {
    console.log(`Download data for id: ${id}`);
    navigate('/dashboard'); // Navigate to the Dashboard page
  };

  return (
    <table className="table">
      <thead>
        <tr>
          <th className="id-column">ID</th>
          <th className="date-column">Date Created</th>
          <th className="csv-column">File</th>
          <th className="graph-column"></th>
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.id}>
            <td className="id-column">{row.id}</td>
            <td className="date-column">{row.date}</td>
            <td className="csv-column">
              <span className="csv-link">{row.csv}</span>
            </td>
            <td className="graph-column">
              <button
                className="graph-btn"
                onClick={() => handleDownload(row.id)}
              >
                Graph Now
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default DataTable;
