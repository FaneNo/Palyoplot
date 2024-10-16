import api from "../api";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "../cssPages/historyTable.css";

function DataTable() {
  const [data, setData] = useState([]);
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/api/user-csv-files/");
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);


  // Function to handle navigation
  const handleDownload = (id) => {
    console.log(`Download data for id: ${id}`);
    navigate('/dashboard'); // Navigate to the Dashboard page
  };

  // Function to handle deleting a specific entry
  const handleDelete = (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this file?");
    if (confirmed) {
      const updatedData = data.filter((item) => item.id !== id);
      setData(updatedData);
      console.log(`Deleted entry with id: ${id}`);
    } else {
      console.log("File deletion canceled.");
    }
  };

  return (
    <table className="table">
      <thead>
        <tr>
          <th className="id-column">ID</th>
          <th className="date-column">Date Created</th>
          <th className="csv-column">File</th>
          <th className="graph-column">Graph</th>
          <th className="delete-column">Delete</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.id}>
            <td className="id-column">{row.id}</td>
            <td className="date-column">{new Date(row.upload_date).toLocaleString()}</td>
            <td className="csv-column">
              <span className="csv-link">{row.file_name}</span>
            </td>
            <td className="graph-column">
              <button
                className="graph-btn"
                onClick={() => handleDownload(row.id)}
              >
                Graph Now
              </button>
            </td>
            <td className="delete-column">
              <button
                className="delete-btn" onClick={() => handleDelete(row.id)}
              >
                ❌
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default DataTable;
