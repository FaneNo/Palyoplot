import React from "react";
import styles from "../cssPages/homePage.module.css";

import step1Image from "../assets/dashboard.png";
import step2Image from "../assets/step2.png";
import step2RegisterImage from "../assets/step2_register.png";
import step3Image from "../assets/step3.png";
import step4Image from "../assets/compatibleFile.png";
import step5Image from "../assets/step5.png";
import step6UploadImage from "../assets/step6_upload.png";
import step6DownloadImage from "../assets/step6_download.png";
import step7Image from "../assets/step7.png";

const Step = ({ title, description, images, stepNumber }) => (
  <div className={styles.columnsContainer}>
    <div className={styles.textColumn}>
      <h2 className={styles.BulletHeading}>{title}</h2>
      <p>{description}</p>
    </div>
    <div
      className={`${styles.tutorialimageColumn} ${
        stepNumber === 6 ? styles.step6Images : ""
      } ${stepNumber === 2 ? styles.step2Images : ""}`}
    >
      {images.map((image, idx) => (
        <img
          key={idx}
          src={image}
          alt={`${title} image ${idx + 1}`}
          className={styles.imageSample}
        />
      ))}
    </div>
  </div>
);

const steps = [
  {
    title: "Step 1: Getting Started",
    description: "Navigate to the Dashboard page in the navigation bar.",
    images: [step1Image],
  },
  {
    title: "Step 2: Log In",
    description:
      "On the Dashboard page, log in with your username and password if you already have an account. If not, click 'Register' to create one.",
    images: [step2Image, step2RegisterImage],
  },
  {
    title: "Step 3: Loading CSV",
    description:
      "Once logged in, click the 'Select CSV File' button on the left-hand side.",
    images: [step3Image],
  },
  {
    title: "Step 4: Choosing Compatible File",
    description:
      "Select and upload a compatible CSV file from your computer.",
    images: [step4Image],
  },
  {
    title: "Step 5: Using the Graphing Tools",
    description:
      "After uploading a compatible CSV file, you will have various options to customize how your graph looks. In this step, we'll guide you through using these customization options.\n\nTo display your graph, you must select which Y-axis column to graph using the 'Select Y-axis Column' dropdown menu. Once you have chosen the Y-axis column, you have the option to add a second Y-axis column using the 'Second Y-Axis Column' dropdown menu.\n\nYou can choose to use a line, bar, or area graph using the 'Plot Type' dropdown menu. You can also choose the orientation of the graph using the 'Orientation' dropdown menu. You can flip the Y-axis (or axes) using the 'Reverse Y-axis' checkbox.\n\nAdditionally, you have the ability to change the names for the Y-axis (or axes), X-axis, and graph title.\n\nThe 'Edit Taxa Selection' button allows you to include or exclude taxa, reorder them within life forms, and set the font style.\n\nThe 'Edit Life Forms' button allows you to edit life form names and colors, reorder them, and add or delete life forms.\n\nThe 'Assign Taxa to Life Forms' button allows you to assign taxa to any life form.\n\nOnce you're done using these buttons, you can hide them to declutter your screen.",
    images: [step5Image],
  },
  {
    title: "Step 6: Done With Graph?",
    description:
      "After finishing your graph, you have the option to upload your graph image or CSV file to your Palyoplot account using the 'Upload CSV File' and 'Upload Graph Image' buttons located under the graph. You can view these uploads in the 'History' tab, which can be found on the left side of the page. You can also download your graph to your computer using the 'Download Graph' button at the bottom of the page.",
    images: [step6UploadImage, step6DownloadImage],
  },
  {
    title: "Step 7: History Page",
    description:
      "Navigate to the History page by clicking the 'History' tab. Here, you can download your uploaded data sets and graph images. This page also allows you to delete your data from the database.",
    images: [step7Image],
  },
];

function Tutorial() {
  return (
    <div className={styles.homePageBody}>
      <div className={styles.homeDescrip}>
        <h1 className={styles.homeTitle}>
          Tutorial: Getting Started with Palyoplot
        </h1>
        <p className={styles.homeText}>
          Welcome to the Palyoplot tutorial! Follow these steps to get started.
        </p>
        {/* Render each step */}
        {steps.map((step, index) => (
          <Step
            key={index}
            title={step.title}
            description={step.description}
            images={step.images}
            stepNumber={index + 1}
          />
        ))}
        <h2 className={styles.BottomHeading}>Ready to Plot?</h2>
      </div>
    </div>
  );
}

export default Tutorial;
