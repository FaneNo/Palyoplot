import React from "react";
import styles from "../cssPages/homePage.module.css";

import step1Image from "../assets/dashboard.png";
import step2Image from "../assets/upload.png";
import step3Image from "../assets/compatibleFile.png";
import step4Image from "../assets/chooseGraph.png";
import step5Image from "../assets/samplePlot.png";


const Step = ({ title, description, image }) => (
  <div className={styles.columnsContainer}>
    <div className={styles.textColumn}>
      <h2 className={styles.BulletHeading}>{title}</h2>
      <p>{description}</p>
    </div>
    <div className={styles.tutorialimageColumn}>
      <img src={image} alt={title} className={styles.imageSample} />
    </div>
  </div>
);

const steps = [
  {
    title: "Step 1: Getting Started",
    description: "Navigate to the Dashboard page in the Navigation Bar.",
    image: step1Image,
  },
  {
    title: "Step 2: Loading CSV",
    description: "Click the Upload CSV File button on the right-hand side.",
    image: step2Image,
  },
  {
    title: "Step 3: Choose Compatible File",
    description: "Upload compatible CSV file.",
    image: step3Image,
  },
  {
    title: "Step 4: Choose Graph Type",
    description: "Choose Line, Bar or Area graph in the dropdown menu.",
    image: step4Image,
  },
  {
    title: "Step 5: Display Graph",
    description: "Chosen CSV should display as shown.",
    image: step5Image,
  }
];

function Tutorial() {
  return (
    <>
    
    <div className={styles.homePageBody}>
      <div className={styles.homeDescrip}>
        <h1 className={styles.homeTitle}>Tutorial: Getting Started with Palyoplot</h1>
        <p className={styles.homeText}>
          Welcome to the Palyoplot tutorial! Follow these steps to get started.
        </p>
        {/* Render each step */}
        {steps.map((step, index) => (
          <Step key={index} title={step.title} description={step.description} image={step.image} />
        ))}
        <h2 className={styles.BottomHeading}>Ready to Plot?</h2>
      </div>
    </div>
  
    </>
  );
}

export default Tutorial;
