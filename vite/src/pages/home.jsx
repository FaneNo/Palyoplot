import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../cssPages/homePage.module.css";
import samplePlot from "../assets/samplePlot.png";


function Home() {
  //const [message, setMessage] = useState("");

  //this is calling the Django API and puting the message into the message variable
  // useEffect(() => {
  //   axios
  //     .get("http://localhost:8000/api/hello-world/")
  //     .then((response) => {
  //       setMessage(response.data.message);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }, []);

  return (
    <>
      <div className={styles.homePageBody}>
        <div className={styles.homeDescrip}>
          <h1 className={styles.homeTitle}>Data at Your Fingertips - Welcome to Palyoplot</h1>
          <p className={styles.homeText}>
            Aimed at geospatial scientists, Palyoplot was created to help simplify 
            the visualization and creation of multi-axis stratigraphic plotting of 
            Quaternary Science Data. 
          </p>
          <p className={styles.homeText}>
            With the goal of simplifying how scientists are able to visualize
            specific data trends, Palyoplot was designed as the bridge from the 
            coding world to the creation of publication quality plots.
          </p>
          {/*2 column layout beneath text */}
          <div className={styles.columnsContainer}>
            {/*left column for text and bullet points */}
            <div className={styles.textColumn}>
              <h2 className={styles.BulletHeading}>Why Choose Palyoplot?</h2>
              <ul className={styles.bulletPoints}>
                <li>Customizable stratigraphic diagrams of proxy records 
                  (including area, line, and bar graphs)</li>
                <li>User-defined groups and ordered taxa</li>
                <li>Customizable y and x-axis intervals</li>
              </ul>
            </div>
            {/*Right column for image */}
            <div className={styles.imageColumn}>
              <img
                src={samplePlot}
                className={styles.imageSample}
                alt="Sample plot image"
              />
            </div>
          </div>
          <h2 className={styles.BottomHeading}>View our Tutorial Page or Click Login/Register to Get Started</h2>
        </div>
      </div>
    </>
  );
}

export default Home;
