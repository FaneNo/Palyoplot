import styles from "../cssPages/historyPage.module.css";
import React, { useState } from "react";
import DashboardNav from "../components/dashboardNav";
import DataTable from "../components/test";

function History() {
  return (
    <>
      <div className={`${styles.hisotryBody}`}>
        <div className={`${styles.historyNavBox}`}>
          <DashboardNav />
          <div className={`${styles.hisotryNavLeft}`}>
            <div className={`${styles.historyBox}`}>
                <DataTable/>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default History;
