import api from "../api";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../cssPages/historyTable.css";

function DataTable() {
  const [data, setData] = useState([]);
  // uncomment const navigate if handleDownload is brought back
  // const navigate = useNavigate();

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

  // Commenting out in case we want it later, not currently used
  /*
  const handleDownload = (id) => {
    console.log(`Download data for id: ${id}`);
    navigate("/dashboard");
  };
  */

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
