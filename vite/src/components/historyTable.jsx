import React, { useState, useEffect, memo } from "react";
import { useNavigate } from "react-router-dom";
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import api from "../api";
import "../cssPages/historyTable.css";

// Memoized row component
const Row = memo(({ data, index, style }) => {
  const { items, onGraph, onDelete } = data;
  const row = items[index];

  if (!row) return null;

  return (
    <div style={style} className="table-row">
      <div className="table-cell id-column">{row.display_id}</div>
      <div className="table-cell date-column">
        {new Date(row.upload_date).toLocaleString()}
      </div>
      <div className="table-cell csv-column">
        <span className="csv-link">{row.file_name}</span>
      </div>
      <div className="table-cell graph-column">
        <button
          className="graph-btn"
          onClick={() => onGraph(row.id)}
        >
          Graph Now
        </button>
      </div>
      <div className="table-cell delete-column">
        <button
          className="delete-btn"
          onClick={() => onDelete(row.id)}
        >
          ❌
        </button>
      </div>
    </div>
  );
});

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
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/csv_files/${id}/`);
      await fetchData();
    } catch (error) {
      console.error("Error deleting file", error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ height: '400px', width: '100%' }}>
      <AutoSizer>
        {({ height, width }) => (
          <>
            <div className="table-header" style={{ width }}>
              <div className="header-cell id-column">ID</div>
              <div className="header-cell date-column">Date Created</div>
              <div className="header-cell csv-column">File</div>
              <div className="header-cell graph-column">Graph</div>
              <div className="header-cell delete-column">Delete</div>
            </div>
            <List
              height={height - 40} // Subtract header height 
              itemCount={data.length}
              itemSize={50}
              width={width}
              itemData={{
                items: data,
                onGraph: handleGraphClick,
                onDelete: handleDelete
              }}
            >
              {Row}
            </List>
          </>
        )}
      </AutoSizer>
    </div>
  );
};

export default memo(DataTable);