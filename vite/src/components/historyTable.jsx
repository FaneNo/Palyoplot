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


const handleDownloadCSV = async (id) => {
  const token = localStorage.getItem(ACCESS_TOKEN);

  try {
      const response = await fetch(`http://127.0.0.1:8000/api/csv_files/${id}/download/`, {
          method: 'GET',
          headers: {
              'Authorization': `Bearer ${token}`,
          },
      });

      if (!response.ok) {
          throw new Error('Failed to download file');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Create an anchor element and trigger a download
      const a = document.createElement('a');
      a.href = url;
      a.download = `file_${id}.csv`; // Default filename
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
  } catch (error) {
      console.error(error);
      alert('Failed to download CSV file');
  }
};


  const handleDeleteImage = async (imageId) => {
    try {
        const token = localStorage.getItem(ACCESS_TOKEN);
        const response = await fetch(`http://127.0.0.1:8000/api/images/${imageId}/`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to delete the image.");
        }

        alert("Image deleted successfully.");
        // Refresh images data after deletion
        fetchImageData();
    } catch (error) {
        console.error("Error deleting image:", error);
    }
};

  const handleImageDownload = async (imageUrl, fileName) => {
    try {
      const response = await fetch(imageUrl, { method: "GET" });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName || "graph_image.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading image:", error);
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
            <th>Download</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              <td>{row.display_id}</td>
              <td>{new Date(row.upload_date).toLocaleString()}</td>
              <td>{row.file_name}</td>
              <td>
                <button
                  className="download-btn"
                  onClick={() => handleDownloadCSV(row.id)}
                >
                  Download CSV
                </button>
              </td>
              <td>
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

      {/* Section for Uploaded Images */}
      <h2>Uploaded Graph Images</h2>
      <table className="history-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Image</th>
            <th>Download</th>
            <th>Actions</th>
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
                  <button
                    className="download-btn"
                    onClick={() =>
                      handleImageDownload(
                        `http://127.0.0.1:8000${img.image_data}`,
                        `graph_${img.id}.png`
                      )
                    }
                  >
                    Download
                  </button>
                </td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteImage(img.id)}
                  >
                    ❌
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No images uploaded yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;



