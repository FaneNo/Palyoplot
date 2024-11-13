import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../cssPages/historyTable.css";
import { ACCESS_TOKEN } from "../token";

const DataTable = () => {
  const [data, setData] = useState([]);
  const [images, setImages] = useState([])
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
    fetchImageData();
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

  const fetchImageData = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    try {
      const response = await fetch("http://127.0.0.1:8000/api/get-uploaded-images/", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        console.error("Unauthorized: Invalid token");
        return;
      }

      const data = await response.json();
      setImages(data);
    } catch(error) {
      console.error("Error fetching images:", error);
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
      {/* Table for CSV Data */}
      <h2>Uploaded CSV Files</h2>
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
              <td>
                <button className="graph-btn" onClick={() => handleGraphClick(row.id)}>
                  Graph Now
                </button>
              </td>
              <td>
                <button className="delete-btn" onClick={() => handleDelete(row.id)}>
                  ❌
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Section for Uploaded Images */}
      <h2>Uploaded Graph Images</h2>
      <table className="history-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Image</th>
            <th>Download</th>
          </tr>
        </thead>
        <tbody>
          {images.length > 0 ? (
            images.map((img) => (
              <tr key={img.id}>
                <td>{img.id}</td>
                <td>
                  <img
                    src={`http://127.0.0.1:8000${img.image_data}`}
                    alt="Graph"
                    className="uploaded-image"
                  />
                </td>
                <td>
                  <a
                    href={`http://127.0.0.1:8000${img.image_data}`}
                    download
                  >
                    Download
                  </a>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No images uploaded yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;



