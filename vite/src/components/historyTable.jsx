import api from "../api";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../cssPages/historyTable.css";
import { ACCESS_TOKEN } from "../token";

function DataTable() {
  const [data, setData] = useState([]);
  const [images, setImages] = useState([])
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
    fetchImageData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get("/api/user-csv-files/");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data", error);
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
    <div>
      <h2>Uploaded Files</h2>
      {/* Table for CSV Data */}
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
                <button className="graph-btn" onClick={() => handleGraphClick(row.id)}>
                  Graph Now
                </button>
              </td>
              <td className="delete-column">
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
      <div className="image-gallery">
        {images.length > 0 ? (
          images.map((img) => (
            <div key={img.id} className="image-container">
              <img
                src={`http://127.0.0.1:8000${img.image_data}`}
                alt="Graph"
                className="uploaded-image"
                
              />
              <a href={`http://127.0.0.1:8000${img.image_data}`} download
              style={{ display: "block", margin: "10px" }}>
                Download
              </a>
            </div>
          ))
        ) : (
          <p>No images uploaded yet.</p>
        )}
      </div>
    </div>
  );
}

export default DataTable;
