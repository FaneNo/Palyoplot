import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../cssPages/homePage.module.css'
import DashboardNav from '../components/dashboardNav';
import samplePlot from "../assets/samplePlot.png"

function Home() {
  const [message, setMessage] = useState('');

  //this is calling the Django API and puting the message into the message variable
  useEffect(() => {
    axios.get('http://localhost:8000/api/hello-world/')
      .then(response => {
        setMessage(response.data.message);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  return (
    <>
    <div>

      </div>
      
        <div className={`${styles.homePageBody}`}>
          
          <div className={`${styles.homeDescripBox}`}>
              <div className={`${styles.homeDescripLeft}`}>
                <h1 className={`${styles.homeTitle}`}>Palyoplot</h1>
                <p className={`${styles.homeText}`}> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. </p>
              </div>
              
            <div className={`${styles.imageRight}`}>
              <img src={samplePlot} className={`${styles.imageSample}`} alt="Sample plot image"/>
            </div>
          </div>
    </div>
    </>
    
  );
}

export default Home;