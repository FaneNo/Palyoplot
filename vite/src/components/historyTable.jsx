import api from "../api";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../cssPages/historyTable.css";

function DataTable() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get("/api/user-csv-files/");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const handleDownload = (id) => {
    console.log(`Download data for id: ${id}`);
    navigate("/dashboard");
  };
  
  //get the data to graph
  const handleGraphClick = async (id) => {
    try {
      const response = await api.get(`/api/graph-data/${id}/`);
      
      // Parse the CSV string into structured data
      const rows = response.data.data.split('\n');
      const headers = rows[0].replace(/"/g, '').split(',').filter(Boolean);
      
      const parsedData = [];
      for (let i = 1; i < rows.length; i++) {
        const values = rows[i].split(',');
        const row = {};
        headers.forEach((header, index) => {
          row[header] = values[index];
        });
        parsedData.push(row);
      }
  
      // Navigate to dashboard with the data
      navigate("/dashboard", { 
        state: { 
          autoGraphData: {
            data: parsedData,
            headers: headers,
            fileName: response.data.file_name,
            displayId: response.data.display_id
          }
        } 
      });
    } catch (error) {
      console.error("Error fetching graph data", error);
    }
  };

  //delete file function
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this file?"
    );
    if (confirmed) {
      try {
        await api.delete(`/api/csv_files/${id}/`);

        // Fetch the updated data from the server
        await fetchData();

        console.log(`Deleted entry with id: ${id}`);
      } catch (error) {
        console.error("Error deleting file", error);
      }
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
            <td className="id-column">{row.display_id}</td>
            <td className="date-column">
              {new Date(row.upload_date).toLocaleString()}
            </td>
            <td className="csv-column">
              <span className="csv-link">{row.file_name}</span>
            </td>
            <td className="graph-column">
              <button
                className="graph-btn"
                onClick={() => handleGraphClick(row.id)}
              >
                Graph Now
              </button>
            </td>
            <td className="delete-column">
              <button
                className="delete-btn"
                onClick={() => handleDelete(row.id)}
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
