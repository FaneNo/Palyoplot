import React, { useState, useRef } from "react";
import styles from "../cssPages/dialogStyles.module.css";
import dashboardStyles from "../cssPages/dashboardPage.module.css";


const CSVUploadDialog = () => {
    const [open, setOpen] = useState(false);
    const dialogRef = useRef(null);

    const openDialog = () => {
        setOpen(true);
        dialogRef.current.show();
    };

    const closeDialog = () => {
        setOpen(false);
        dialogRef.current.close();
    };
    

    return (
        <div>
            <button onClick={openDialog} className={dashboardStyles.uploadButton}>
                Upload CSV File
            </button>

            <dialog ref={dialogRef} className={styles.dialogBox}>
                <h2>CSV File Upload Criteria</h2>
                <ul>
                    <li>The file must be in CSV format.</li>
                    <li>The first row should contain column headers.</li>
                    <li>The file size should not exceed 5 MB.</li>
                    <li>The CSV must contain at least X and Y columns for plotting.</li>
                </ul>
               
                <button onClick={closeDialog} className={styles.closeButton}>
                    Close
                </button>
            </dialog>
        </div>
    );
}

export default CSVUploadDialog;