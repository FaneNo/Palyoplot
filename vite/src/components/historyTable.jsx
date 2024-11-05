import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../cssPages/historyTable.css";

const DataTable = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/api/user-csv-files/");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data", error);
      setError("Failed to load data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGraphClick = async (id) => {
    try {
      const response = await api.get(`/api/graph-data/${id}/`);
      
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
      setError("Failed to load graph data");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/csv_files/${id}/`);
      await fetchData(); 
    } catch (error) {
      console.error("Error deleting file", error);
      setError("Failed to delete file");
    }
  };

  if (isLoading) {
    return (
      <div className="loading-state">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        {error}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="empty-state">
        No files found. Upload a CSV file to get started.
      </div>
    );
  }

  return (
    <div className="history-table-container">
      <table className="history-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Date Created</th>
            <th>File</th>
            <th>Graph</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              <td>{row.display_id}</td>
              <td>{new Date(row.upload_date).toLocaleString()}</td>
              <td>
                <span 
                  className="file-link"
                  onClick={() => handleGraphClick(row.id)}
                >
                  {row.file_name}
                </span>
              </td>
              <td className="graph-column">
                {/* Graph column left intentionally empty */}
              </td>
              <td>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(row.id)}
                >
                  ❌
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;



